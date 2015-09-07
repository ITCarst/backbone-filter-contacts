define([
    "backbone",
    "models/footer"
], function (Backbone, FooterModel) {
    "use strict";

    var FooterCollection = Backbone.Collection.extend({
        model: FooterModel
    }); 
    return FooterCollection;
});
