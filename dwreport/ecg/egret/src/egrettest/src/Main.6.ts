class Main6 extends egret.DisplayObjectContainer {

  private _shape = new egret.Shape()
  private timerdata;
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


  private dataecgorg = []// 心电类原始数据数组

  constructor() {
    super();

    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
  }

  private onAddToStage(event: egret.Event) {

    this.addChild(this._shape)


    let data1 = new EcgData().getEcgData(1)

    // 初始化数组
    this.initdata();

    this.timerdata = new egret.Timer(4, 0);
    this.timerdata.addEventListener(egret.TimerEvent.TIMER, this.timerDataFunc, this)
    this.timerdata.start()


    // dataecg
    this.timerdataecg = new egret.Timer(100, 0);
    this.start(data1, 1, this.dataecg)
    this.starttimer(this.timerdataecg, this.timerEcgFunc)

    //dataecgv1
    this.timerdataecgv1 = new egret.Timer(100, 0);
    this.start(data1, 2, this.dataecgv1)
    this.starttimer(this.timerdataecgv1, this.timerEcgv1Func)

  }

  private starttimer(timer, timerEcgFunc) {
    timer.addEventListener(egret.TimerEvent.TIMER, timerEcgFunc, this);
    timer.start();

  }

  // idx  行  
  private start(data1, idx, dataecg) {

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 10; j++) {
        this.dealdata(data1, idx, i, j, dataecg)
      }

    }

  }

  private dealdata(datas, idx, g_off_w, g_off_h, dataarr) {
    let item = {
      datas: datas,
      g_idx: idx,
      g_off_w: g_off_w,
      g_off_h: g_off_h,
      dataarr: dataarr,
      sub_data_idx: 0,
      data_idx: 0
    }
    this.dataecgorg[idx - 1] = item;

  }

  private timerDataFunc() {
    for (let i = 0; i < this.dataecgorg.length; i++) {
      let item = this.dataecgorg[i]

      let datas = item.datas
      if (datas == undefined) {
        return
      }

      let data = datas[item.data_idx]
      if (data == undefined) {
        return
      }
      item.data_idx++

      if (item.sub_data_idx > 750) {
        item.sub_data_idx = 0
      }

      let x = (item.sub_data_idx * 375) / 750 + item.g_off_w * 376;
      let y = (item.g_idx + 1) * 25 - (Number(data) * 76) / 100 + item.g_off_h * 220;

      let point = {
        x: x,
        y: y
      }
      item.dataarr[item.g_idx - 1][item.sub_data_idx] = point

      // 制造缺口
      for (let j = item.sub_data_idx + 1; j < item.sub_data_idx + 5; j++) {
        let next = item.dataarr[item.g_idx - 1][j]
        if (next == undefined) {
          next = {}
        }
        next.y = 0
        item.dataarr[item.g_idx - 1][j] = next
      }


      item.sub_data_idx++
    }



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
      this.dataecgorg[i] = [];
    }

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