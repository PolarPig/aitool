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
var Main4 = (function (_super) {
    __extends(Main4, _super);
    function Main4() {
        var _this = _super.call(this) || this;
        _this.gap = 3;
        _this.index = 0;
        _this.dot = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main4.prototype.onAddToStage = function (event) {
        this._shape = new egret.Shape();
        this.addChild(this._shape);
        var dot = this.dot;
        for (var i = 0; i < 20; i++) {
            dot[i] = [];
        }
        this.timer = new egret.Timer(40, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.start();
        this.timerFunc();
    };
    //初始化赋值
    //轻触修改属性
    Main4.prototype.timerFunc = function () {
        this.draw();
        for (var i = 0; i < this.dot.length; i++) {
            this.dot[i][this.index] = ((Math.random() * 20) >> 0) - 10;
        }
        this.index = (this.index + 1) % 100;
    };
    Main4.prototype.draw = function () {
        //debugger;
        var shape = this._shape;
        var dot = this.dot;
        var index = this.index;
        var gap = this.gap;
        shape.graphics.clear();
        shape.graphics.lineStyle(2, 0xff00ff);
        for (var i = 0; i < dot.length; i++) {
            var offsetX = ((i / 6) >> 0) * 150;
            var offsetY = (i % 6) * 100 + 50;
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
    return Main4;
}(egret.DisplayObjectContainer));
__reflect(Main4.prototype, "Main4");
//# sourceMappingURL=Main.4.js.map