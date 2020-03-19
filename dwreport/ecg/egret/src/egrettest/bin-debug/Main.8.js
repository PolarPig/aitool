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
var Main8 = (function (_super) {
    __extends(Main8, _super);
    function Main8() {
        var _this = _super.call(this) || this;
        _this.gap = 3;
        _this.index = 0;
        _this.dot = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main8.prototype.onAddToStage = function (event) {
        this._shape = new egret.Shape();
        this.addChild(this._shape);
        var dot = this.dot;
        for (var i = 0; i < 40; i++) {
            dot[i] = [];
        }
        this.datas = new EcgData().getEcgData(1);
        this.timer = new egret.Timer(40, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.start();
        this.timerFunc();
        this.timerData = new egret.Timer(4, 0);
        this.timerData.addEventListener(egret.TimerEvent.TIMER, this.timerDataFunc, this);
        this.timerData.start();
    };
    //初始化赋值
    Main8.prototype.timerDataFunc = function () {
        var idx = 0;
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 4; j++) {
                var data = this.datas[this.index];
                var x = (this.index * 375) / 750 + j * 390;
                var y = (i + 1) * 25 - (Number(data) * 76) / 100 + i * 220;
                var item = {
                    x: x,
                    y: y
                };
                this.dot[idx++][this.index] = item;
            }
        }
        this.index = (this.index + 1) % 750;
        // for (var i: number = 0; i < this.dot.length; i++) {
        //   let data = this.datas[this.index]
        //   let x = (this.index * 375) / 750;//+ item.g_off_w * 376;
        //   let y = i * 25 - (Number(data) * 76) / 100;//+ item.g_off_h * 220;
        //   let item = {
        //     x: x,
        //     y: y
        //   }
        //   this.dot[i][this.index] = item;
        // }
    };
    //轻触修改属性
    Main8.prototype.timerFunc = function () {
        this.draw();
    };
    Main8.prototype.draw = function () {
        var shape = this._shape;
        var dot = this.dot;
        var index = this.index;
        var gap = this.gap;
        shape.graphics.clear();
        shape.graphics.lineStyle(1, 0x32FF32);
        for (var i = 0; i < dot.length; i++) {
            var itemarr = dot[i];
            dot[i].length > 0 && shape.graphics.moveTo(itemarr[0].x, itemarr[0].y);
            for (var j = 1; j < index && j < itemarr.length; j++) {
                var item = itemarr[j];
                shape.graphics.lineTo(item.x, item.y);
            }
            dot[i].length > index + gap && shape.graphics.moveTo(itemarr[0].x + index + gap, dot[i][index + gap] + itemarr[0].y);
            for (var j = index + gap + 1; j < dot[i].length; j++) {
                var item = itemarr[j];
                shape.graphics.lineTo(item.x, item.y);
            }
        }
    };
    return Main8;
}(egret.DisplayObjectContainer));
__reflect(Main8.prototype, "Main8");
//# sourceMappingURL=Main.8.js.map