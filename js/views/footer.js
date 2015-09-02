define([
    "jquery",
    "underscore",
    "backbone",
    "collections/footer",
    "text!templates/footer.html"
], function ($, _, Backbone, FooterCollection, footerTemplate) {
   
    var footerLinks = [{name: "about"}, {name: "contact"}, {name: "similar"}];
   
    //foter template using the static script in the page
    var FooterTpl = Backbone.View.extend({
        tagName: "li",
        className: "footerLinks",
        template: footerTemplate,
        render : function () {
            var  tmpl = _.template(this.template);
            this.$el.html(this.model.toJSON().name);

            return this;
        }   
    });

    //extend the view and fill the template with the data
    var FooterView = Backbone.View.extend({
        el: $("#footer"),
        initialize: function () {
            this.collection = new FooterCollection(footerLinks);
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

    return FooterView;

});
