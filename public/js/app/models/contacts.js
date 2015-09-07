define([
    "backbone"        
], function (Backbone) {
    "use strict";

    //create the contact model
    var ContactsModel = Backbone.Model.extend({
        defaults: {
            photo: "./public/img/placeholder.png",
            name: "",
            tel: "",
            email: "",
            type: ""
        },
        getCustomUrl: function (method) {
            //get the model id
            var cId = this.get("id"), uri = "";

            //build custom url's for CRUD
            switch(method.toLowerCase()) {
                case "create":
                    uri = "./application/contacts.php/create";
                    break;
                case "read":
                    uri = "./application/contacts.php/user/" + cId;
                    break;
                case "update":
                    uri =  "./application/contacts.php/update/" + cId;
                    break;
                case "delete":
                    uri = "./application/contacts.php/delete/" + cId;
                    break;
            }            

            return uri;
        },
        sync: function (method, model, options) {
            var opt = options || (options = {});
            opt.url = this.getCustomUrl(method);

            return Backbone.sync.apply(this, arguments);
        }
    });

    return ContactsModel;

});
