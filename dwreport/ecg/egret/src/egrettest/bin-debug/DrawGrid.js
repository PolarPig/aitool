// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DrawGrid = (function () {
    function DrawGrid(shape, g_off_w, g_off_h) {
        // 第几列 默认第 0 列表
        this.g_off_w = 0;
        // 第几行 默认第 0 行 
        this.g_off_h = 0;
        this._shapgrid = shape;
        this.g_off_w = g_off_w;
        this.g_off_h = g_off_h;
    }
    //画低格
    DrawGrid.prototype.ecgDrawGrid = function () {
        var shapgrid = this._shapgrid;
        shapgrid.graphics.lineStyle(1, 0x303641);
        var width = 252;
        var height = 148;
        var offw = this.g_off_w * 255; // 偏移
        var offh = this.g_off_h * 150;
        shapgrid.graphics.moveTo(offw, offh);
        shapgrid.graphics.lineTo(offw, height + offh);
        shapgrid.graphics.moveTo(offw, height + offh);
        shapgrid.graphics.lineTo(width + offw, height + offh);
        shapgrid.graphics.moveTo(width + offw, height + offh);
        shapgrid.graphics.lineTo(width + offw, offh);
        shapgrid.graphics.moveTo(width + offw, offh);
        shapgrid.graphics.lineTo(offw, offh);
        for (var i = 19; i < (width); i = i + 19) {
            shapgrid.graphics.moveTo(i + offw, offh);
            shapgrid.graphics.lineTo(i + offw, height + offh);
        }
        for (var i = 19; i < (height); i = i + 19) {
            shapgrid.graphics.moveTo(offw, i + offh);
            shapgrid.graphics.lineTo(width + offw, i + offh);
        }
    };
    return DrawGrid;
}());
__reflect(DrawGrid.prototype, "DrawGrid");
//# sourceMappingURL=DrawGrid.js.map