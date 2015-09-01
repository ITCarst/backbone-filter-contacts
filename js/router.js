define([
    "jquery",
    "underscore",
    "backbone",
    "views/footer"
], function ($, _, Backbone, FooterView) {

    //define the Backbone Router
/*    var ContactsRouter = Backbone.Router.extend({
        routes: {
            "filter/:type" : "urlFilter",
        },  
        urlFilter: function (type) {
            ContactsView.filterType = type;
            ContactsView.trigger("change:filterType");
        }   
    }); 

*/
    //main init fn
    var init = function () {
        console.log("initialized");
        //create the router init
        //var contactsRouter = new ContactsRouter();

        var footerView = new FooterView();


        //start the backbone history service
        Backbone.history.start();
    }

    return {
        initialize: init
    }
});
