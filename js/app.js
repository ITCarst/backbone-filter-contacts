(function ($) {
    //enable backbone ajax
    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = true;
    //footer links array
    var footerLinks = [{name: "about"}, {name: "contact"}, {name: "similar"}];
    //static contacts data
    var contacts = [
        { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Family" },
        { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Family" },
        { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Friends" },
        { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Colleagues" },
        { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Family" },
        { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Colleagues" },
        { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Friends" },
        { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Friends" },
        { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "Family" }
    ];

    //define the contact model
    var Contact = Backbone.Model.extend({
        defaults: {
            photo : "./img/placeholder.png", //default image for contacts
            name : "",
            tel : "",
            email: "",
            type: ""
         },
        urlRoot: "/contacts.php",
    });

    //define collection dir
    var Directory = Backbone.Collection.extend({
        model: Contact
    });

    //Views
    var ContactView = Backbone.View.extend({
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
            var removedType = this.model.get("type").toLowerCase();
            this.model.destroy();
            this.remove();
            if(_.indexOf(directory.getTypes(), removedType) === -1) 
                directory.$el.find("#filter div").children("a[data='" + removedType + "']").remove();
        },
        editContact: function () {
            //render the edit template
            this.$el.html(this.editTemplate(this.model.toJSON()));
            //build the 
            var newOpt = $("<option", {
                html : "<em>Add new..</em>",
                value: "addType"
            });

            this.select = directory.createSelectDropDown().addClass("type")
                .val(this.$el.find("#type").val()).append(newOpt)
                .insertAfter(this.$el.find(".name"));

            this.$el.find("input[type='hidden']").remove();

        },
        addType: function () {
            if (this.select.val() === "addType") 
                this.select.remove();
            
            $("<input/>", {
                "class" : "type"
            }).insertAfter(this.$el.find(".name").focus());
        },
        saveEdits: function (e) {
            e.preventDefault();
            var formData = {},
                prev = this.model.previousAttributes();

            $(e.target).closest("form").find(":input").add(".photo").each(function (){
                var el = $(this);
                formData[el.attr("class")] = el.val();
            });

            if (formData.photo === "")
                delete formData.photo;
            
            this.model.set(formData);
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
    var DirectoryView = Backbone.View.extend({
        el: $("#content"),
        initialize: function () {
            this.collection = new Directory(contacts);
            //render contacts from json
            this.render();
            //render the select form with it's options
            this.renderSelect();
            //add change event on select that will fiter the contacts
            this.on("change:filterType", this.filterByType, false);
            this.collection.on("reset", this.render, this);
            //render the collection with the new contact
            this.collection.on("add", this.renderContact, this);
            this.collection.on("remove", this.removeContact, this);
        },
        render: function () {
            var that = this;
           this.$el.find("article.contact-container").remove();
            _.each(this.collection.models, function (item) {
                that.renderContact(item);
            }, this);
        },
        renderContact: function (item) {
            var contactView = new ContactView({
                model: item
            });
            var contacts = this.$el.find("#contacts");
            $(contacts).append(contactView.render().el);
        },
        getTypes: function () {
            return _.uniq(this.collection.pluck("type"));
        },
        createSelect: function () {
            var filter = this.$el.find("#filter"),
                select = $("<div/>", {
                    html: "<a href='#filter/all' data='all'>All</a><br/><br/>"
                });
            _.each(this.getTypes(), function (item) {
                var option = $("<a href='#filter/" + item.toLowerCase() +"' data='" + item.toLowerCase() + "'>" 
                    + item + "</a><br/><br/>").appendTo(select);
            });
            return select;
        },
        createSelectDropDown: function () {
            var select = $("<select/>", {
                html : "<option value='all'>All</option>"
            });
            _.each(this.getTypes(), function (item) {
                var option = $("<option/>", {
                    value: item.toLowerCase(),
                    text:item.toLowerCase()
                }).appendTo(select);
            });
            return select;
        },
        renderSelect: function () {
            var flexContainer = this.$el.find("#filter");
            $(flexContainer).append(this.createSelect());
        },
        events: {
            "change #filter select" : "setFilter",
            "click #add" : "addContact",
            "click #showForm": "showForm"
        },
        setFilter: function(e) {
            this.filterType = e.currentTarget.value;
            this.trigger("change:filterType");

        },
        filterByType: function () {
            if (this.filterType === "all") {
                this.collection.reset(contacts);
                contactsRouter.navigate("filter/all");
            } else {
                this.collection.reset(contacts, {silent: true});
                var filterType = this.filterType,
                    filtered = _.filter(this.collection.models, function (item) {
                        return item.get("type").toLowerCase() === filterType;
                    });
                this.collection.reset(filtered);
                contactsRouter.navigate("filter/" + filterType);
            }
        },
        addContact: function (e) {
            e.preventDefault();
            var newModel = {};
            $("#addContact").children("input").each(function (i, el){
                if ($(el).val() !== "")
                    newModel[el.id] = $(el).val();
            });
            if (!_.isEmpty(newModel)) {
                contacts.push(newModel);
                if (_.indexOf(this.getTypes(), newModel.type) === -1) {
                    this.collection.add(new Contact(newModel));
                    this.$el.find("#filter").find("select").remove().end().append(this.createSelect());
                }  else {
                    this.collection.add(new Contact(newModel));
                }
            } else {
                alert("fill in the form pls");
            }
        },
        removeContact: function (removeModel) {
            var removed = removeModel.attributes;
            if(removed.photo === "/img/placeholder.png")
                delete removed.photo;

            _.each(contacts, function (contact) {
                if (_.isEqual(contact, removed))
                    contacts.splice(_.indexOf(contacts, contact), 1);
            });
        },
        showForm : function () {
            this.$el.find(".add-contact > div").slideToggle();           
        }
    });

    //init the master view
    var directory = new DirectoryView();
    var ContactsRouter = Backbone.Router.extend({
        routes: {
            "filter/:type" : "urlFilter",
        },
        urlFilter: function (type) {
            directory.filterType = type;
            directory.trigger("change:filterType");
        }
    });

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

    //create the router init
    var contactsRouter = new ContactsRouter();

    //start the backbone history service
    Backbone.history.start();


})(jQuery);








