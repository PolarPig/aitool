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
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.gap = 3;
        _this.index = 0;
        _this.g_idx = 0;
        _this.dot = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        egret.runEgret({ renderMode: "webgl" });
        this._shape = new egret.Shape();
        this.addChild(this._shape);
        this._datas = new EcgData().getEcgData(1);
        var dot = this.dot;
        for (var i = 0; i < 40; i++) {
            dot[i] = [];
        }
        this.timer = new egret.Timer(40, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.start();
        this.timerFunc();
    };
    //初始化赋值
    //轻触修改属性
    Main.prototype.timerFunc = function () {
        this.draw();
        for (var i = 0; i < this.dot.length; i++) {
            this.dot[i][this.index] = this._datas[this.g_idx++];
        }
        this.index = (this.index + 1) % 230;
    };
    Main.prototype.draw = function () {
        var shape = this._shape;
        var dot = this.dot;
        var index = this.index;
        var gap = this.gap;
        shape.graphics.clear();
        shape.graphics.lineStyle(1, 0xff00ff);
        for (var i = 0; i < dot.length; i++) {
            var offsetX = ((i / 6) >> 0) * 250;
            var offsetY = (i % 6) * 180 + 50;
            dot[i].length > 0 && shape.graphics.moveTo(offsetX, dot[i][0] + offsetY);
            for (var j = 1; j < index && j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY);
            }
            dot[i].length > index + gap && shape.graphics.moveTo(offsetX + index + gap, dot[i][index + gap] + offsetY);
            for (var j = index + gap + 1; j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY);
            }
            dot[i].length > 0 && shape.graphics.moveTo(offsetX, dot[i][0] + offsetY + 20);
            for (var j = 1; j < index && j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 20);
            }
            dot[i].length > index + gap && shape.graphics.moveTo(offsetX + index + gap, dot[i][index + gap] + offsetY + 20);
            for (var j = index + gap + 1; j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 20);
            }
            dot[i].length > 0 && shape.graphics.moveTo(offsetX, dot[i][0] + offsetY + 40);
            for (var j = 1; j < index && j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 40);
            }
            dot[i].length > index + gap && shape.graphics.moveTo(offsetX + index + gap, dot[i][index + gap] + offsetY + 40);
            for (var j = index + gap + 1; j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 40);
            }
            dot[i].length > 0 && shape.graphics.moveTo(offsetX, dot[i][0] + offsetY + 60);
            for (var j = 1; j < index && j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 60);
            }
            dot[i].length > index + gap && shape.graphics.moveTo(offsetX + index + gap, dot[i][index + gap] + offsetY + 60);
            for (var j = index + gap + 1; j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 60);
            }
            dot[i].length > 0 && shape.graphics.moveTo(offsetX, dot[i][0] + offsetY + 80);
            for (var j = 1; j < index && j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 80);
            }
            dot[i].length > index + gap && shape.graphics.moveTo(offsetX + index + gap, dot[i][index + gap] + offsetY + 80);
            for (var j = index + gap + 1; j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 80);
            }
            dot[i].length > 0 && shape.graphics.moveTo(offsetX, dot[i][0] + offsetY + 100);
            for (var j = 1; j < index && j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 100);
            }
            dot[i].length > index + gap && shape.graphics.moveTo(offsetX + index + gap, dot[i][index + gap] + offsetY + 100);
            for (var j = index + gap + 1; j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 100);
            }
            dot[i].length > 0 && shape.graphics.moveTo(offsetX, dot[i][0] + offsetY + 110);
            for (var j = 1; j < index && j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 110);
            }
            dot[i].length > index + gap && shape.graphics.moveTo(offsetX + index + gap, dot[i][index + gap] + offsetY + 110);
            for (var j = index + gap + 1; j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 110);
            }
            dot[i].length > 0 && shape.graphics.moveTo(offsetX, dot[i][0] + offsetY + 120);
            for (var j = 1; j < index && j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 120);
            }
            dot[i].length > index + gap && shape.graphics.moveTo(offsetX + index + gap, dot[i][index + gap] + offsetY + 120);
            for (var j = index + gap + 1; j < dot[i].length; j++) {
                shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY + 120);
            }
        }
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map