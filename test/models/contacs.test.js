define(["contactModel"], function (ContactsModel) {

    describe("ContactsModel", function () {

        beforeEach(function () {
            this.contacts = new ContactsModel();
        });

        describe("when instantiated", function () {
            it("should have attributes object", function () {
                expect(this.contacts.attributes).toEqual(jasmine.any(Object));
            });
            describe("attributes object", function () {
                it("should have default keys and val", function () {
                    expect(this.contacts.attributes).toEqual(jasmine.objectContaining({
                        photo: "./public/img/placeholder.png",
                        name: "", 
                        tel: "", 
                        email: "", 
                        type: ""
                    }));
                });
            });
        });

        describe("#getCustomUrl", function () {
            
            it("should return url based on request", function () {
                var that = this, 
                    getUrl = {
                        url: function (type) {
                            return that.contacts.getCustomUrl(type);
                        }
                    };
                expect(getUrl.url("create")).toEqual("./application/contacts.php/create");
                expect(getUrl.url("read")).toEqual("./application/contacts.php/user/undefined");
                expect(getUrl.url("update")).toEqual("./application/contacts.php/update/undefined");
                expect(getUrl.url("delete")).toEqual("./application/contacts.php/delete/undefined");
            });
        
        });

    });
});
