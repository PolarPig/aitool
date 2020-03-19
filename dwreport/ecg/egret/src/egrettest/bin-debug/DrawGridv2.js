// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DrawGridv2 = (function () {
    function DrawGridv2(shape) {
        this._shapgrid = shape;
    }
    //画低格
    DrawGridv2.prototype.ecgDrawGrid = function () {
        var shapgrid = this._shapgrid;
        shapgrid.graphics.lineStyle(1, 0x303641);
        var width = 1536;
        var height = 2250;
        shapgrid.graphics.moveTo(0, 0);
        shapgrid.graphics.lineTo(0, height);
        shapgrid.graphics.moveTo(0, height);
        shapgrid.graphics.lineTo(width, height);
        shapgrid.graphics.moveTo(width, height);
        shapgrid.graphics.lineTo(width, 0);
        shapgrid.graphics.moveTo(width, 0);
        shapgrid.graphics.lineTo(0, 0);
        var idx = 0;
        for (var i = 19; i < (width); i = i + 19) {
            shapgrid.graphics.moveTo(i, 0);
            shapgrid.graphics.lineTo(i, height);
        }
        for (var i = 19; i < (height); i = i + 19) {
            shapgrid.graphics.moveTo(0, i);
            shapgrid.graphics.lineTo(width, i);
        }
        shapgrid.graphics.lineStyle(3, 0xFFFFFF);
        for (var i = 1; i < 5; i++) {
            shapgrid.graphics.moveTo(i * 387, 0);
            shapgrid.graphics.lineTo(i * 387, height);
        }
        for (var i = 1; i < 10; i++) {
            shapgrid.graphics.moveTo(0, i * 220);
            shapgrid.graphics.lineTo(width, i * 220);
        }
    };
    return DrawGridv2;
}());
__reflect(DrawGridv2.prototype, "DrawGridv2");
//# sourceMappingURL=DrawGridv2.js.map