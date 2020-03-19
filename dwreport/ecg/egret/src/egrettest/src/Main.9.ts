class Main9 extends egret.DisplayObjectContainer {

  private _shape: egret.Shape;
  private datas;
  constructor() {
    super();

    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
  }

  private onAddToStage(event: egret.Event) {
    this._shape = new egret.Shape();
    this.addChild(this._shape);
    var dot = this.dot;
    for (var i = 0; i < 40; i++) {
      dot[i] = [];
    }

    this.datas = new EcgData().getEcgData(1)
    this.timer = new egret.Timer(4, 0);
    this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);

    this.timer.start();
    this.timerFunc()

    // this.timerData = new egret.Timer(4, 0)
    // this.timerData.addEventListener(egret.TimerEvent.TIMER, this.timerDataFunc, this);
    // this.timerData.start();

  }

  private timer;
  private timerData;
  private gap = 3;
  private index = 0;
  private dot = [
  ]
  //初始化赋值

  private timerDataFunc(): void {
    for (var i: number = 0; i < this.dot.length; i++) {
      let data = this.datas[this.index]
      this.dot[i][this.index] = data;
    }
    this.index = (this.index + 1) % 750;
  }

  //轻触修改属性
  private timerFunc(): void {
    this.draw();
    for (var i: number = 0; i < this.dot.length; i++) {
      let data = this.datas[this.index]
      this.dot[i][this.index] = data;
    }
    this.index = (this.index + 1) % 750;

  }

  private draw(): void {

    var shape: egret.Shape = this._shape;
    var dot = this.dot;
    var index = this.index;
    var gap = this.gap;
    shape.graphics.clear();
    shape.graphics.lineStyle(1, 0x32FF32);

    for (var i: number = 0; i < dot.length; i++) {

      var offsetX = ((i / 4) >> 0) * 390;
      var offsetY = (i % 4) * 100 + 220;


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