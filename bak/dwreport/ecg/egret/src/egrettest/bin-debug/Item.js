var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// TypeScript file
var Item = (function () {
    function Item(ecg, bmpSnap, rectClip) {
        this.ecg = ecg;
        this.bmpSnap = bmpSnap;
        this.rectClip = rectClip;
    }
    Item.prototype.getEcg = function () {
        return this.ecg;
    };
    Item.prototype.getBmpSnap = function () {
        return this.bmpSnap;
    };
    Item.prototype.getRectClip = function () {
        return this.rectClip;
    };
    return Item;
}());
__reflect(Item.prototype, "Item");
//# sourceMappingURL=Item.js.map