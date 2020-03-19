/**
 * @copyright www.egret.com
 * @author city
 * @desc 位图缓存是一项在特定情况下可以提升性能的利器。
 *      其原理是将一组在相当长时间内显示状态及相对位置保持恒定的显示对象建立一个
 *      快照，在后续显示中用这个快照代替这一组显示内容。通常用于图形或文字。
 *      但请注意，仅当缓存的位图可以一次生成，且随后无需更新即可使用时，才适合使
 *      用位图缓存功能。并且缓存后的图像也不应该进行旋转、缩放及修改其透明度。否
 *      则将会因为频繁建立快照产生比不缓存性能更差的结果。
 *      本示例用了一组文字、一组绘制图形、和一组位图图形进行缓存，并且对缓存的内
 *      容进行缩放旋转或平移的操作。
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
var Main2 = (function (_super) {
    __extends(Main2, _super);
    function Main2() {
        var _this = _super.call(this) || this;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main2.prototype.onAddToStage = function (evt) {
        var imgLoader = new egret.ImageLoader;
        imgLoader.once(egret.Event.COMPLETE, this.imgLoadHandler, this);
        imgLoader.load("resource/cartoon-egret_02_small.png");
    };
    Main2.prototype.imgLoadHandler = function (evt) {
        var _this = this;
        this._bmd = evt.currentTarget.data;
        this._rectScope = new egret.Rectangle(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        /// 产生确定数量的容器并归档
        this._vcCont = new Array();
        for (var i = 0; i < Main2.NUM; ++i) {
            var cont = new MotionSprite();
            /// 给一个随机的初始位置
            cont.anchorOffsetX = L.W_SHAPE / 2;
            cont.anchorOffsetY = L.H_SHAPE / 2;
            cont.x = this._rectScope.x + this._rectScope.width * Math.random();
            cont.y = this._rectScope.y + this._rectScope.height * Math.random();
            cont.factor = .8 + Math.random() * .4;
            this._vcCont.push(cont);
            this.addChild(cont);
        }
        /// 随机填充
        BatchContentFiller.reset(this._vcCont);
        BatchContentFiller.fill(this._vcCont);
        BatchContentFiller.autoAncher(this._vcCont);
        /// 提示信息
        this._txInfo = new egret.TextField;
        this.addChild(this._txInfo);
        this._txInfo.size = 28;
        this._txInfo.x = 250;
        this._txInfo.y = 10;
        this._txInfo.width = this.stage.stageWidth - 260;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.touchEnabled = true;
        this._txInfo.cacheAsBitmap = true;
        //this._txInfo.background = true;
        //this._txInfo.backgroundColor = 0xffffff;
        this._bgInfo = new egret.Shape;
        this.addChildAt(this._bgInfo, this.numChildren - 1);
        this._bgInfo.x = this._txInfo.x;
        this._bgInfo.y = this._txInfo.y;
        this._bgInfo.cacheAsBitmap = true;
        /// 控制变量
        this._nScaleBase = 0;
        this._bCache = false;
        /// 用户控制
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            _this.planRdmMotion();
        }, this);
        this._txInfo.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            evt.stopImmediatePropagation();
            _this._bCache = !_this._bCache;
            for (var i = _this._vcCont.length - 1; i >= 0; i--) {
                _this._vcCont[i].cacheAsBitmap = _this._bCache;
            }
            _this.updateInfo();
        }, this);
        this.planRdmMotion();
        /// 产生动画
        this.stage.addEventListener(egret.Event.ENTER_FRAME, function (evt) {
            /*** 本示例关键代码段开始 ***/
            switch (_this._iMotionMode) {
                case MotionMode.ROT:/// 旋转并伴随缩放
                    var scale = Main2.SCALE_BASE + Math.abs(Math.sin(_this._nScaleBase += 0.05)) * Main2.SCALE_RANGE;
                    for (var i = _this._vcCont.length - 1; i >= 0; i--) {
                        _this._vcCont[i].rotation += 3 * (i % 2 ? 1 : -1) * _this._vcCont[i].factor;
                        _this._vcCont[i].scaleX = _this._vcCont[i].scaleY = scale;
                    }
                    break;
                case MotionMode.MOV:/// 移动模式控制
                    var xTo;
                    for (var i = _this._vcCont.length - 1; i >= 0; i--) {
                        xTo = _this._vcCont[i].x + 3 * (i % 2 ? 1 : -1) * _this._vcCont[i].factor;
                        if (xTo < _this._rectScope.left) {
                            xTo = _this._rectScope.right;
                        }
                        else if (xTo > _this._rectScope.right) {
                            xTo = _this._rectScope.left;
                        }
                        _this._vcCont[i].x = xTo;
                    }
                    break;
            }
            /*** 本示例关键代码段结束 ***/
        }, this);
    };
    /// 随机设置运动内容
    Main2.prototype.planRdmMotion = function () {
        if (arguments.callee['runyet'] == undefined) {
            arguments.callee['runyet'] = 1;
            this._iMotionMode = Math.random() > .5 ? MotionMode.ROT : MotionMode.MOV;
        }
        else {
            this._iMotionMode = (this._iMotionMode + 1) % MotionMode.TOTAL;
        }
        this.updateInfo();
        /// 还原比例
        switch (this._iMotionMode) {
            case MotionMode.ROT:
                for (var i = this._vcCont.length - 1; i >= 0; i--) {
                    this._vcCont[i].scaleX = this._vcCont[i].scaleY = Main2.SCALE_BASE;
                }
                break;
            case MotionMode.MOV:
                for (var i = this._vcCont.length - 1; i >= 0; i--) {
                    this._vcCont[i].scaleX = this._vcCont[i].scaleY = Main2.SCALE_BASE + Math.random() * Main2.SCALE_RANGE;
                }
                break;
        }
    };
    Main2.prototype.updateInfo = function () {
        this._txInfo.text =
            "轻触文字切换是否用位图缓存" +
                "\n当前位图缓存：" + (this._bCache ? "启用\n还卡？换手机吧！" : "关闭\n不卡只能说明机器太牛！") +
                "\n轻触舞台切换旋转缩放/平移" +
                "\n当前运动：" + (["旋转缩放", "平移"][this._iMotionMode]);
        this._bgInfo.graphics.clear();
        this._bgInfo.graphics.beginFill(0xffffff, .5);
        this._bgInfo.graphics.drawRect(0, 0, this._txInfo.width, this._txInfo.height);
        this._bgInfo.graphics.endFill();
    };
    Main2.UNITS_PER_CONT = 16;
    Main2.NUM = 64;
    Main2.SCALE_BASE = .7;
    Main2.SCALE_RANGE = .6;
    return Main2;
}(egret.DisplayObjectContainer));
__reflect(Main2.prototype, "Main2");
var MotionSprite = (function (_super) {
    __extends(MotionSprite, _super);
    function MotionSprite() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MotionSprite;
}(egret.Sprite));
__reflect(MotionSprite.prototype, "MotionSprite");
var L = (function () {
    function L() {
    }
    L.W_SHAPE = 160;
    L.H_SHAPE = 210;
    return L;
}());
__reflect(L.prototype, "L");
var MotionMode = (function () {
    function MotionMode() {
    }
    MotionMode.ROT = 0;
    MotionMode.MOV = 1;
    MotionMode.TOTAL = 2;
    return MotionMode;
}());
__reflect(MotionMode.prototype, "MotionMode");
var BatchContentFiller = (function () {
    function BatchContentFiller() {
    }
    /// 填充内容，目前均为简单矢量图形
    BatchContentFiller.fill = function (vcCont) {
        for (var i = 0; i < Main2.UNITS_PER_CONT; i++) {
            this.prodRdmGraph(vcCont, L.W_SHAPE, L.H_SHAPE);
        }
    };
    BatchContentFiller.prodRdmGraph = function (vcCont, w, h) {
        var iTypeShape = Math.floor(Math.random() * 2);
        var iFillColor = (Math.floor(Math.random() * 0xff) << 16)
            + (Math.floor(Math.random() * 0xff) << 8)
            + Math.floor(Math.random() * 0xff);
        var iLineColor = (Math.floor(Math.random() * 0xff) << 16)
            + (Math.floor(Math.random() * 0xff) << 8)
            + Math.floor(Math.random() * 0xff);
        var radius = 20 + Math.random() * 10;
        var wRect = 30 + Math.random() * 20;
        var hRect = 20 + Math.random() * 10;
        var xRdm = L.W_SHAPE * Math.random();
        var yRdm = L.H_SHAPE * Math.random();
        console.log("prodRdmGraph:", radius, wRect, hRect, xRdm, yRdm, iFillColor, iLineColor, iTypeShape);
        for (var i = vcCont.length - 1; i >= 0; i--) {
            switch (iTypeShape) {
                case 0:/// 矩形
                    //vcCont[i].graphics.lineStyle( iLineColor );
                    vcCont[i].graphics.beginFill(iFillColor);
                    vcCont[i].graphics.drawRect(xRdm - wRect / 2, yRdm - hRect / 2, wRect, hRect);
                    vcCont[i].graphics.endFill();
                    console.log("prodRdmGraph: 画矩形", i);
                    break;
                case 1:/// 圆形
                    //vcCont[i].graphics.lineStyle( iLineColor );
                    vcCont[i].graphics.beginFill(iFillColor);
                    vcCont[i].graphics.drawCircle(xRdm, yRdm, radius);
                    vcCont[i].graphics.endFill();
                    break;
            }
        }
    };
    /// 自动居中所有容器的锚点
    BatchContentFiller.autoAncher = function (vcCont) {
        for (var i = vcCont.length - 1; i >= 0; i--) {
            vcCont[i].anchorOffsetX = vcCont[i].width / 2;
            vcCont[i].anchorOffsetY = vcCont[i].height / 2;
            console.log("vcCont[i] 新锚点：", vcCont[i].anchorOffsetX, vcCont[i].anchorOffsetY);
        }
    };
    BatchContentFiller.reset = function (vcCont) {
        for (var i = vcCont.length - 1; i >= 0; i--) {
            vcCont[i].graphics.clear();
            vcCont[i].removeChildren();
        }
    };
    return BatchContentFiller;
}());
__reflect(BatchContentFiller.prototype, "BatchContentFiller");
//# sourceMappingURL=Main.1.js.map