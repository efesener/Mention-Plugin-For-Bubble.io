function(instance, properties, context) {


    const usersName = instance.data.mentionedUsersName;
    const usersId = instance.data.mentionedUsersId;

    const inputElement = instance.data.inputElement;



    for (var i = usersName.length - 1; i >= 0; i--) {

        if (!inputElement.value.includes('@' + usersName[i])) {

            usersName.splice(i, 1);
            usersId.splice(i, 1);

        }

    }

    instance.data.mentionedUsersName = usersName;
    instance.data.mentionedUsersId = usersId;

    instance.publishState('mentionedUsersName', usersName);
    instance.publishState('mentionedUsersId', usersId);

}