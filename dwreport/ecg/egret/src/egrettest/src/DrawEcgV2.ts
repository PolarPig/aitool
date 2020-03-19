// TypeScript file

class DrawEcgV2 {

  private g_idx = 1;//第几行
  private g_data_idx = 0;
  private timer;
  private timerdata;
  private gap = 3;
  private index = 0;
  private datas = []
  private datasarr = []
  // 速度
  private speed = 4;


  // 第几列 默认第 0 列表
  private g_off_w = 0;
  // 第几行 默认第 0 行 
  private g_off_h = 0;

  /**
   * shape 画笔 
   * datas 数据
   * g_idx 第几行
   * speed 速度
   */
  constructor(datas, idx, speed, g_off_w, g_off_h, datasarr) {

    this.datas = datas
    this.g_idx = idx
    this.speed = speed;
    this.g_off_w = g_off_w;
    this.g_off_h = g_off_h;
    this.datasarr = datasarr

  }


  public startDraw() {




    this.datas = new EcgData().getEcgData(1);

    this.timerdata = new egret.Timer(this.speed, 0);
    this.timerdata.addEventListener(egret.TimerEvent.TIMER, this.timerDataFunc, this)
    this.timerdata.start()



  }

  private timerDataFunc() {
    let data = this.datas[this.g_data_idx];
    if (data == undefined) {
      return
    }
    this.g_data_idx++


    if (this.index > 750) {
      this.index = 0
    }

    let x = (this.index * 375) / 750 + this.g_off_w * 375;
    let y = (this.g_idx + 1) * 25 - (Number(data) * 76) / 100 + this.g_off_h * 220;

    let item = {
      x: x,
      y: y
    }
    this.datasarr[this.g_idx - 1][this.index] = item

    // 制造缺口
    for (let i = this.index + 1; i < this.index + 5; i++) {
      let next = this.datasarr[this.g_idx - 1][i]
      if (next == undefined) {
        next = {}
      }
      next.y = 0
      this.datasarr[this.g_idx - 1][i] = next
    }


    this.index++
  }




}