define(["footerModel"], function (FooterModel) {

    describe("FooterModel", function () {

        beforeEach(function () {
            this.footerLink = new FooterModel({
                name: "link1"
            });
        });

        describe('when instantiated', function () {
            it('should exhibit attributes', function () {
                expect(this.footerLink.get("name")).toEqual("link1");
            });
            it("should have id undefiend", function () {
                expect(this.footerLink.get("id")).toBeUndefined();
                
            });
        });
    });
});

