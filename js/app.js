(function ($) {
    var footerLinks = ["about", "contact", "similar"];

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
         }
    });

    var Footer = Backbone.Model.extend();
    var FooterDir = Backbone.Collection.extend({
        model: Footer
    });
    
    var FooterView = Backbone.View.extend({
        el: $("#footer"),

        initialize: function () {
            this.collection = new FooterDir(footerLinks);

            this.render();
        },
        render : function () {
            var that = this;
            _.each(this.collection.models, function (link) {
                that.renderFooterLinks(link);
            });
        },
        renderFooterLinks: function (link) {
            console.log(link);              
        }
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

        render: function () {
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        },
        events: {
            "click button.delete" : "deleteContact"
        },
        deleteContact: function () {
            var removedType = this.model.get("type").toLowerCase();
            this.model.destroy();
            this.remove();
            if(_.indexOf(directory.getTypes(), removedType) === -1) 
                directory.$el.find("#filter div").children("a[data='" + removedType + "']").remove();
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


    var footer = new FooterView();

    //create the router init
    var contactsRouter = new ContactsRouter();

    //start the backbone history service
    Backbone.history.start();



})(jQuery);








