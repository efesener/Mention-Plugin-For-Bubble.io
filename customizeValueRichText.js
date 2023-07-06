function(instance, properties, context) {



    // Get mentioned users' names and unique ids
    const usersName = instance.data.checkUsersName;
    const usersId = instance.data.checkUsersId;


    // Get input's value
    let customizedOutput = properties.richValue;


    // Get properties

    let directingPageName = "";
    if (properties.directingPageName !== null) {
        directingPageName = properties.directingPageName;
    }
    const sendAs = properties.sendAs;
    const parameterKey = properties.parameterKey;

    // Defination of prefix and suffix of mention text
    let preMention = "";
    let postMention = "";

    let websiteHomeUrl = document.location.origin;

    if (document.location.pathname.includes('/version-test')) {
        websiteHomeUrl += '/version-test';
    }

    let directPath = "/{id}";

    if (sendAs == 'parameter') {
        directPath = "?" + parameterKey + "={id}";
    }

    const target = properties.openInNewTab ? "_blank" : "_self";
    preMention = `[url=${websiteHomeUrl}/${directingPageName}${directPath} target=${target}]` + preMention;
    postMention = postMention + "[/url]";




    let valueToBeReplaced = "";
    
    for (var i = 0; i <= usersName.length; i++) {
        if (customizedOutput.includes('@' + usersName[i])) {
            
            let preMentionModified = preMention;
            preMentionModified = preMentionModified.replace('{id}', usersId[i]);

            valueToBeReplaced = preMentionModified + '@' + usersName[i] + postMention;
            customizedOutput = customizedOutput.replace('@' + usersName[i], valueToBeReplaced);
            
        }

    }

    instance.publishState('customizedOutput', customizedOutput);
    instance.triggerEvent('customizedOutputReady');



}