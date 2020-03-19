class Main8 extends egret.DisplayObjectContainer {

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
    this.timer = new egret.Timer(40, 0);
    this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);

    this.timer.start();
    this.timerFunc()

    this.timerData = new egret.Timer(4, 0)
    this.timerData.addEventListener(egret.TimerEvent.TIMER, this.timerDataFunc, this);
    this.timerData.start();

  }

  private timer;
  private timerData;
  private gap = 3;
  private index = 0;
  private dot = [
  ]
  //初始化赋值

  private timerDataFunc(): void {

    let idx = 0
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 4; j++) {

        let data = this.datas[this.index]

        let x = (this.index * 375) / 750 + j * 390;
        let y = (i + 1) * 25 - (Number(data) * 76) / 100 + i * 220;

        let item = {
          x: x,
          y: y
        }

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

  }


  //轻触修改属性
  private timerFunc(): void {
    this.draw();

  }

  private draw(): void {

    var shape: egret.Shape = this._shape;
    var dot = this.dot;
    var index = this.index;
    var gap = this.gap;
    shape.graphics.clear();
    shape.graphics.lineStyle(1, 0x32FF32);

    for (var i: number = 0; i < dot.length; i++) {

      let itemarr = dot[i]


      dot[i].length > 0 && shape.graphics.moveTo(itemarr[0].x, itemarr[0].y);
      for (var j: number = 1; j < index && j < itemarr.length; j++) {

        let item = itemarr[j]

        shape.graphics.lineTo(item.x, item.y);

      }

      dot[i].length > index + gap && shape.graphics.moveTo(itemarr[0].x + index + gap, dot[i][index + gap] + itemarr[0].y);
      for (var j: number = index + gap + 1; j < dot[i].length; j++) {
        let item = itemarr[j]
        shape.graphics.lineTo(item.x, item.y);
      }
    }
  }
}