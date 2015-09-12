define(["contactsModel"], function (ContactsModel) {

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

        describe("urls", function () {
            
            describe("when no id is set", function () {

                it("should do request with undefined", function () {
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
        
        describe("when saving", function () {
            
            beforeEach(function () {
                this.server = sinon.fakeServer.create();
                this.responseBody = '{"id":"3","name":"Contact 2","address":"1, a street, a town, a city, AB12 3CD","tel":"123456789","type":"family","email":"anemail@me.com"}';
                this.server.respondWith(
                    "POST",
                    "./application/contacts.php/user/",
                    [
                        200,
                        {"Content-Type": "application/json"},
                        JSON.stringify(this.responseBody)
                    ]
                );
                this.eventSpy = sinon.spy();

            });

            afterEach(function () {
                this.server.restore();
            });

            it("should not save if the name is empty", function () {
                this.contacts.bind("error", this.eventSpy);
                this.contacts.save({"name": ""});
                this.eventSpy();

                expect(this.eventSpy.calledOnce).toBeTruthy();
                expect(this.eventSpy.calledWith(
                    this.contacts.save(), "Sorry something went wrong"
                )).toBeFalsy();
            });

            it("should make a save request to the server", function () {
                this.contacts.save();   
                var req = this.server.requests[0];
                expect(req.method).toEqual("POST");
                expect(req.url).toEqual("./application/contacts.php/create");
            });
        });

        describe("when deleting", function () {
            beforeEach(function () {
                this.server = sinon.fakeServer.create();
                this.responseBody = "Entry deleted";
                this.server.respondWith(
                    "DELETE",
                    "./application/contacs.php/delete/",
                    [ 200, {"Content-Type" : "application/json"}, this.responseBody]
                );
                this.eventSpy = sinon.spy();
            });
            afterEach(function () {
                this.server.restore();
            });
            
            it("should create a DELETE request", function () {
                
            });


            it("should not delete if id is missing", function () {
                this.eventSpy();

                expect(this.contacts.id).toBeUndefined();
                expect(this.eventSpy.calledOnce).toBeTruthy();
                expect(this.eventSpy.calledWith(
                    this.contacts.id, "Please add an id"        
                )).toBeFalsy();

            });

            it("should delete when id is defined", function () {
                this.contacts.set("id", 1); 
                this.eventSpy();
                expect(this.contacts.id).toEqual(1);
                expect(this.eventSpy.calledOnce).toBeTruthy();
                expect(this.eventSpy.calledWith(
                    this.contacts.id, "Entry Deleted"    
                )).toBeFalsy();
            });

        });
    });
});
