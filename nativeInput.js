function(instance, context) {



    /*
    
    İlk harf yazıldığında ilk harfe göre p elemnetleri oluşturulacak
    Sonrasında data-classname attribute unun searchText i içermesine göre p elementlerin visibilitesi güncellenecek
    Menü kapatılırsa bütün p elementleri remove edilecek.
    
    */


    // VARIABLE DEFINATIONS



    var el;
    var focused; // variable for learning is the richtext editor focused or not
    var scrollY; // variable for getting current scroll position

    var mentionColor = '#ff0000';
    var boldMention = true;

    var userNames = [];
    var userIds = [];
    var userImages = [];

    var mentionedUsersName = []; // array for storing mentioned users name
    var mentionedUsersId = []; // array for storing mentioned users ID

    instance.data.checkUsersName = [];
    instance.data.checkUsersId = [];

    var emptyStateText = "User data not found!"

    var wholeListUploaded = false; // the whole list uploaded or not

    let currentIndex = 0; // for keyborad interactions

    var i;

    instance.data.searchText = "";
    instance.data.menu = document.getElementById("userMentionMenu");

    // FUNCTION DEFINATIONS

    // this function checks which user selected and trigger the addMention function, and after that remove the menu
    var itemSelectionCheck = (e) => {

        var selectedEl = e.target;

        if (selectedEl.tagName !== 'P') {
            if (e.target.parentElement.tagName !== 'P') {
                selectedEl = selectedEl.parentElement.parentElement;
            } else {
                selectedEl = selectedEl.parentElement;
            }
        }


        if (selectedEl.id.includes("opt-")) { // We'd like to run the function only if a user item selected
            addMention(selectedEl.id);

        }

        var menu = document.getElementById("userMentionMenu");
        if (menu !== null) {
            removeGroupFocus(menu);
        }
    };

    // this function checks which element is clicked by the user
    var clickedElementIsMenu = (e) => { // adding an element listener do understand an element is clicked except menu

        if (!e.target.id.includes("userMentionMenu")) { // if the element is not the menu, we removing the menu
            var menu = document.getElementById("userMentionMenu");
            if (menu !== null) {
                removeGroupFocus(menu);
                document.removeEventListener('click', clickedElementIsMenu);
            }
        }
    }





    const keyboardInteractions = (event) => {

        const menuOptions = instance.data.menu.querySelectorAll('.mention-visible');

        if (menuOptions.length > 0) {


            menuOptions[currentIndex].style.backgroundColor = "";


            if (event.key === 'ArrowDown') {
                currentIndex = (currentIndex + 1) % menuOptions.length;
            } else if (event.key === 'ArrowUp') {
                currentIndex = (currentIndex - 1 + menuOptions.length) % menuOptions.length;
            } else if (event.key === 'Enter') {

                addMention(menuOptions[currentIndex].id);
                event.preventDefault();
                if (instance.data.menu !== null) {
                    removeGroupFocus(instance.data.menu);
                    var richTextElement = document.querySelector(`#${el}`);

                    setTimeout(function () {
                        event.preventDefault();
                        richTextElement.focus();
                        const treeWalker = document.createTreeWalker(richTextElement, NodeFilter.SHOW_TEXT);
                        let lastTextNode = null;

                        while (treeWalker.nextNode()) {
                            lastTextNode = treeWalker.currentNode;
                        }

                        if (lastTextNode) {
                            const range = document.createRange();
                            range.setStart(lastTextNode, lastTextNode.length);
                            range.setEnd(lastTextNode, lastTextNode.length);

                            const selection = window.getSelection();
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }, 200);

                }
            } else {
                currentIndex = 0;
                menuOptions[currentIndex].style.backgroundColor = instance.data.theme_color;
                return;
            }

            menuOptions[currentIndex].focus();

            menuOptions[currentIndex].style.backgroundColor = instance.data.theme_color;
        }
    };

    function generateMenuItems() {
        menu = instance.data.menu;
        instance.data.emptyState.style.display = "none"; // make the empty state invisible

        const filteredUsers = userNames.filter(item => item.toLowerCase().startsWith(instance.data.searchText));

        for (var i = 0; i < filteredUsers.length; i++) {

            var uniqueElementId = "opt-" + i // creating a unique element ID, thus we can listen the object
            var userItem = document.createElement("p");

            userItem.style.padding = "6px";

            userItem.style.display = "table";


            userItem.style.fontFamily = instance.data.font_face.split(':::')[0] + ", sans-serif";
            userItem.style.fontWeight = instance.data.font_face.split(':::')[1];
            userItem.style.fontSize = instance.data.font_size + "px";
            userItem.style.color = instance.data.font_color;

            if (!i) {
                userItem.style.backgroundColor = instance.data.theme_color;
            }

            userItem.style.width = '100%';

            userItem.setAttribute('id', uniqueElementId);
            userItem.setAttribute('data-username', filteredUsers[i].toLowerCase().replaceAll(' ', ''));

            userItem.setAttribute('tabindex', 0); // to enable keyboard interactions

            userItem.classList.add("mention-visible");



            userItem.onmouseover = function () {
                this.style.transition = "background-color 0.1s ease";
                this.style.backgroundColor = instance.data.theme_color;
            }

            userItem.onmouseout = function () {
                this.style.transition = "background-color 0.1s ease";
                this.style.backgroundColor = "";
            }

            userItem.onclick = function () {
                this.style.transition = "background-color 0.1s ease";
                this.style.backgroundColor = "";
            }


            var userRow = document.createElement("div");
            userRow.style.height = "auto";
            userRow.style.display = "table";

            if (userImages[i]) {
                var profileImg = document.createElement("img");
                profileImg.setAttribute('src', userImages[userNames.indexOf(filteredUsers[i])]);
                profileImg.style.width = "30px";
                profileImg.style.height = "30px";
                profileImg.style.borderRadius = "50%";
                profileImg.style.verticalAlign = "middle";
                userRow.appendChild(profileImg);
            }

            var nameText = document.createElement("span");
            nameText.innerHTML = filteredUsers[i];
            nameText.style.marginLeft = "10px";
            nameText.style.verticalAlign = "middle";


            userRow.appendChild(nameText);

            userItem.appendChild(userRow);

            menu.appendChild(userItem);
        }
        if (filteredUsers.length < 1) {
            showEmptyState();
        }
    }

    function showEmptyState() {
        menu = instance.data.menu;

        instance.data.emptyState.style.display = "block";
        if (!menu.contains(instance.data.emptyState)) {
            menu.appendChild(instance.data.emptyState);
        }
    }

    instance.data.letterCount = 0;

    // this function appears the menu group

    function appendGroupFocus(menu) {

        let richEditor = document.querySelector(`#${el}`); // related rich text editor
        richEditor.addEventListener("input", listenKeys);
    }

    var listenKeys = (e) => { // after the menu opened we listen all key inputs
        console.log("the key is: ", e);

        instance.data.letterCount++;

        let selection = window.getSelection(); // learn selection's position

        

        const value = richEditor.value;
        const atIndex = searchString.indexOf("@"); // we only need the text after the '@', so learning '@'s position
        const searchText = value.substring(atIndex + 1, instance.data.letterCount).toLowerCase();
        /*
        const range = selection.getRangeAt(0);

        const start = range.startOffset - instance.data.letterCount;

        const searchString = range.startContainer.textContent.substring(start, range.startOffset); // this is the whole text in the line

        const searchText = searchString.substring(atIndex + 1).toLowerCase(); // the text after '@'
        */ 
        console.log(searchText);

        instance.data.userInput = value.substring(atIndex + 1, instance.data.letterCount);

        instance.data.searchText = searchText;

        console.log("uuuuuuu");
        console.log(searchText);
        // var menu = document.getElementById("userMentionMenu");
        var menu = instance.data.menu;
        // CHECKPOINT 1
        if (menu !== null) { // if the menu is already open
            var ps = menu.querySelectorAll('p[data-username*="' + searchText.replaceAll(' ', '') + '"]');
            var psNot = menu.querySelectorAll('p:not([data-username*="' + searchText.replaceAll(' ', '') + '"])');



            // we're hiding all the p tags which doesn't contain the search text



            for (var i = 0; i < ps.length; i++) {

                ps[i].style.display = "block";
                ps[i].classList.add('mention-visible');

            }

            for (var i = 0; i < psNot.length; i++) {

                psNot[i].style.display = "none";
                psNot[i].classList.remove('mention-visible');

            }

            if (menu.innerHTML.includes('display: block')) { // if there is at least one item that fits the search

                instance.data.emptyState.style.display = "none";

            }

            else if (instance.data.searchText.length > 1) { // if there is no item that fits the search

                showEmptyState();

            }

        }




        const childElements = menu.querySelectorAll("*");

        // if the menu is not opened yet and the search text has more than one character the menu will be visible

        if (document.getElementById("userMentionMenu") == null && instance.data.searchText.length > 1) {

            document.body.appendChild(menu);
            // Rich text editörün seçili olan karakterleri gösteren range nesnesini alın
            var range2 = window.getSelection().getRangeAt(0);

            // Seçili karakterlerin görüntülenen sayfada kapladığı alanın özelliklerini alın
            var rect = range2.getBoundingClientRect();



            // Karakterin x ve y pozisyonlarını hesaplayın
            var x = rect.left;
            var y = rect.top;

            y = y + scrollY + 20;

            menu.style.left = x + "px";
            menu.style.top = y + "px";

            generateMenuItems();
        }


        else if (document.getElementById("userMentionMenu") != null && instance.data.searchText.length > 1 && childElements[1] === undefined) {

            generateMenuItems();
        }

        // if the searchText's number of character lower than limit, then all the p tags will be removed
        else if (childElements[1] !== undefined && instance.data.searchText.length <= 1) {
            childElements.forEach((child) => {
                if (child.id !== 'mentionEmptyState') {
                    //child.parentNode.removeChild(child);
                    child.remove();
                }
            });
        }

        // if the menu is visible but search line doesn'T contain '@' character, we are removing the menu

        if (!searchString.includes('@') && menu !== null) {
            removeGroupFocus(menu);

        }


    }

    function removeGroupFocus(menu) {
        if (wholeListUploaded) {
            menu.parentNode.removeChild(menu);
            let richEditor = document.querySelector(`#${el}`); // related rich text editor
            richEditor.removeEventListener("input", listenKeys);
            instance.data.letterCount = 0;
            richEditor.focus();
        } else {
            menu.remove();
            let richEditor = document.querySelector(`#${el}`); // related rich text editor
            richEditor.removeEventListener("input", listenKeys);
            instance.data.letterCount = 0;
            richEditor.focus();
        }


        document.removeEventListener('keydown', keyboardInteractions);

        currentIndex = 0;
    }

    function openGroupFocus() {


        // creating "menu" element here
        var menu = document.createElement("div");
        menu.setAttribute('id', "userMentionMenu"); // add the ID 
        menu.classList.add("dropdown-menu");
        menu.style.position = "absolute";
        menu.style.left = "0px";
        menu.style.top = "0px";
        menu.style.width = "200px";
        menu.style.height = "auto";
        menu.style.maxHeight = "300px";
        menu.style.zIndex = "99999";
        menu.style.overflowY = "scroll";
        menu.style.overflowX = "hidden";
        menu.style.backgroundColor = instance.data.background_color;
        menu.style.boxShadow = "0px 4px 6px 0px rgba(0, 0, 0, 0.1)";
        menu.style.borderRadius = "4px";

        // creating "empty state" element here
        var emptyState = document.createElement("p");
        emptyState.setAttribute('id', 'mentionEmptyState');
        emptyState.innerHTML = emptyStateText;
        emptyState.style.fontFamily = instance.data.font_face.split(':::')[0] + ", sans-serif";
        emptyState.style.fontWeight = instance.data.font_face.split(':::')[1];
        emptyState.style.fontSize = instance.data.font_size + "px";
        emptyState.style.color = instance.data.font_color;
        emptyState.style.marginTop = "10px";
        emptyState.style.marginBottom = "10px";
        emptyState.style.marginLeft = "10px";
        emptyState.style.display = "none";

        instance.data.emptyState = emptyState;
        instance.data.menu = menu;

        menu.addEventListener('click', itemSelectionCheck);

        document.addEventListener('click', clickedElementIsMenu);

        console.log("robin");
        document.addEventListener('keydown', keyboardInteractions);


        // adding user items into the menu



        let richEditor = document.querySelector(`#${el}`); // related rich text editor



        // richEditor.addEventListener("input", listenKeys(menu));
        richEditor.addEventListener("input", listenKeys);


    }

    function addMention(elementId) { // add the selected users name into the input

        //var selectedElement = document.getElementById(elementId); // get the selected element
        var selectedElement = document.querySelector(`#${elementId} > div > span`);


        var theUsersName = selectedElement.innerHTML;

        if (boldMention) {
            var valueToBeReplaced = "<strong><span style='color:" + mentionColor + "'>" + theUsersName + "</span></strong> ";
        } else {
            var valueToBeReplaced = "<span style='color:" + mentionColor + "'>" + theUsersName + "</span> ";
        }

        mentionedUsersName.push(theUsersName); // adding the mentioned user's name to mentioned users name list
        mentionedUsersId.push(userIds[userNames.indexOf(theUsersName)]); // adding the mentioned user's uid to mentioned users ID list

        instance.data.checkUsersName.push(theUsersName);
        instance.data.checkUsersId.push(userIds[userNames.indexOf(theUsersName)]);


        instance.publishState('mentionedUsersId', mentionedUsersId);
        instance.publishState('mentionedUsersName', mentionedUsersName);

        var richTextElement = document.querySelector(`#${el}`);


        console.log(instance.data.userInput);
        console.log(instance.data.searchText);
        richTextElement.innerHTML = richTextElement.innerHTML.replace("@" + instance.data.userInput, valueToBeReplaced);

        instance.triggerEvent('mention_added');


        richTextElement.focus();

        setTimeout(function () {
            richTextElement.blur();
        }, 1);
    }

    var listStart = 0;
    var uploadingList = true;

    // AFTER GETTING PROPERTIES FROM THE "UPDATE" FUNCTION
    instance.data.triggerMe = (properties) => {



        instance.data.ready = false;

        instance.data.font_face = properties.bubble.font_face();
        instance.data.font_color = properties.bubble.font_color();
        instance.data.font_size = properties.bubble.font_size();
        instance.data.background_color = properties.backgroundColor;
        instance.data.theme_color = properties.themeColor;

        emptyStateText = properties.emptyStateText;

        el = properties.elementId;

        scrollY = window.pageYOffset; // get current scroll position

        focused = properties.focused; // is the richtext editor focused or not

        mentionColor = properties.mentionColor;
        boldMention = properties.boldMention;


        var addUserImages = properties.userImages;

        while (uploadingList) {

            var allUserNames = properties.userNames.get(listStart, 1000);
            var allUserIds = properties.userIds.get(listStart, 1000);

            if (allUserNames[0] == undefined) {

                uploadingList = false;
                wholeListUploaded = true;

            } else {

                userNames = userNames.concat(allUserNames);
                userIds = userIds.concat(allUserIds);

                if (addUserImages) {

                    var allUserImages = properties.userImages.get(listStart, 1000);
                    userImages = userImages.concat(allUserImages);

                }

                listStart += 1000;

            }


        }


    }


    // LISTENER DEFINATIONS




    document.addEventListener('keydown', function (event) {

        if (event.key === '@') {



            if (focused) {
                // üstteki ife neden hiç girmiyor ona bkıcaz @@@@@@@@@@@@@@@@@@@@

                if (wholeListUploaded && instance.data.menu !== null) {
                    appendGroupFocus(instance.data.menu);
                } else {
                    openGroupFocus();
                }


            }

        }

    });



}




