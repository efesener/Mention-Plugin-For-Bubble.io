function(instance, properties, context) {

    // Get mentioned users' names and unique ids
    const usersName = instance.data.mentionedUsersName;
    const usersId = instance.data.mentionedUsersId;

    // Get input
    const inputElement = instance.data.inputElement;


    // Get input's value
    let customizedOutput = inputElement.value;


    // Get properties
    const boldMention = properties.boldMention;
    const enableUrlDirecting = properties.enableUrlDirecting;
    let directingPageName = "";
    if(properties.directingPageName !== null){
        directingPageName = properties.directingPageName;
    }
    const sendAs = properties.sendAs;
    const parameterKey = properties.parameterKey;

    // RGBA to RGB
    function rgbaToHex(color) {
        // RGBA değerlerini parçalara ayır
        var rgba = color.replace(/[rgba()]/g, '').split(',');

        // Hex değerleri hesapla
        var r = parseInt(rgba[0]);
        var g = parseInt(rgba[1]);
        var b = parseInt(rgba[2]);
        var a = Math.round(parseFloat(rgba[3]) * 255);

        // Hex kodunu oluştur
        var hex = '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);

        return hex;
    }

    let mentionColor = properties.mentionColor;
    if(!mentionColor.includes('#')){
		mentionColor = rgbaToHex(properties.mentionColor);
	}
   
    // Defination of prefix and suffix of mention text
    let preMention = "";
    let postMention = "";

    // If else conditions related with customization
    if (boldMention) {
        preMention += "[b]";
        postMention += "[/b]";
    }

    if (mentionColor !== null) {
        preMention = preMention + "[color=" + mentionColor + "]";
        postMention = "[/color]" + postMention;
    }

    if (enableUrlDirecting) {
        let websiteHomeUrl = document.location.origin;

        if(document.location.pathname.includes('/version-test')){
            websiteHomeUrl += '/version-test';
        }

        let directPath = "/{id}";

        if (sendAs == 'parameter') {
            directPath = "?" + parameterKey + "={id}";
        }

        const target = properties.openInNewTab ? "_blank" : "_self";
        preMention = `[url=${websiteHomeUrl}/${directingPageName}${directPath} target=${target}]` + preMention;
        postMention = postMention + "[/url]";
    }



    let valueToBeReplaced = "";

    for (var i = 0; i <= usersName.length; i++) {

        if (inputElement.value.includes('@' + usersName[i])) {

            let preMentionModified = preMention;
            preMentionModified = preMentionModified.replace('{id}', usersId[i]);

            valueToBeReplaced = preMentionModified + '@' + usersName[i] + postMention + " ";
            customizedOutput = customizedOutput.replace('@' + usersName[i] + " ", valueToBeReplaced);
        }

    }

    instance.publishState('customizedOutput', customizedOutput);
    instance.triggerEvent('customizedOutputReady');

}