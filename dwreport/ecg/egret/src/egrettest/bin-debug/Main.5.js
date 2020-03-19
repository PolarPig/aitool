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
var Main5 = (function (_super) {
    __extends(Main5, _super);
    function Main5() {
        var _this = _super.call(this) || this;
        _this._shape = new egret.Shape();
        _this.dataecg = [];
        _this.dataecgv1 = [];
        _this.dataecgv2 = [];
        _this.dataecgv3 = [];
        _this.databoold = [];
        _this.databooldv1 = [];
        _this.databreathe = [];
        _this.databreathev1 = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main5.prototype.onAddToStage = function (event) {
        this.addChild(this._shape);
        var data1 = new EcgData().getEcgData(1);
        // 初始化数组
        this.initdata();
        // dataecg
        this.timerdataecg = new egret.Timer(4, 0);
        this.start(data1, this.dataecg, 0);
        this.starttimer(this.timerdataecg, this.timerEcgFunc);
        // dataecgv1
        this.start(data1, this.dataecgv1, 1);
        this.starttimer(this.timerdataecgv1, this.timerEcgv1Func);
    };
    Main5.prototype.starttimer = function (timer, timerEcgFunc) {
        timer.addEventListener(egret.TimerEvent.TIMER, timerEcgFunc, this);
        timer.start();
    };
    Main5.prototype.start = function (data1, dataecg, g_off_w) {
        for (var i = 0; i < 40; i++) {
            this.dealdata(data1, 4, (i + 1), g_off_w, i, dataecg);
        }
    };
    Main5.prototype.dealdata = function (datas, speed, idx, g_off_w, g_off_h, dataarr) {
        new DrawEcgV2(datas, idx, speed, g_off_w, g_off_h, dataarr).startDraw();
    };
    Main5.prototype.timerEcgFunc = function () {
        this.drawecg(this.dataecg);
    };
    Main5.prototype.timerEcgv1Func = function () {
        this.drawecg(this.dataecgv1);
    };
    Main5.prototype.drawecg = function (datasarr) {
        var shape = this._shape;
        shape.graphics.clear();
        shape.graphics.lineStyle(1, 0x32FF32);
        for (var i = 0; i < 40; i++) {
            var dot = datasarr[i];
            dot.length > 0 && shape.graphics.moveTo(dot[0].x, dot[0].y);
            var flag = true;
            for (var j = 1; j < 750 && j < dot.length; j++) {
                var point = dot[j];
                if (point != undefined && point.y != undefined) {
                    if (point.y == 0) {
                        flag = true;
                    }
                    else if (point.y != 0) {
                        if (flag) {
                            shape.graphics.moveTo(point.x, point.y);
                            flag = false;
                        }
                        shape.graphics.lineTo(point.x, point.y);
                    }
                }
            }
        }
    };
    Main5.prototype.initdata = function () {
        for (var i = 0; i < 40; i++) {
            this.dataecg[i] = [];
        }
        for (var i = 0; i < 40; i++) {
            this.dataecgv1[i] = [];
        }
        for (var i = 0; i < 40; i++) {
            this.dataecgv2[i] = [];
        }
        for (var i = 0; i < 40; i++) {
            this.dataecgv3[i] = [];
        }
        for (var i = 0; i < 40; i++) {
            this.databoold[i] = [];
        }
        for (var i = 0; i < 40; i++) {
            this.databooldv1[i] = [];
        }
        for (var i = 0; i < 40; i++) {
            this.databreathe[i] = [];
        }
        for (var i = 0; i < 40; i++) {
            this.databreathev1[i] = [];
        }
    };
    return Main5;
}(egret.DisplayObjectContainer));
__reflect(Main5.prototype, "Main5");
//# sourceMappingURL=Main.5.js.map