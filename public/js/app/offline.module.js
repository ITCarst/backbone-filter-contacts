define([
    "jquery",
    "underscore",
    "backbone"
], function ($, _, Backbone) {

    "use strict";

    var Offline =  function () {};

    Offline.prototype = {
        //get data from db and save it to localStorage
        setData: function (data) {
            if (!data && data !== "undefined") {
                return "Please add data";
            } else {
                return localStorage.setItem("contacts", JSON.stringify(data)) || "Could not save";
            }
        },
        //load data from localStorage
        loadData: function () {
            var a = localStorage.getItem("contacts");
            if (!a)
                return "No data Found";
            else 
                return JSON.parse(a);
        },

        //save single contact
        saveItem: function (data, callback) {
            //make sure that some data is sent
            if (!data) return "Please fill the form";
        },
        //delete single contact
        deleteItem: function () {
        },
        //edit single contact
        editItem: function () {
        }
        

    };

    var o = new Offline();
    o.loadData();
    
    return Offline;

});
