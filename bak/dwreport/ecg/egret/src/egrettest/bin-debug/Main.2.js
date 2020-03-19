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
var Main3 = (function (_super) {
    __extends(Main3, _super);
    function Main3() {
        var _this = _super.call(this) || this;
        _this.ALLDg = new Array();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main3.prototype.initDraw = function (datas, g_idx, speed, g_off_h, g_off_w) {
        var dgshap = new egret.Shape();
        dgshap.cacheAsBitmap = true;
        this.addChild(dgshap);
        var dg = new Dg(dgshap, new EcgData().getEcgData(1), g_idx, speed, g_off_h, g_off_w);
        this.ALLDg.push(dg);
    };
    Main3.prototype.draw = function (g_off_h, g_off_w) {
        // 画 ecg 单导
        this.initDraw(new EcgData().getEcgData(1), 1, 4, g_off_h, g_off_w);
        // 画 ecg 单导 V1
        this.initDraw(new EcgData().getEcgData(1), 2, 10, g_off_h, g_off_w);
        // 画 ecg 单导 V2
        this.initDraw(new EcgData().getEcgData(1), 3, 20, g_off_h, g_off_w);
        // 画 ecg 单导 V3
        this.initDraw(new EcgData().getEcgData(1), 4, 2, g_off_h, g_off_w);
    };
    Main3.prototype.onAddToStage = function (event) {
        var _this = this;
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 4; j++) {
                this.draw(i, j);
            }
        }
        /// 产生动画
        this.stage.addEventListener(egret.Event.ENTER_FRAME, function (evt) {
            var tmpshap = _this.ALLDg[0]._shape;
            for (var i = 0; i < _this.ALLDg.length; i++) {
                _this.ALLDg[i].ecgDraw();
            }
        }, this);
    };
    return Main3;
}(egret.DisplayObjectContainer));
__reflect(Main3.prototype, "Main3");
//# sourceMappingURL=Main.2.js.map