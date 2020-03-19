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
var Main7 = (function (_super) {
    __extends(Main7, _super);
    function Main7() {
        var _this = _super.call(this) || this;
        _this._shape = new egret.Shape();
        _this._shapegrid = new egret.Shape();
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
    Main7.prototype.onAddToStage = function (event) {
        this.addChild(this._shapegrid);
        new DrawGridv2(this._shapegrid).ecgDrawGrid();
        this.addChild(this._shape);
        var data1 = new EcgData().getEcgData(1);
        // 初始化数组
        this.initdata();
        this.timerdata = new egret.Timer(100, 0);
        this.timerdata.addEventListener(egret.TimerEvent.TIMER, this.timerDrawFunc, this);
        this.timerdata.start();
        // dataecg
        this.timerdataecg = new egret.Timer(4, 0);
        this.start(data1, 1);
        this.starttimer(this.timerdataecg, this.timerEcgDataFunc);
        //dataecgv1
        this.timerdataecgv1 = new egret.Timer(10, 0);
        this.start(data1, 2);
        this.starttimer(this.timerdataecgv1, this.timerEcgV1DataFunc);
    };
    Main7.prototype.starttimer = function (timer, timerEcgFunc) {
        timer.addEventListener(egret.TimerEvent.TIMER, timerEcgFunc, this);
        timer.start();
    };
    Main7.prototype.start = function (data1, idx) {
        var subidx = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 10; j++) {
                this.dealdata(data1, idx, subidx++, i, j);
            }
        }
    };
    Main7.prototype.dealdata = function (datas, idx, subidx, g_off_w, g_off_h) {
        var item = {
            datas: datas,
            g_idx: idx,
            g_off_w: g_off_w,
            g_off_h: g_off_h,
            dataarr: [],
            sub_data_idx: 0,
            data_idx: 0 // datas 数据索引
        };
        this.dataecgorg[idx - 1][subidx] = item;
    };
    Main7.prototype.timerEcgDataFunc = function () {
        var ecgdatadeal = this.dataecgorg[0];
        for (var i = 0; i < ecgdatadeal.length; i++) {
            var item = ecgdatadeal[i];
            var data = item.datas[item.data_idx];
            if (data == undefined) {
                return item;
            }
            item.data_idx++;
            if (item.sub_data_idx > 750) {
                item.sub_data_idx = 0;
            }
            var x = (item.sub_data_idx * 375) / 750 + item.g_off_w * 390;
            var y = item.g_idx * 25 - (Number(data) * 76) / 100 + item.g_off_h * 220;
            var point = {
                x: x,
                y: y
            };
            item.dataarr[item.sub_data_idx] = point;
            // 制造缺口
            for (var j = item.sub_data_idx + 1; j < item.sub_data_idx + 5; j++) {
                var next = item.dataarr[j];
                if (next == undefined) {
                    next = {};
                }
                next.y = 0;
                item.dataarr[j] = next;
            }
            item.sub_data_idx++;
        }
    };
    Main7.prototype.timerEcgV1DataFunc = function () {
        var ecgdatadeal = this.dataecgorg[1];
        for (var i = 0; i < ecgdatadeal.length; i++) {
            var item = ecgdatadeal[i];
            var data = item.datas[item.data_idx];
            if (data == undefined) {
                return item;
            }
            item.data_idx++;
            if (item.sub_data_idx > 750) {
                item.sub_data_idx = 0;
            }
            var x = (item.sub_data_idx * 375) / 750 + item.g_off_w * 390;
            var y = item.g_idx * 25 - (Number(data) * 76) / 100 + item.g_off_h * 220;
            var point = {
                x: x,
                y: y
            };
            item.dataarr[item.sub_data_idx] = point;
            // 制造缺口
            for (var j = item.sub_data_idx + 1; j < item.sub_data_idx + 5; j++) {
                var next = item.dataarr[j];
                if (next == undefined) {
                    next = {};
                }
                next.y = 0;
                item.dataarr[j] = next;
            }
            item.sub_data_idx++;
        }
    };
    Main7.prototype.dealItem = function (item) {
        var data = item.datas[item.data_idx];
        if (data == undefined) {
            return item;
        }
        item.data_idx++;
        if (item.sub_data_idx > 750) {
            item.sub_data_idx = 0;
        }
        var x = (item.sub_data_idx * 375) / 750 + item.g_off_w * 376;
        var y = item.g_idx * 25 - (Number(data) * 76) / 100 + item.g_off_h * 220;
        var point = {
            x: x,
            y: y
        };
        item.dataarr[item.sub_data_idx] = point;
        // 制造缺口
        for (var j = item.sub_data_idx + 1; j < item.sub_data_idx + 5; j++) {
            var next = item.dataarr[j];
            if (next == undefined) {
                next = {};
            }
            next.y = 0;
            item.dataarr[j] = next;
        }
        item.sub_data_idx++;
        return item;
    };
    Main7.prototype.timerDrawFunc = function () {
        var shape = this._shape;
        shape.graphics.clear();
        shape.graphics.lineStyle(1, 0x32FF32);
        var dataecgorg = this.dataecgorg;
        for (var i = 0; i < dataecgorg.length; i++) {
            var subdataorg = dataecgorg[i]; // 第一种数据  ecg数据
            if (subdataorg == undefined) {
                continue;
            }
            this.drawSubdata(subdataorg);
        }
    };
    Main7.prototype.drawSubdata = function (subdataorg) {
        for (var i = 0; i < subdataorg.length; i++) {
            var dataarr = subdataorg[i].dataarr;
            if (dataarr != undefined) {
                this.drawecg(dataarr);
            }
        }
    };
    Main7.prototype.drawecg = function (datasarr) {
        var shape = this._shape;
        var flag = true;
        for (var i = 0; i < datasarr.length; i++) {
            var point = datasarr[i];
            if (i == 0) {
                shape.graphics.moveTo(point.x, point.y);
            }
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
    };
    Main7.prototype.initdata = function () {
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
    return Main7;
}(egret.DisplayObjectContainer));
__reflect(Main7.prototype, "Main7");
//# sourceMappingURL=Main.7.js.map