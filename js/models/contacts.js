define([
    "backbone"        
], function (Backbone) {

    //create the contact model
    var ContactsModel = Backbone.Model.extend({
        defaults: {
            photo: "./img/placeholder.png",
            name: "",
            tel: "",
            email: "",
            type: ""
        },
        getCustomUrl: function (method) {
            //get the model id
            var cId = this.get("id"),
                method = method.toLowerCase();

            //build custom url's for CRUD
            switch(method) {
                case "create":
                    return "./application/contacts.php/create";
                    break;
                case "read":
                    return "./application/contacts.php/user/" + cId;
                    break;
                case "update":
                    return "./application/contacts.php/update/" + cId;
                    break;
                case "delete":
                    return "./application/contacts.php/delete/" + cId;
                    break;
            }              
        },
        sync: function (method, model, options) {
            options || (options = {});
            options.url = this.getCustomUrl(method);

            return Backbone.sync.apply(this, arguments);
        }
    });

    return ContactsModel;

});
