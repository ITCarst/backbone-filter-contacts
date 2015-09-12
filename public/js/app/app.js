define([
    "jquery",
    "underscore",
    "backbone",
    "router",
    "footerView",
    "contactsView"
], function ($, _, Backbone, ContactsRouter, FooterView, ContactsView) {
    //main init fn
    var init = function () {
        var footerView = new FooterView(),
            contactsRouter = new ContactsRouter();
        //start the backbone history service
        Backbone.history.start();
    };

    return {
        initialize: init
    };
});
