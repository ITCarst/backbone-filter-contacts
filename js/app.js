(function ($) {

    var contacts = [
        { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
    ];

    //define the contact model
    var Contact = Backbone.Model.extend({
        defaults: {
            photo : "./img/placeholder.png" //default image for contacts
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
                select = $("<select/>", {
                    html: "<option value='all'>All</option>"
                });
            
            _.each(this.getTypes(), function (item) {
                var option = $("<option/>", {
                    value: item.toLowerCase(),
                    text: item.toLowerCase()
                }).appendTo(select);
            });
            return select;
        },
        renderSelect: function () {
            var flexContainer = this.$el.find("#filter");
            $(flexContainer).append(this.createSelect());
        },
        events: {
            "change #filter select" : "setFilter"
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

                var filterType = this.filterType;
                var filtered = _.filter(this.collection.models, function (item) {
                    return item.get("type").toLowerCase() === filterType;
                });
                this.collection.reset(filtered);
                contactsRouter.navigate("filter/" + filterType);
            }
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

    //create the router init
    var contactsRouter = new ContactsRouter();

    //start the backbone history service
    Backbone.history.start();



})(jQuery);








