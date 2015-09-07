define([
    "jquery",
    "underscore",
    "backbone"
], function ($, _, Backbone) {

    "use strict";

    var Offline =  function () {};

    Offline.prototype = {
        checkConn: function () 
        {

            console.log("check");
        },
        connDown: function () {
            conosle.log("is down");             
        },
        connUp: function () {
            console.log("is up");
                
        },
        saveItem: function () {
            console.log("save");          
        },
        loadItem: function () {
        },

        deleteItem: function () {
        },
        editItem: function () {
        }
    };
    
    return Offline;

});
