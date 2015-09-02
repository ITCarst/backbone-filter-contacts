define([
    "jquery",
    "underscore",
    "backbone",
    "router",
    "views/footer",
    "views/contacts"
], function ($, _, Backbone, ContactsRouter, FooterView, ContactsView) {
    
    //main init fn
    var init = function () {
        //create the router init
        //var contactsView = new ContactsView();
        var footerView = new FooterView();
        var contactsRouter = new ContactsRouter();

        //start the backbone history service
        Backbone.history.start();
    }

    return {
        initialize: init
    }
});
