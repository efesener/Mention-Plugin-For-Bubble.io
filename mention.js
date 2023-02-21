function(instance, context) {
	
    
  
    /*
    
    menü her türlü açılsın, menü açıkken itemler yüklenmeye devam edebilir
    
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
	
    var wholeListUploaded = false; // the whole list uploaded or not
    
    
    var i;
    
    instance.data.searchText = "";
    instance.data.menu = document.getElementById("userMentionMenu");
    
    // FUNCTION DEFINATIONS
    
    // this function checks which user selected and trigger the addMention function, and after that remove the menu
    var itemSelectionCheck = (e) => {  
        
        var selectedEl = e.target;

        if(selectedEl.tagName !== 'P'){
            if(e.target.parentElement.tagName !== 'P'){
                selectedEl = selectedEl.parentElement.parentElement;
            }else{
                selectedEl = selectedEl.parentElement;
            }
        }


        if(selectedEl.id.includes("opt-")){ // We'd like to run the function only if a user item selected
            addMention(selectedEl.id); 
            
          }
        
        var menu = document.getElementById("userMentionMenu");
        if(menu !== null){
            removeGroupFocus(menu);
        }
    };

    // this function checks which element is clicked by the user
    var clickedElementIsMenu = (e) => { // adding an element listener do understand an element is clicked except menu
        
        if(!e.target.id.includes("userMentionMenu")){ // if the element is not the menu, we removing the menu
            var menu = document.getElementById("userMentionMenu");
            if(menu !== null){
                removeGroupFocus(menu);
                document.removeEventListener('click', clickedElementIsMenu);
            }
        }
    }

    instance.data.letterCount = 0;
	
    function appendGroupFocus(menu){
        document.body.appendChild(menu);
        
        let richEditor = document.querySelector(`#${el} > .ql-container > div.ql-editor`); // related rich text editor
        richEditor.addEventListener("input", listenKeys);
    }
    
    var listenKeys = (e) => { // after the menu opened we listen all key inputs
        let selection = window.getSelection(); // learn selection's position
      
        instance.data.letterCount++; 
        const range = selection.getRangeAt(0);
        
        const start = range.startOffset - instance.data.letterCount;

        const searchString = range.startContainer.textContent.substring(start, range.startOffset); // this is the whole text in the line
        
        
        
        const atIndex = searchString.indexOf("@"); // we only need the text after the '@', so learning '@'s position

        const searchText = searchString.substring(atIndex + 1).toLowerCase(); // the text after '@'

        
        instance.data.searchText = searchText;
        
        // var menu = document.getElementById("userMentionMenu");
        var menu = instance.data.menu;

        if(menu !== null){
            var ps = menu.querySelectorAll("p"); // all p tags in the menu
            
            // we're hiding all the p tags which doesn't contain the search text
            
            for (var i = 0; i < ps.length; i++) {
            
                if (!ps[i].textContent.toLowerCase().includes(searchText)) { // the menu item includes the search text or not
                
                    ps[i].style.display = "none";
                
                }
            
                else{
                
                    ps[i].style.display = "block";
                
                }
        
        }
       }
      // if the menu is not opened yet and the search text has more than one character the menu will be visible
       
       if(document.getElementById("userMentionMenu") == null && instance.data.searchText.length > 1){
           
           appendGroupFocus(menu);
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
       }
        
       
       // if the menu is visible but search line doesn'T contain '@' character, we are removing the menu
        
       if(!searchString.includes('@') && menu !== null){
           
            removeGroupFocus(menu);
           
       }
       
      
    }

    function removeGroupFocus(menu){
        if(wholeListUploaded){
            menu.parentNode.removeChild(menu);
            let richEditor = document.querySelector(`#${el} > .ql-container > div.ql-editor`); // related rich text editor
            richEditor.removeEventListener("input", listenKeys);
            instance.data.letterCount = 0;
        }else{
            menu.remove();
            let richEditor = document.querySelector(`#${el} > .ql-container > div.ql-editor`); // related rich text editor
            richEditor.removeEventListener("input", listenKeys);
            instance.data.letterCount = 0;
        }
    }
    
    function openGroupFocus(userNames) {
		
        
        // creating "menu" element here
        var menu = document.createElement("div");
        menu.setAttribute('id', "userMentionMenu"); // add the ID 
        menu.classList.add("dropdown-menu");
        menu.style.position = "absolute";
        menu.style.left ="0px";
        menu.style.top = "0px";
        menu.style.width = "200px";
        menu.style.height = "auto";
        menu.style.maxHeight = "300px";
        menu.style.zIndex = "99999";
        menu.style.overflowY = "scroll";
        menu.style.backgroundColor = instance.data.background_color;
        menu.style.boxShadow = "0px 4px 6px 0px rgba(0, 0, 0, 0.1)";
        menu.style.borderRadius = "4px";
        
        

        menu.addEventListener('click', itemSelectionCheck);
        
        document.addEventListener('click', clickedElementIsMenu);
        
        instance.data.menu = menu;
        // adding user items into the menu
        
        for (var i = 0; i < userNames.length; i++) {
            
            var uniqueElementId = "opt-"+i // creating a unique element ID, thus we can listen the object
            var userItem = document.createElement("p"); 
            
            userItem.style.padding = "6px";

            userItem.style.display = "table";
			
            
            userItem.style.fontFamily = instance.data.font_face.split(':::')[0]+", sans-serif";
            userItem.style.fontWidth = instance.data.font_face.split(':::')[1];
            userItem.style.fontSize = instance.data.font_size+"px";
            userItem.style.color = instance.data.font_color;
            
            userItem.setAttribute('id', uniqueElementId);

            userItem.onmouseover = function() {
                this.style.transition = "background-color 0.1s ease";
                this.style.backgroundColor = instance.data.theme_color;
            }
            
            userItem.onmouseout = function() {
                this.style.transition = "background-color 0.1s ease";
                this.style.backgroundColor = "";
            }

            userItem.onclick = function() {
                this.style.transition = "background-color 0.1s ease";
                this.style.backgroundColor = "";
            }

            
            var userRow = document.createElement("div");
            userRow.style.height = "auto";
            userRow.style.display = "table";
            
            if(userImages[i]){
                var profileImg = document.createElement("img");
                profileImg.setAttribute('src', userImages[i]);
                profileImg.style.width = "30px";
                profileImg.style.height = "30px";
                profileImg.style.borderRadius = "50%";
                profileImg.style.verticalAlign = "middle";
                userRow.appendChild(profileImg);
            }

            var nameText = document.createElement("span");
            nameText.innerHTML = userNames[i];
            nameText.style.marginLeft = "10px";
            nameText.style.verticalAlign = "middle";

            
            userRow.appendChild(nameText);
            
            userItem.appendChild(userRow);

            menu.appendChild(userItem);
        }
               
        let richEditor = document.querySelector(`#${el} > .ql-container > div.ql-editor`); // related rich text editor
	 
        
       
       // richEditor.addEventListener("input", listenKeys(menu));
        richEditor.addEventListener("input", listenKeys);
        
        
    }
	
    function addMention(elementId){ // add the selected users name into the input
        
        //var selectedElement = document.getElementById(elementId); // get the selected element
        var selectedElement = document.querySelector(`#${elementId} > div > span`);
       

        var theUsersName = selectedElement.innerHTML;
        
        if(boldMention){
        	var valueToBeReplaced = "<strong><span style='color:"+mentionColor+"'>"+theUsersName+"</span></strong> ";   
        }else{
            var valueToBeReplaced = "<span style='color:"+mentionColor+"'>"+theUsersName+"</span> "; 
        }
        
        mentionedUsersName.push(theUsersName); // adding the mentioned user's name to mentioned users name list
        mentionedUsersId.push(userIds[elementId.split('-')[1]]); // adding the mentioned user's uid to mentioned users ID list
       
        instance.data.checkUsersName.push(theUsersName);
        instance.data.checkUsersId.push(userIds[elementId.split('-')[1]]);

        
        instance.publishState('mentionedUsersId', mentionedUsersId);
        instance.publishState('mentionedUsersName', mentionedUsersName);
    
        var richTextElement = document.querySelector(`#${el} > .ql-container > div.ql-editor`);
      
    
        
        richTextElement.innerHTML = richTextElement.innerHTML.replace("@"+instance.data.searchText, valueToBeReplaced);
        
        instance.triggerEvent('mention_added');
        
    
        richTextElement.focus();
  
         setTimeout(function(){
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
        
        
        
        el = properties.elementId;
        
        scrollY = window.pageYOffset; // get current scroll position
        
		focused = properties.focused; // is the richtext editor focused or not
	 	
        mentionColor = properties.mentionColor;
        boldMention = properties.boldMention;
	
        /* BİRİNCİ 
		if(userNames.length == 0){
            
        	userNames = properties.userNames.get(0, 99999999);
        	userIds = properties.userIds.get(0, 99999999);
            
            if(properties.userImages){
                userImages = properties.userImages.get(0, 99999999);
            }
                        
        }
		
        console.log("usernames length = ", userNames.length);
		*/
        
        /* İKİNCİ
        if(uploadingList){
            userNames = userNames.concat(properties.userNames.get(listStart, listStart+1000));
            console.log(userNames);
            
            userIds.push.apply(properties.userIds.get(listStart, listStart+1000));

            if(properties.userImages){
                userImages.push.apply(properties.userImages.get(listStart, listStart+1000));
            }
            
            console.log("usernames length = ", userNames.length);
            console.log("properties name = ", properties.userNames.get(listStart+1000,10).length);
			
            listStart += 1000;
            
            if(properties.userNames.get(userNames.length,10).length == 0){
            	uploadingList = false;
                console.log("end");
            }
        }
        */
        
        
        /* ÜÇÜNCÜ
        while(uploadingList){
            
            userNames = userNames.concat(properties.userNames.get(listStart++,1));
            console.log(userNames);               
            
        }
        */
        
        var addUserImages = properties.userImages;
        
        while(uploadingList){
            
            var allUserNames = properties.userNames.get(listStart,1000);
            var allUserIds = properties.userIds.get(listStart,1000);
            
            if(allUserNames[0] == undefined){
                
            	uploadingList = false;   
                wholeListUploaded = true;
                
            }else{
                
                userNames = userNames.concat(allUserNames);
                userIds = userIds.concat(allUserIds);
                
                if(addUserImages){
                    
                    var allUserImages = properties.userImages.get(listStart,1000);
                	userImages = userImages.concat(allUserImages);
                    
           	    }
                
           	    listStart += 1000;
                
            }
            
            
        }
        
        
    }
    
    
    // LISTENER DEFINATIONS
    
    

    
	document.addEventListener('keydown', function(event) {
        
		if (event.key === '@') {
   			
            
            
            if(focused){
                
                if(wholeListUploaded && instance.data.menu !== null){
                    appendGroupFocus(instance.data.menu);   
                }else{
             	   openGroupFocus(userNames)
                }
              	    

            }
            
		}
        
	});
    
    
    
}




    