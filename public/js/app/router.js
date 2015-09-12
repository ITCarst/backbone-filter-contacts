define([
    "backbone",
    "contactsView"
], function (Backbone, ContactsView) {
    //define the Backbone Router
    var ContactsRouter = Backbone.Router.extend({
        routes: {
            "filter/:type" : "urlFilter",
        },  
        urlFilter: function (type) {
            ContactsView.filterType = type;
            //ContactsView.trigger("change:filterType");
        },
        initialize: function () {
            return this;
        }
    }); 

    
    return ContactsRouter;

});
