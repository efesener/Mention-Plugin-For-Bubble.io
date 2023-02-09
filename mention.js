function(instance, context) {
	
    
    /*
    	
        
    	CONTROL AKSİYONU YAPICAZ 
        STYLING YAPICAZ
        VE BİTECEK
    
    */
    
    
  
    // VARIABLE DEFINATIONS
    
    
    
    var el;
	var focused; // variable for learning is the richtext editor focused or not
    var scrollY; // variable for getting current scroll position
    
    var userNames = []; 
    var userIds = [];
    
    var mentionedUsersName = []; // array for storing mentioned users name
    var mentionedUsersId = []; // array for storing mentioned users ID
    
    var i;
    
    instance.data.searchText = "";
    
    // FUNCTION DEFINATIONS
    
    var itemSelectionCheck = (e) => {  // adding an element listener do understand which user item selected
        
        if(e.target.id.includes("opt-")){ // We'd like to run the function only if a user item selected
            addMention(e.target.id); 
            
          }
         
        removeGroupFocus(menu);
    };

    function removeGroupFocus(el){
        el.remove();
    }
    
    function openGroupFocus(x, y, userNames) {
        
        
        
    	 var menu = document.createElement("div");
         menu.setAttribute('id', "userMentionMenu"); // add the ID 
         menu.classList.add("dropdown-menu");
         menu.style.position = "absolute";
         menu.style.left = x + "px";
         menu.style.top = y + "px";
         menu.style.width = "200px";
         menu.style.height = "400px";
         menu.style.backgroundColor = "lightblue";
         menu.style.zIndex = "99999";
         menu.style.overflowY = "scroll";
        
         menu.addEventListener('click', itemSelectionCheck);
        
        document.addEventListener('click', (e) => // adding an element listener do understand an element is clicked except menu
        {
     
            if(!e.target.id.includes("userMentionMenu")){ // if the element is not the menu, we removing the menu
            	removeGroupFocus(menu);
                
      		}
            
            
            
          }
        );
        
        // adding user items into the menu
        
        for (var i = 0; i < userNames.length; i++) {
            
            var uniqueElementId = "opt-"+i // creating a unique element ID, thus we can listen the object
            
            var userItem = document.createElement("p"); 
            userItem.setAttribute('id', uniqueElementId); // add the ID 
            userItem.innerHTML = userNames[i];
            menu.appendChild(userItem);
            
           
            
        }
         
			
        
        
        
       
               
        let richEditor = document.querySelector(`#${el} > .ql-container > div.ql-editor`); // related rich text editor
	 
        var letterCount = 0; // it will be increased while the user typing
       
        richEditor.addEventListener("input", function listenKeys() { // after the menu opened we listen all key inputs
            
	 		let selection = window.getSelection(); // learn selection's position
          
           
            letterCount++; 
            const range = selection.getRangeAt(0);
          
            const start = range.startOffset - letterCount;
         
            const searchString = range.startContainer.textContent.substring(start, range.startOffset); // this is the whole text in the line
             
           
            const atIndex = searchString.indexOf("@"); // we only need the text after the '@', so learning '@'s position
        
            const searchText = searchString.substring(atIndex + 1).toLowerCase(); // the text after '@'
         
            console.log(searchText);
	  	
            instance.data.searchText = searchText;
           
        
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
            
		   // if the menu is not opened yet and the search text has more than one character the menu will be visible
            
           if(document.getElementById("userMentionMenu") == null && instance.data.searchText.length > 1){
            	document.body.appendChild(menu);
           }
            
           
           // if the menu is visible but search line doesn'T contain '@' character, we are removing the menu
            
           if(!searchString.includes('@') && menu !== null){
               
                removeGroupFocus(menu);
               
           }
            
           
        });
        
        
    }
	
    function addMention(elementId){ // add the selected users name into the input
        
        var selectedElement = document.getElementById(elementId); // get the selected element
        
        var theUsersName = selectedElement.innerHTML;
        
        var valueToBeReplaced = "<strong>"+theUsersName+"</strong> "; 
        
        mentionedUsersName.push(theUsersName); // adding the mentioned user's name to mentioned users name list
        mentionedUsersId.push(userIds[elementId.substr(elementId.length - 1)]); // adding the mentioned user's uid to mentioned users ID list
       
    	console.log(mentionedUsersName);
        console.log(mentionedUsersId);
        
        instance.publishState('mentionedUsersId', mentionedUsersId);
        instance.publishState('mentionedUsersName', mentionedUsersName);
    
        var richTextElement = document.querySelector(`#${el} > .ql-container > div.ql-editor`);
      
    
        
        richTextElement.innerHTML = richTextElement.innerHTML.replace("@"+instance.data.searchText, valueToBeReplaced);;
    }
    

    // AFTER GETTING PROPERTIES FROM THE "UPDATE" FUNCTION
    
	instance.data.triggerMe = (properties) => {
      	
        
        
		instance.data.ready = false;
        
        el = properties.elementId;
        
        scrollY = window.pageYOffset; // get current scroll position
        
		focused = properties.focused; // is the richtext editor focused or not
	 	
		if(userNames.length == 0){
            
        	userNames = properties.userNames.get(0, 99999999);
        	userIds = properties.userIds.get(0, 99999999);
            
                        
        }
        

    }
    
    
    // LISTENER DEFINATIONS
    
    

    
	document.addEventListener('keydown', function(event) {
        
		if (event.key === '@') {
   			
            
            
            if(focused){
                
                
                console.log("bobo");
                
            	// Rich text editörün seçili olan karakterleri gösteren range nesnesini alın
                var range = window.getSelection().getRangeAt(0);

                // Seçili karakterlerin görüntülenen sayfada kapladığı alanın özelliklerini alın
                var rect = range.getBoundingClientRect();

                // Karakterin x ve y pozisyonlarını hesaplayın
                var x = rect.left;
                var y = rect.top;

                    y = y + scrollY + 20;

                    //alert(range+" "+ rect+ " "+x+" "+y)
                openGroupFocus(x, y, userNames)
                
              	    

            }
            
		}
        
	});
    
    
    
}




    