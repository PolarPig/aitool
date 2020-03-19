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
var Main9 = (function (_super) {
    __extends(Main9, _super);
    function Main9() {
        var _this = _super.call(this) || this;
        _this.gap = 3;
        _this.index = 0;
        _this.dot = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main9.prototype.onAddToStage = function (event) {
        this._shape = new egret.Shape();
        this.addChild(this._shape);
        var dot = this.dot;
        for (var i = 0; i < 40; i++) {
            dot[i] = [];
        }
        this.datas = new EcgData().getEcgData(1);
        this.timer = new egret.Timer(4, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.start();
        this.timerFunc();
        // this.timerData = new egret.Timer(4, 0)
        // this.timerData.addEventListener(egret.TimerEvent.TIMER, this.timerDataFunc, this);
        // this.timerData.start();
    };
    //初始化赋值
    Main9.prototype.timerDataFunc = function () {
        for (var i = 0; i < this.dot.length; i++) {
            var data = this.datas[this.index];
            this.dot[i][this.index] = data;
        }
        this.index = (this.index + 1) % 750;
    };
    //轻触修改属性
    Main9.prototype.timerFunc = function () {
        this.draw();
        for (var i = 0; i < this.dot.length; i++) {
            var data = this.datas[this.index];
            this.dot[i][this.index] = data;
        }
        this.index = (this.index + 1) % 750;
    };
    Main9.prototype.draw = function () {
        var shape = this._shape;
        var dot = this.dot;
        var index = this.index;
        var gap = this.gap;
        shape.graphics.clear();
        shape.graphics.lineStyle(1, 0x32FF32);
        for (var i = 0; i < dot.length; i++) {
            var offsetX = ((i / 4) >> 0) * 390;
            var offsetY = (i % 4) * 100 + 220;
            dot[i].length > 0 && shape.graphics.moveTo(offsetX, dot[i][0] + offsetY);
            for (var j = 1; j < index && j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY);
            }
            dot[i].length > index + gap && shape.graphics.moveTo(offsetX + index + gap, dot[i][index + gap] + offsetY);
            for (var j = index + gap + 1; j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY);
            }
        }
    };
    return Main9;
}(egret.DisplayObjectContainer));
__reflect(Main9.prototype, "Main9");
//# sourceMappingURL=Main.9.js.map