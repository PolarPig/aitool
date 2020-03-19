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
var MainBak = (function (_super) {
    __extends(MainBak, _super);
    function MainBak() {
        var _this = _super.call(this) || this;
        _this.achievementScoller = new eui.Scroller();
        _this.Allshap = new Array();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    MainBak.prototype.onAddToStage = function (event) {
        //  // 第一排，第1~4个
        //  this.draw(0,0);
        //  this.draw(0,1);
        //  this.draw(0,2);
        //  this.draw(0,3);
        //  // 第二排，第1~4个
        //  this.draw(1,0);
        //  this.draw(1,1);
        //  this.draw(1,2);
        //  this.draw(1,3);
        //  // 第三排，第1~4个
        //  this.draw(2,0);
        //  this.draw(2,1);
        //  this.draw(2,2);
        //  this.draw(2,3);
        //  // 第四排，第1~4个
        //  this.draw(3,0);
        //  this.draw(3,1);
        //  this.draw(3,2);
        //  this.draw(3,3);
        //  this.draw(4,0);
        //  this.draw(4,1);
        //  this.draw(4,2);
        //  this.draw(4,3);
        //  this.draw(5,0);
        //  this.draw(5,1);
        //  this.draw(5,2);
        //  this.draw(5,3);
        //  this.draw(6,0);
        //  this.draw(6,1);
        //  this.draw(6,2);
        //  this.draw(6,3);
        //  this.draw(7,0);
        //  this.draw(7,1);
        //  this.draw(7,2);
        //  this.draw(7,3);
        //  this.draw(8,0);
        //  this.draw(8,1);
        //  this.draw(8,2);
        //  this.draw(8,3);
        //  this.draw(9,0);
        //  this.draw(9,1);
        //  this.draw(9,2);
        //  this.draw(9,3);
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 4; j++) {
                this.draw(i, j);
            }
        }
        setInterval(this.mergeShape, 100, this);
    };
    MainBak.prototype.mergeShape = function (that) {
        for (var i = 0; i < that.Allshap.length; i++) {
            console.log(i);
            var shape = that.Allshap[i];
            that.addChild(shape);
            //that.removeChild(shape);
        }
    };
    //this.drawidx = setInterval(this.drawCanvas,100,this);
    MainBak.prototype.draw = function (g_off_h, g_off_w) {
        // 画 ecg 单导
        this.initDraw(new EcgData().getEcgData(1), 1, 4, g_off_h, g_off_w);
        // 画 ecg 单导 V1
        this.initDraw(new EcgData().getEcgData(1), 2, 10, g_off_h, g_off_w);
        // 画 ecg 单导 V2
        this.initDraw(new EcgData().getEcgData(1), 3, 20, g_off_h, g_off_w);
        // 画 ecg 单导 V3
        this.initDraw(new EcgData().getEcgData(1), 4, 2, g_off_h, g_off_w);
    };
    MainBak.prototype.initDraw = function (datas, g_idx, speed, g_off_h, g_off_w) {
        var ecg = new egret.Shape();
        if (g_idx == 1) {
            this.addChild(ecg);
        }
        else {
            var len = this.Allshap.length;
            this.Allshap[len] = ecg;
        }
        new DrawEcg(ecg, datas, g_idx, speed, g_off_h, g_off_w).ecgDraw();
    };
    return MainBak;
}(egret.DisplayObjectContainer));
__reflect(MainBak.prototype, "MainBak");
//# sourceMappingURL=MainBak.js.map