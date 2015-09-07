require.config({
    baseUrl: "./public/js/app",
    paths: {
        jquery: "../../../node_modules/jquery/dist/jquery.min",
        underscore: "../../../node_modules/underscore/underscore-min",
        backbone: "../../../node_modules/backbone/backbone-min",
        templates: "templates",
        text: "../libs/text"
    }
});

require([
    "app"
], function (App) {
    App.initialize();
});



