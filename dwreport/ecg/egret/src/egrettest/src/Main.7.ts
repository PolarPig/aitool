class Main7 extends egret.DisplayObjectContainer {

  private _shape = new egret.Shape()
  private _shapegrid = new egret.Shape()
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

    this.addChild(this._shapegrid)
    new DrawGridv2(this._shapegrid).ecgDrawGrid()

    this.addChild(this._shape)



    let data1 = new EcgData().getEcgData(1)

    // 初始化数组
    this.initdata();

    this.timerdata = new egret.Timer(100, 0);
    this.timerdata.addEventListener(egret.TimerEvent.TIMER, this.timerDrawFunc, this)
    this.timerdata.start()


    // dataecg
    this.timerdataecg = new egret.Timer(4, 0);
    this.start(data1, 1)
    this.starttimer(this.timerdataecg, this.timerEcgDataFunc)

    //dataecgv1
    this.timerdataecgv1 = new egret.Timer(10, 0);
    this.start(data1, 2)
    this.starttimer(this.timerdataecgv1, this.timerEcgV1DataFunc)

  }

  private starttimer(timer, timerEcgFunc) {
    timer.addEventListener(egret.TimerEvent.TIMER, timerEcgFunc, this);
    timer.start();

  }

  private start(data1, idx) {

    let subidx = 0
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 10; j++) {
        this.dealdata(data1, idx, subidx++, i, j)
      }

    }

  }


  private dealdata(datas, idx, subidx, g_off_w, g_off_h) {
    let item = {
      datas: datas,
      g_idx: idx,
      g_off_w: g_off_w,
      g_off_h: g_off_h,
      dataarr: [],
      sub_data_idx: 0,// dataarr 数据索引
      data_idx: 0 // datas 数据索引
    }
    this.dataecgorg[idx - 1][subidx] = item;

  }


  private timerEcgDataFunc() {

    let ecgdatadeal = this.dataecgorg[0]

    for (let i = 0; i < ecgdatadeal.length; i++) {
      let item = ecgdatadeal[i]

      let data = item.datas[item.data_idx];
      if (data == undefined) {
        return item
      }
      item.data_idx++

      if (item.sub_data_idx > 750) {
        item.sub_data_idx = 0
      }

      let x = (item.sub_data_idx * 375) / 750 + item.g_off_w * 390;
      let y = item.g_idx * 25 - (Number(data) * 76) / 100 + item.g_off_h * 220;

      let point = {
        x: x,
        y: y
      }
      item.dataarr[item.sub_data_idx] = point


      // 制造缺口
      for (let j = item.sub_data_idx + 1; j < item.sub_data_idx + 5; j++) {
        let next = item.dataarr[j]
        if (next == undefined) {
          next = {}
        }
        next.y = 0
        item.dataarr[j] = next
      }

      item.sub_data_idx++

    }

  }
  private timerEcgV1DataFunc() {

    let ecgdatadeal = this.dataecgorg[1]

    for (let i = 0; i < ecgdatadeal.length; i++) {
      let item = ecgdatadeal[i]

      let data = item.datas[item.data_idx];
      if (data == undefined) {
        return item
      }
      item.data_idx++

      if (item.sub_data_idx > 750) {
        item.sub_data_idx = 0
      }

      let x = (item.sub_data_idx * 375) / 750 + item.g_off_w * 390;
      let y = item.g_idx * 25 - (Number(data) * 76) / 100 + item.g_off_h * 220;

      let point = {
        x: x,
        y: y
      }
      item.dataarr[item.sub_data_idx] = point


      // 制造缺口
      for (let j = item.sub_data_idx + 1; j < item.sub_data_idx + 5; j++) {
        let next = item.dataarr[j]
        if (next == undefined) {
          next = {}
        }
        next.y = 0
        item.dataarr[j] = next
      }

      item.sub_data_idx++

    }

  }

  private dealItem(item) {

    let data = item.datas[item.data_idx];
    if (data == undefined) {
      return item
    }
    item.data_idx++

    if (item.sub_data_idx > 750) {
      item.sub_data_idx = 0
    }

    let x = (item.sub_data_idx * 375) / 750 + item.g_off_w * 376;
    let y = item.g_idx * 25 - (Number(data) * 76) / 100 + item.g_off_h * 220;

    let point = {
      x: x,
      y: y
    }
    item.dataarr[item.sub_data_idx] = point


    // 制造缺口
    for (let j = item.sub_data_idx + 1; j < item.sub_data_idx + 5; j++) {
      let next = item.dataarr[j]
      if (next == undefined) {
        next = {}
      }
      next.y = 0
      item.dataarr[j] = next
    }

    item.sub_data_idx++
    return item
  }


  private timerDrawFunc() {
    let shape: egret.Shape = this._shape;
    shape.graphics.clear();
    shape.graphics.lineStyle(1, 0x32FF32);

    let dataecgorg = this.dataecgorg
    for (let i = 0; i < dataecgorg.length; i++) {
      let subdataorg = dataecgorg[i]// 第一种数据  ecg数据
      if (subdataorg == undefined) {
        continue
      }
      this.drawSubdata(subdataorg)
    }

  }

  private drawSubdata(subdataorg) {
    for (let i = 0; i < subdataorg.length; i++) {
      let dataarr = subdataorg[i].dataarr
      if (dataarr != undefined) {
        this.drawecg(dataarr)
      }

    }


  }




  private drawecg(datasarr): void {

    let shape: egret.Shape = this._shape;

    let flag = true
    for (let i: number = 0; i < datasarr.length; i++) {

      let point = datasarr[i];
      if (i == 0) {
        shape.graphics.moveTo(point.x, point.y);
      }

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