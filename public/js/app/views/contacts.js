define([
    "jquery",
    "underscore",
    "backbone",
    "contactsModel",
    "contactsCollection",
    "text!templates/contacts.html",
    "text!templates/editContacts.html",
    "offline"
], function ($, _, Backbone,
    ContactsModel,  ContactsCollection, 
    contactsTemplate, contactEditTemplate, Offline) 
{
    "use strict";

    var offline = new Offline();

    //contacts view tempalte with the data from the array
    var ContactItem = Backbone.View.extend({
        tagName : "article",
        className: "contact-container",
        template: contactsTemplate,
        editTemplate : contactEditTemplate,
        render: function () {
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        },
        events: {
            "click button.delete" : "deleteContact",
            "click button.edit" : "editContact",
            "change select.type" : "addType",
            "click button.save" : "saveEdits",
            "click button.cancel" : "cancelEdit"
        },
        deleteContact: function () {
            var removedType = this.model.get("type").toLowerCase(),
                id = this.model.get("id");

            if (!offline.loadData() || offline.loadData().length <= 0) {
                //send specifyc param in the url so it will be easier to get the DELETE request fro
                this.model.destroy({
                    url: "contacts.php/delete/" + id,
                    ID : id
                });
            } else {
                offline.deleteItem({id: id});
            }
            //remove view from page
            this.remove();
            //if(_.indexOf(contactsView.getTypes(), removedType) === -1) {
              //  contactsView.$el.find("#filter div").children("a[data='" + removedType + "']");
            //}
        },
       //Edit button event
        editContact: function () {
            var editTmpl = _.template(this.editTemplate);
            //render the edit template
            this.$el.html(editTmpl(this.model.toJSON()));
            //build the 
            var newOpt = $("<option", {
                html : "<em>Add new..</em>",
                value: "addType"
            });

            //create the contact type dropdown
            this.select = contactsView.createSelectDropDown().addClass("type")
                .val(this.$el.find("#type").val()).append(newOpt)
                .insertAfter(this.$el.find(".name"));
            //remove the hidden input
            //this.$el.find("input[type='hidden']").remove();
        },
        addType: function () {
            if (this.select.val() === "addType") 
                this.select.remove();
            
            $("<input/>", {
                "class" : "type"
            }).insertAfter(this.$el.find(".name").focus());
        },
        //UPDATE
        saveEdits: function (e) {
            e.preventDefault();
            var formData = {},
                prev = this.model.previousAttributes(),
                currentModel = this.model,
                modelId = currentModel.get("id"),
                that = this;

            $(e.target).closest("form").find(":input").add(".photo").each(function (){
                var el = $(this);
                formData[el.attr("class")] = el.val();
            });

            //remove empty values || undefined
            for (var x in formData) {
                if (formData[x] === "" || x === "undefined") delete formData[x];
            }
            
            //insert the new data in the current model 
            this.model.set(formData);
            this.model.save(formData);
            //render the updated view
            this.render();

            if(prev.photo === "/img/placeholder.png")
                delete prev.photo;

            _.each(contacts, function (contact) {
                if (_.isEqual(contact, prev))
                    contacts.splice(_.indexOf(contacts, contact), 1, formData);
            });
        },
        cancelEdit: function () {
            this.render();                 
        }
    });

    //master view
    var ContactsView = Backbone.View.extend({
        el: $("#content"),
        initialize: function () {
            var that = this;
            //initialize the collection with all the entries in the db
            that.collection = new ContactsCollection();
            //if there is no data in localStorage then grab it from the server
            if (offline.loadData().length <= 0 || !offline.loadData()) {
                //create the GET call grabing all data from DB
                that.collection.fetch({
                    traditional: true,
                    reset: true,
                    data: {contacts: "all"},
                    success: function (collection, data) {
                        //save data in the localStorage
                        offline.setData(JSON.stringify(data));
                        //render the view after the ajax call is done
                        that.render();
                        //render the select form with it's options
                        that.renderSelect();
                        //add change event on select that will fiter the contacts
                        that.on("change:filterType", that.filterByType, false);
                        that.collection.on("reset", that.render, that);
                    }
                });
            } else {
                //there is data in the localStorage so build the collection with it
                var items = offline.loadData();
                //push the localStorage data into the collection
                that.collection.push(items);
                //render the template
                that.render();
                //render the Filter by section
                that.renderSelect();
                //add change event on select that will fiter the contacts
                that.on("change:filterType", that.filterByType, false);
                that.collection.on("reset", that.render, that);
            }
            //render the collection with the new contact
            this.collection.on("add", this.renderContact, this);
        },
        render: function () {
            var that = this;
            this.$el.find("article.contact-container").remove();
            _.each(this.collection.models, function (item) {
                that.renderContact(item);
            }, this);
        },
        renderContact: function (item) {
            var contactView = new ContactItem({
                model: item
            });
            var contacts = this.$el.find("#contacts");
            $(contacts).append(contactView.render().el);
        },
        getTypes: function () {
            var types = this.collection.map(function (model) {
                return model.attributes.type;
            });
            types = _.uniq(types);
            //convert the types into lowercase
            return _.each(types, function (type) {
                return type.toLowerCase();
            });
        },
        createFilter: function () {
            var filter = this.$el.find("#filter"),
                select = $("<div/>", {
                    html: "<a href='#filter/all' data='all'>All</a>"
                });
           //create the short contact by type links 
            _.each(this.getTypes(), function (item) {
                var option = $("<a href='#filter/" + item +"' data='" + item + "'>" + item + "</a>").appendTo(select);
            });
            
            return select;
        },
        createSelectDropDown: function () {
            var select = $("<select/>");

            _.each(this.getTypes(), function (item) {
                var option = $("<option/>", {
                    value: item,
                    text:item
                }).appendTo(select);
            });
            return select;
        },
        renderSelect: function () {
            var flexContainer = this.$el.find("#filter");
            $(flexContainer).append(this.createFilter());
        },
        events: {
            "click #filter a" : "setFilter",
            "click #add" : "addContact",
            "click #showForm": "showForm"
        },
        setFilter: function(e) {
            this.filterType = e.currentTarget.getAttribute("data");
            this.trigger("change:filterType");
        },
        filterByType: function () {
            //reset the collection
            this.collection.reset(this.collection.models, {silent: true});

            if (!offline.loadData()) { 
                //fetch new data based on filter type
                this.collection.fetch({
                    traditional: true,
                    parse: true,
                    reset: true,
                    data: (this.filterType === "all") ?{contacts: "all"} :  {type: this.filterType}
                }); 
            } else {
                var router = new Backbone.Router(), items;
                //change url when user clicks on filter links
                router.navigate("filter/" + this.filterType);

                if (this.filterType === "all")
                    items = offline.loadData();
                else 
                    //get the new items by type
                    items = offline.getByType(this.filterType);

                this.collection.reset(); 
                //push the data in the collection
                this.collection.push(items); 
            }
            //set the route based on type
        },
        addContact: function (e) {
            e.preventDefault();
            var formData = {}, that = this;
            
            //loop through the form array and get the value of the inputs
            $("#addContact").children("input").each(function (i, el) {
                if ($(el).val() !== "")
                    formData[el.id] = $(el).val();
            });
            //make sure the object is not empty
            //add validation if needed
            if (!_.isEmpty(formData)) {
                //use lowercase for the conact type
                formData.type = formData.type.toLowerCase();
                //create new model fomr the filled from
                var new_contact = new ContactsModel(formData);
                //save the new contact in db
                new_contact.save(null, {
                    rest: true,
                    success: function (model, resp, options) {
                        //check if the user added a new type that we don't already have
                        if (_.indexOf(that.getTypes(), formData.type) === -1) 
                        {
                            var selectGroup = that.$el.find("#filter div");
                            //add the new contact to the collection 
                            that.collection.add(new_contact);
                            //remove the types
                            $(selectGroup).find("a").remove();
                            //append the new list including the new type
                            $(selectGroup).append(that.renderSelect());

                        } else {
                            //add the new contact to the collection 
                            that.collection.add(new_contact);
                        }
                    },
                    error : function (model, xhr, options) {
                        console.log(model, xhr, options);        
                    }
                });
            }
        },
        showForm : function () {
            this.$el.find(".add-contact > div").slideToggle();           
        }
    });
   
    var contactsView = new ContactsView();

    return ContactsView;

});
