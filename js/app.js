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

    //MODEL
    var Contact = Backbone.Model.extend({
        defaults: {
            photo : "./img/placeholder.png"
         }
    });

    //Collections
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

    var DirectoryView = Backbone.View.extend({
        el: $("#content"),

        initialize: function () {
            this.collection = new Directory(contacts);
            this.render();
            
            this.renderSelect();

        },
        render: function () {
            var that = this;
            _.each(this.collection.models, function (item) {
                that.renderContact(item);
            }, this);
        },
        renderContact: function (item) {
            var contactView = new ContactView({
                model: item
            });
            this.$el.find("#contacts").append(contactView.render().el);
        },
        getTypes: function () {
            return _.uniq(this.collection.pluck("type"), false, function (type) {
                return type.toLowerCase();
            })          
        },
        createSelect: function () {
            var filter = this.$el.find("#filter"),
                select = $("<select/>", {
                    html: "<option>All</option>"
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
            var flexContainer = this.$el.parent().find("#filter");
            $(flexContainer).append(this.createSelect());
        },
        events: {
            "change #filter select" : "setFilter"
        },
        setFilter: function(e) {
            this.filterType = e.currentTarget.value;
            this.trigger("change:filterType");
        }
    });

    var directory = new DirectoryView();




})(jQuery);








