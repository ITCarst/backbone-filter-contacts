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
                return false;
            else 
                if (JSON.parse(ls).length >= 1)
                    return JSON.parse(ls);
                else 
                    return false;
        },
        //save single contact
        saveItem: function (data, callback) {
            var items = this.loadData();
            //make sure that some data is sent
            if (!data) return "Please fill the form.";

            if (!data.id) {
                var lastItem = items.slice(-1)[0],
                    newId = parseInt(lastItem.id) + 1;
                data.id = newId.toString();
            }
            //check if the item already exists in LS
            if (this.loadItem({id: data.id})) return "Item already exists.";
            //push the new item to the ls array
            items.push(data);
            //set the data with the new item added
            if (this.setData(JSON.stringify(items)))
                return "Entry saved.";

        },
        //delete single contact
        deleteItem: function (id) {
            if (!id) return false;

            var toDelItem = this.loadItem(id),
                data = this.loadData(), newData = [];

            data.forEach(function (item) {
                if (item.id !== toDelItem.id)
                    newData.push(item);
            });

            if (this.setData(JSON.stringify(newData)))
                return true;
        },
        //edit single contact
        editItem: function () {
            if (arguments.length === 0) return false;
            return true;
        },
        loadItem: function (id) {
            var data = this.loadData();
            //filter the matched id
            return data.filter(function (item) {
                if (item.id === id.id)
                    return item;
            })[0];
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
