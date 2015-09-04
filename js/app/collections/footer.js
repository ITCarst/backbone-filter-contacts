define([
    "backbone",
    "models/footer"
], function (Backbone, FooterModel) {
    var FooterCollection = Backbone.Collection.extend({
        model: FooterModel
    }); 
    return FooterCollection;
});
