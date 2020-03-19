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
// TypeScript file
var startTickerTest = (function (_super) {
    __extends(startTickerTest, _super);
    function startTickerTest() {
        var _this = _super.call(this) || this;
        _this.timeOnEnterFrame = 0;
        _this.speed = 0.5;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onLoad, _this);
        return _this;
    }
    startTickerTest.prototype.onLoad = function (event) {
        var hero = new egret.Bitmap(RES.getRes("egret_icon_png"));
        this.addChild(hero);
        this.hero = hero;
        //监听帧事件
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.timeOnEnterFrame = egret.getTimer();
    };
    startTickerTest.prototype.onEnterFrame = function (e) {
        var now = egret.getTimer();
        var time = this.timeOnEnterFrame;
        var pass = now - time;
        console.log("onEnterFrame: ", (1000 / pass).toFixed(5));
        this.hero.x += this.speed * pass;
        if (this.hero.x > 300)
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.timeOnEnterFrame = egret.getTimer();
    };
    return startTickerTest;
}(egret.DisplayObjectContainer));
__reflect(startTickerTest.prototype, "startTickerTest");
//# sourceMappingURL=startTickerTest.js.map