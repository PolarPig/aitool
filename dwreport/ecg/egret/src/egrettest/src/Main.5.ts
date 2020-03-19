class Main5 extends egret.DisplayObjectContainer {

  private _shape = new egret.Shape()
  private timerdataecg;
  private timerdataecgv1;
  private timerdataecgv2;
  private timerdataecgv3;

  private timerdataboold;
  private timerdatabooldv1;
  private timerdatabreathe;
  private timerdatabreathev1;


  private dataecg = []
  private dataecgv1 = []
  private dataecgv2 = []
  private dataecgv3 = []
  private databoold = []
  private databooldv1 = []
  private databreathe = []
  private databreathev1 = []


  constructor() {
    super();

    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
  }

  private onAddToStage(event: egret.Event) {

    this.addChild(this._shape)


    let data1 = new EcgData().getEcgData(1)

    // 初始化数组
    this.initdata();
    // dataecg
    this.timerdataecg = new egret.Timer(4, 0);
    this.start(data1, this.dataecg, 0)
    this.starttimer(this.timerdataecg, this.timerEcgFunc)

    // dataecgv1
    this.start(data1, this.dataecgv1, 1)
    this.starttimer(this.timerdataecgv1, this.timerEcgv1Func)

  }

  private starttimer(timer, timerEcgFunc) {
    timer.addEventListener(egret.TimerEvent.TIMER, timerEcgFunc, this);
    timer.start();

  }


  private start(data1, dataecg, g_off_w) {

    for (let i = 0; i < 40; i++) {
      this.dealdata(data1, 4, (i + 1), g_off_w, i, dataecg)
    }

  }

  private dealdata(datas, speed, idx, g_off_w, g_off_h, dataarr) {

    new DrawEcgV2(datas, idx, speed, g_off_w, g_off_h, dataarr).startDraw()

  }




  private timerEcgFunc(): void {
    this.drawecg(this.dataecg);
  }

  private timerEcgv1Func(): void {
    this.drawecg(this.dataecgv1);
  }

  private drawecg(datasarr): void {

    let shape: egret.Shape = this._shape;
    shape.graphics.clear();
    shape.graphics.lineStyle(1, 0x32FF32);

    for (let i: number = 0; i < 40; i++) {

      let dot = datasarr[i];

      dot.length > 0 && shape.graphics.moveTo(dot[0].x, dot[0].y);

      let flag = true
      for (let j: number = 1; j < 750 && j < dot.length; j++) {
        let point = dot[j];
        if (point != undefined && point.y != undefined) {
          if (point.y == 0) {
            flag = true
          } else if (point.y != 0) {
            if (flag) {
              shape.graphics.moveTo(point.x, point.y);
              flag = false
            }
            shape.graphics.lineTo(point.x, point.y);
          }
        }

      }
    }
  }

  private initdata() {

    for (let i = 0; i < 40; i++) {
      this.dataecg[i] = [];
    }

    for (let i = 0; i < 40; i++) {
      this.dataecgv1[i] = [];
    }
    for (let i = 0; i < 40; i++) {
      this.dataecgv2[i] = [];
    }
    for (let i = 0; i < 40; i++) {
      this.dataecgv3[i] = [];
    }
    for (let i = 0; i < 40; i++) {
      this.databoold[i] = [];
    }
    for (let i = 0; i < 40; i++) {
      this.databooldv1[i] = [];
    }
    for (let i = 0; i < 40; i++) {
      this.databreathe[i] = [];
    }
    for (let i = 0; i < 40; i++) {
      this.databreathev1[i] = [];
    }

  }

}