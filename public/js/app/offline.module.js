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
                return localStorage.setItem("contacts", data) || "Could not save";
            }
        },
        //load data from localStorage
        loadData: function () {
            var ls = localStorage.getItem("contacts");
            if (!ls)
                return "No data Found";
            else 
                return JSON.parse(ls);
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
        },
        getByType: function (type) {
            if (!type) return false;

            var data = this.loadData(), items = [];

            if (typeof data !== "string")
                //loop and get only the items that matches the type
                data.forEach(function (item) {
                    if (type === item.type)
                        items.push(item);
                });

            return items;
        }
    };

    var o = new Offline();
    //console.log(o.getByType("family")); 
    return Offline;

});
