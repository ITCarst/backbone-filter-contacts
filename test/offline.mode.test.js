define([
    "offline",
    "contactsCollection"
], function (Offline, ContactsCollection) {

    describe("Offline Module", function () {
        var offline;

        beforeEach(function () {
            this.offline = new Offline();
            offline = this.offline;
        });

        it("should have methods defined", function () {
            expect(offline.setData).toBeDefined();
            expect(offline.loadData).toBeDefined();
            expect(offline.loadItem).toBeDefined();
            expect(offline.saveItem).toBeDefined();
            expect(offline.deleteItem).toBeDefined();
            expect(offline.editItem).toBeDefined();
            expect(offline.getByType).toBeDefined();

        });
        it("should call the methods", function () {
            spyOn(offline, "setData");
            spyOn(offline, "loadData");
            spyOn(offline, "loadItem");
            spyOn(offline, "saveItem");
            spyOn(offline, "deleteItem");
            spyOn(offline, "editItem");
            spyOn(offline, "getByType");

            offline.setData();
            offline.loadData();
            offline.loadItem();
            offline.saveItem();
            offline.saveItem();
            offline.editItem();
            offline.deleteItem();
            offline.getByType();

            expect(offline.setData).toHaveBeenCalled();
            expect(offline.loadData).toHaveBeenCalled();
            expect(offline.loadItem).toHaveBeenCalled();
            expect(offline.saveItem).toHaveBeenCalled();
            expect(offline.deleteItem).toHaveBeenCalled();
            expect(offline.editItem).toHaveBeenCalled();
            expect(offline.getByType).toHaveBeenCalled();
        });
        
        describe("methods", function () {
            var data, ls = localStorage;

            beforeEach(function () {
                mockData = '[{"id":"3","name":"Contact 2","address":"1, a street, a town, a city, AB12 3CD","tel":"123456789","type":"family","email":"anemail@me.com"}, {"id":"4","name":"Contact 4","address":"1, a street, a town, a city, AB12 3CD","tel":"123456789","type":"colleagues","email":"anemail@me.com"}, {"id":"5","name":"Contact 5","address":"1, a street, a town, a city, AB12 3CD","tel":"123456789","type":"friends","email":"anemail@me.com"}, {"id":"6","name":"asd","address":"asd","tel":"sad","type":"bla","email":"asd"}]';
            });
            
            afterEach(function () {
                //ls.removeItem("contacts");
            });

            describe("#setData", function () {
                it("should set item with data", function () {
                    spyOn(offline, "setData");
                    offline.setData(mockData);
                    expect(offline.setData).toHaveBeenCalledWith(mockData);
                });
                it("should return error if no data is sent", function () {
                    expect(offline.setData()).toEqual("Please add data");
                });
            });

            describe("#loadData", function () {
                describe("should return", function () {
                    it("message if no data is set", function () {
                        ls.removeItem("contacts");
                        expect(offline.loadData()).toEqual(false);
                    });
                    it("object if data is set", function () {
                        ls.setItem("contacts", mockData);
                        expect(offline.loadData()).toEqual(jasmine.any(Object));
                    });
                });
            });

            describe("#saveItem", function () {
                var item;
                beforeEach(function () {
                    item = JSON.parse(mockData)[0];
                });
                it("should return string if no data is sent", function () {
                    expect(offline.saveItem()).toBe("Please fill the form.");
                });
                it("should return message if item already exists", function () {
                    expect(offline.saveItem(item)).toEqual("Item already exists.");
                });
                it("should return true if item was saved", function () {
                    var newItem = item;
                    newItem.id = "999";
                    expect(offline.saveItem(newItem)).toEqual("Entry saved."); 
                });
            });

            describe("#loadItem", function () {
                beforeEach(function () {
                    offline.setData(mockData);
                });
                afterEach(function () {
                    ls.removeItem("contacts");
                });
                it("should return item based on id", function () {
                    expect(offline.loadItem({id: "3"})).toEqual(JSON.parse(mockData)[0]);
                });
            });

            describe("#editItem", function () {
                it("should return false if no id is provided", function () {
                    expect(offline.editItem()).toEqual(false);
                });

                it("should return updated contact data", function () {
                    var editedData = '[{"id":"3","name":"edited","address":"1, a street, a town, a city, AB12 3CD","tel":"123456789","type":"family","email":"anemail@me.com"}, {"id":"4","name":"Contact 4","address":"1, a street, a town, a city, AB12 3CD","tel":"123456789","type":"colleagues","email":"anemail@me.com"}, {"id":"5","name":"Contact 5","address":"1, a street, a town, a city, AB12 3CD","tel":"123456789","type":"friends","email":"anemail@me.com"}, {"id":"6","name":"asd","address":"asd","tel":"sad","type":"bla","email":"asd"}]';
                    expect(offline.editItem(editedData)).toEqual(true);
                });
            });

            describe("#deleteItem", function () {
                beforeEach(function () {
                    offline.setData(mockData);
                });
                
                afterEach(function () {
                    ls.removeItem("contacts");
                });

                it("should return false if no id is sent", function () {
                    expect(offline.deleteItem()).toBe(false);
                });
                it("should delete item based on id", function () {
                    expect(offline.deleteItem({id: "3"})).toBe(true); 
                });
            });

            describe("#getByType", function () {
                it("should return data by type", function () {
                    offline.setData(mockData);
                    expect(offline.getByType("family")).toEqual(jasmine.any(Object));
                });
                
                it("should return false if no type is sent", function () {
                    expect(offline.getByType()).toBe(false); 
                });
            });
        });

    });
});
