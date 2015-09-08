define(["/base/public/js/app/models/contacts.js"], function (ContactsModel) {

    describe("ContactsModel", function () {

        beforeEach(function () {
            this.contacts = new ContactsModel();
        });

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
});
