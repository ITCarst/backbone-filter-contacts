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
        deleteItem: function (id) {
            if (!id) return false;

            var toDelItem = this.loadItem(id)[0],
                data = this.loadData(),
                that = this;

            data.forEach(function (item) {
                if (item.id !== toDelItem.id)
                    that.setData(item);
            });
            
            return true;
        },

        //edit single contact
        editItem: function () {
            if (arguments.length === 0) return false;

            return true;
        },

        loadItem: function (id) {
            var data = this.loadData();

            return data.filter(function (item) {
                if (item.id === id.id)
                    return item;
            });
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
