
import Sprite = Laya.Sprite;
import Stage = Laya.Stage;
import WebGL = Laya.WebGL;
export default class DrawGrid {
    private sp: Sprite;
    constructor()  {
        Laya.init(500, 300, WebGL);
        this.drawSomething();
    }
    private drawSomething(): void {
        this.sp = new Sprite();
        Laya.stage.addChild(this.sp);


        var width = 1548
        var height = 2250

      

        this.sp.graphics.drawLine(0, 0, 0, height, "#303641", 1);
        this.sp.graphics.drawLine(0, height, width, height, "#303641", 1);
        this.sp.graphics.drawLine(width, height, width, 0, "#303641", 1);
        this.sp.graphics.drawLine(width, 0, 0, 0, "#303641", 1);


        var idx = 0
        for (var i = 19; i < (width); i = i + 19) {
            this.sp.graphics.drawLine(i, 0, i, height, "#303641", 1);
        }

        for (var i = 19; i < (height); i = i + 19) {
            this.sp.graphics.drawLine(0, i, width, i, "#303641", 1);
        }


        for (var i = 1; i < 5; i++) {
            this.sp.graphics.drawLine(i * 387, 0, i * 387, height, "#303641", 2);
        }

        for (var i = 1; i < 10; i++) {
            this.sp.graphics.drawLine(0, i * 220, width, i * 220, "#303641", 2);
        }

    }
}
