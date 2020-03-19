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
var Main6 = (function (_super) {
    __extends(Main6, _super);
    function Main6() {
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
        _this.dataecgorg = []; // 心电类原始数据数组
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main6.prototype.onAddToStage = function (event) {
        this.addChild(this._shape);
        var data1 = new EcgData().getEcgData(1);
        // 初始化数组
        this.initdata();
        this.timerdata = new egret.Timer(4, 0);
        this.timerdata.addEventListener(egret.TimerEvent.TIMER, this.timerDataFunc, this);
        this.timerdata.start();
        // dataecg
        this.timerdataecg = new egret.Timer(100, 0);
        this.start(data1, 1, this.dataecg);
        this.starttimer(this.timerdataecg, this.timerEcgFunc);
        //dataecgv1
        this.timerdataecgv1 = new egret.Timer(100, 0);
        this.start(data1, 2, this.dataecgv1);
        this.starttimer(this.timerdataecgv1, this.timerEcgv1Func);
    };
    Main6.prototype.starttimer = function (timer, timerEcgFunc) {
        timer.addEventListener(egret.TimerEvent.TIMER, timerEcgFunc, this);
        timer.start();
    };
    // idx  行  
    Main6.prototype.start = function (data1, idx, dataecg) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 10; j++) {
                this.dealdata(data1, idx, i, j, dataecg);
            }
        }
    };
    Main6.prototype.dealdata = function (datas, idx, g_off_w, g_off_h, dataarr) {
        var item = {
            datas: datas,
            g_idx: idx,
            g_off_w: g_off_w,
            g_off_h: g_off_h,
            dataarr: dataarr,
            sub_data_idx: 0,
            data_idx: 0
        };
        this.dataecgorg[idx - 1] = item;
    };
    Main6.prototype.timerDataFunc = function () {
        for (var i = 0; i < this.dataecgorg.length; i++) {
            var item = this.dataecgorg[i];
            var datas = item.datas;
            if (datas == undefined) {
                return;
            }
            var data = datas[item.data_idx];
            if (data == undefined) {
                return;
            }
            item.data_idx++;
            if (item.sub_data_idx > 750) {
                item.sub_data_idx = 0;
            }
            var x = (item.sub_data_idx * 375) / 750 + item.g_off_w * 376;
            var y = (item.g_idx + 1) * 25 - (Number(data) * 76) / 100 + item.g_off_h * 220;
            var point = {
                x: x,
                y: y
            };
            item.dataarr[item.g_idx - 1][item.sub_data_idx] = point;
            // 制造缺口
            for (var j = item.sub_data_idx + 1; j < item.sub_data_idx + 5; j++) {
                var next = item.dataarr[item.g_idx - 1][j];
                if (next == undefined) {
                    next = {};
                }
                next.y = 0;
                item.dataarr[item.g_idx - 1][j] = next;
            }
            item.sub_data_idx++;
        }
    };
    Main6.prototype.timerEcgFunc = function () {
        this.drawecg(this.dataecg);
    };
    Main6.prototype.timerEcgv1Func = function () {
        this.drawecg(this.dataecgv1);
    };
    Main6.prototype.drawecg = function (datasarr) {
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
    Main6.prototype.initdata = function () {
        for (var i = 0; i < 40; i++) {
            this.dataecgorg[i] = [];
        }
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
    return Main6;
}(egret.DisplayObjectContainer));
__reflect(Main6.prototype, "Main6");
//# sourceMappingURL=Main.6.js.map