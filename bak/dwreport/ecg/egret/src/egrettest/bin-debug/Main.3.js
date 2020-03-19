/**
 * @copyright zsp
 * @author ll
 * @desc 绘制直线api。
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Main33 = (function (_super) {
    __extends(Main33, _super);
    function Main33() {
        var _this = _super.call(this) || this;
        _this.achievementScoller = new eui.Scroller();
        _this.Allshap = new Array();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main33.prototype.onAddToStage = function (event) {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 4; j++) {
                this.draw(i, j);
            }
        }
        setInterval(this.mergeShape, 100, this);
    };
    Main33.prototype.mergeShape = function (that) {
        for (var i = 0; i < that.Allshap.length; i++) {
            var shape = that.Allshap[i];
            that.addChild(shape);
            //that.removeChild(shape);
        }
    };
    //this.drawidx = setInterval(this.drawCanvas,100,this);
    Main33.prototype.draw = function (g_off_h, g_off_w) {
        // 画 ecg 单导
        this.initDraw(new EcgData().getEcgData(1), 1, 4, g_off_h, g_off_w);
        // 画 ecg 单导 V1
        this.initDraw(new EcgData().getEcgData(1), 2, 10, g_off_h, g_off_w);
        // 画 ecg 单导 V2
        this.initDraw(new EcgData().getEcgData(1), 3, 20, g_off_h, g_off_w);
        // 画 ecg 单导 V3
        this.initDraw(new EcgData().getEcgData(1), 4, 2, g_off_h, g_off_w);
    };
    Main33.prototype.initDraw = function (datas, g_idx, speed, g_off_h, g_off_w) {
        var ecg = new egret.Shape();
        ecg.cacheAsBitmap = true;
        if (g_idx == 1) {
            this.addChild(ecg);
        }
        else {
            var len = this.Allshap.length;
            this.Allshap[len] = ecg;
        }
        new DrawEcg(ecg, datas, g_idx, speed, g_off_h, g_off_w).ecgDraw();
    };
    return Main33;
}(egret.DisplayObjectContainer));
__reflect(Main33.prototype, "Main33");
//# sourceMappingURL=Main.3.js.map