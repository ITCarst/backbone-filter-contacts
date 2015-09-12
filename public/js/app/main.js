require.config({
    baseUrl: "./public/js/app",
    paths: {
        jquery: "../../../node_modules/jquery/dist/jquery.min",
        underscore: "../../../node_modules/underscore/underscore-min",
        backbone: "../../../node_modules/backbone/backbone-min",
        templates: "templates",
        text: "../libs/text",
        //add the models/collections/views to the path so they don't conflict 
            //with the tests paths
        footerModel : "models/footer",
        footerCollection: "collections/footer",
        footerView: "views/footer",
        contactsModel: "models/contacts",
        contactsCollection: "collections/contacts",
        contactsView: "views/contacts",
        router: "router",
        offline: "offline.module"
    }
});

require([
    "app"
], function (App) {
    App.initialize();
});



