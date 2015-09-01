(function ($) {
    //footer links array
    var footerLinks = [{name: "about"}, {name: "contact"}, {name: "similar"}];
    
    //static contacts data
 /*   var contacts = [
        { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Family" },
        { id: 2, name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Family" },
        { id: 3, name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Friends" },
        { id: 4, name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Colleagues" },
        { id: 5, name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Family" },
        { id: 6, name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Colleagues" },
        { id: 7, name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Friends" },
        { id: 8, name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Friends" },
        { id: 9, name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Family" }
    ];
*/
    //define the contact model
    var Contact = Backbone.Model.extend({
         defaults: {
            //ID: "",
            photo : "./img/placeholder.png", //default image for contacts
            name : "",
            tel : "",
            email: "",
            type: ""
        },
        //idAttribute: 'ID',
        getCustomUrl: function (method) {
            var id = this.get("id");
            switch (method) {
                case "read":
                    return './contacts.php/user/' + id;
                    break;
                case "create":
                    return "./contacts.php/create";
                    break;
                case "update":
                    return "./contacts.php/update/" + id;
                    break;
                case "delete":
                    return "./contacts.php/delete/" + id;
                    break;
            }
        },
        sync: function (method, model, options) {
            options || (options = {});
            options.url = this.getCustomUrl(method.toLowerCase());

            return Backbone.sync.apply(this, arguments);
        }
    });

    //define collection dir
    var ContactsList = Backbone.Collection.extend({
        model: Contact,
        urlRoot : "./contacts.php",
        url: function () {
            var base = this.urlRoot || (this.collection && this.collection.url) || "/";
            return base;
        },
        initialize: function () {
        }
    });

    //contacts view tempalte with the data from the array
    var ContactItem = Backbone.View.extend({
        tagName : "article",
        className: "contact-container",
        template: $("#contactTemplate").html(),
        editTemplate : _.template($("#contactEditTemplate").html()),
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
        
            //do DELETE request to delete the model from DB
            //send specifyc param in the url so it will be easier to get the DELETE request from backend
            this.model.destroy({
                url: "contacts.php/delete/" + id,
                ID : id
            });

            //remove view from page
            this.remove();

            if(_.indexOf(contactsView.getTypes(), removedType) === -1) {
                contactsView.$el.find("#filter div").children("a[data='" + removedType + "']").remove();
            }
        },
        //Edit button event
        editContact: function () {
            //render the edit template
            this.$el.html(this.editTemplate(this.model.toJSON()));
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
            this.collection = new ContactsList();
            // this.listenTo(this.collection, "reset", this.render, this);
            //create the GET call grabing all data from DB
            this.collection.fetch({
                traditional: true,
                reset: true,
                data: {contacts: "all"},
                success: function () {
                    //render the view after the ajax call is done
                    that.render();
                    //render the select form with it's options
                   that.renderSelect();

                   //add change event on select that will fiter the contacts
                   that.on("change:filterType", that.filterByType, false);
                   
                   that.collection.on("reset", that.render, that);
                }
            });

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
            var types = _.uniq(types);
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
                var option = $("<a href='#filter/" + item +"' data='" + item + "'>" 
                    + item + "</a>").appendTo(select);
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
            //fetch new data based on filter type
            this.collection.fetch({
                traditional: true,
                parse: true,
                reset: true,
                data: (this.filterType === "all") ?{contacts: "all"} :  {type: this.filterType}
            }); 
            //set the route based on type
            contactsRouter.navigate("filter/" + this.filterType);
        },
        addContact: function (e) {
            e.preventDefault();
            var formData = {}, that = this;;
            
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
                var new_contact = new Contact(formData);
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
                            //remove the list of category contact
                            $(selectGroup).find("a").remove();
                            //append the new list including the new type
                            $(selectGroup).append(filter);
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

    //init the master view
    var contactsView = new ContactsView();
    
    //create the footer model
    var Footer = Backbone.Model.extend();
    //init the footer template using the static script in the page
    var FooterTpl = Backbone.View.extend({
        tagName: "li",
        className: "footerLinks",
        template: $("#footerTemplate").html(),
        render : function () {
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        }   
    }); 
    //create the footer collection from the model
    var FooterDir = Backbone.Collection.extend({
        model: Footer
    }); 
    //extend the view and fill the template with the data
    var FooterView = Backbone.View.extend({
        el: $("#footer"),
        initialize: function () {
            this.collection = new FooterDir(footerLinks);
            this.render();
        },  
        render : function () {
            var that = this;
            _.each(this.collection.models, function (item) {
                that.renderFooterLinks(item);
            }); 
        },
        renderFooterLinks: function (item) {
            var footerTpl = new FooterTpl({
                model : item
            });
            this.$el.find("ul").append(footerTpl.render().el);
        }
    });
    //ini the footer view
    var footer = new FooterView();
    
    var ContactsRouter = Backbone.Router.extend({
        routes: {
            "filter/:type" : "urlFilter",
        },  
        urlFilter: function (type) {
            contactsView.filterType = type;
            contactsView.trigger("change:filterType");
        }   
    }); 
    //create the router init
    var contactsRouter = new ContactsRouter();

    //start the backbone history service
    Backbone.history.start();


})(jQuery);








