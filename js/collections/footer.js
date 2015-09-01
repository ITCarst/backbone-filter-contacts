define([
    "jquery",
    "underscore",
    "backbone",
    "models/footer"
], function ($, _, Backbone, FooterModel) {
   
    var FooterCollection = Backbone.Collection.extend({
        model: FooterModel
    }); 
    
    return FooterCollection;

});
