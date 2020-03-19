class Main4 extends egret.DisplayObjectContainer {

  private _shape: egret.Shape;

  constructor() {
    super();

    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
  }

  private onAddToStage(event: egret.Event) {
    this._shape = new egret.Shape();
    this.addChild(this._shape);
    var dot = this.dot;
    for (var i = 0; i < 20; i++) {
      dot[i] = [];
    }
    this.timer = new egret.Timer(40, 0);
    this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);

    this.timer.start();
    this.timerFunc()
  }
  private timer;
  private gap = 3;
  private index = 0;
  private dot = [
  ]
  //初始化赋值

  //轻触修改属性
  private timerFunc(): void {
    this.draw();
    for (var i: number = 0; i < this.dot.length; i++) {
      this.dot[i][this.index] = ((Math.random() * 20) >> 0) - 10;
    }
    this.index = (this.index + 1) % 100;
  }

  private draw(): void {
    //debugger;
    var shape: egret.Shape = this._shape;
    var dot = this.dot;
    var index = this.index;
    var gap = this.gap;
    shape.graphics.clear();
    shape.graphics.lineStyle(2, 0xff00ff);

    for (var i: number = 0; i < dot.length; i++) {
      var offsetX = ((i / 6) >> 0) * 150;
      var offsetY = (i % 6) * 100 + 50;
      dot[i].length > 0 && shape.graphics.moveTo(offsetX, dot[i][0] + offsetY);
      for (var j: number = 1; j < index && j < dot[i].length; j++) {
        shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY);
      }
      dot[i].length > index + gap && shape.graphics.moveTo(offsetX + index + gap, dot[i][index + gap] + offsetY);
      for (var j: number = index + gap + 1; j < dot[i].length; j++) {
        shape.graphics.lineTo(offsetX + j, dot[i][j] + offsetY);
      }
    }
  }
}