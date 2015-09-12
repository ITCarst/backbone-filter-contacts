define([
    "footerCollection"
], function (FooterCollection) {

    describe("FooterCollection", function () {
       
        var footerColl = new FooterCollection(),
            footerLinks = [{name: "about"}, {name: "contact"}, {name: "similar"}];

        it("should be init with no data", function () {
            expect(footerColl.length).toEqual(0);
        });

        it("should have data after add", function () {
            footerColl.add(footerLinks);
            expect(footerColl.length).toBeGreaterThan(0);
        });

        it("should have no data after reset", function () {
            footerColl.reset();
            expect(footerColl.models.length).toEqual(0);
        });

    });
});
