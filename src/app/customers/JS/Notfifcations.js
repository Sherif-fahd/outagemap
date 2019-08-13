define(["dojo/_base/declare"], function (declare) {
    return declare(null, {
        message: "",
        domNode: null,
        messageElement:null,
        constructor:function(options)
        {
            if (options.ContainerDiv)
                this.domNode = document.getElementById(options.ContainerDiv);
            else {
                this.domNode = document.createElement("div");
                this.domNode.id = "noticicationDiv";
            }
            this.messageElement = document.createElement("div");
            this.domNode.appendChild(this.messageElement);
        },
        showNotifiation: function (message) {
            if (message)
                this.messageElement.innerHTML = message;
            else
                this.messageElement.innerHTML = '';
            this.domNode.className = 'Show';
        },
        hide: function () {
            this.domNode.className = '';
        }
    });
});