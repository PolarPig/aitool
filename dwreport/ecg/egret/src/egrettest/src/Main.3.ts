/**
 * @copyright zsp
 * @author ll
 * @desc 绘制直线api。
 */

class Main33 extends egret.DisplayObjectContainer {

  private achievementScoller = new eui.Scroller();

  private Allshap: Array<egret.Shape> = new Array<egret.Shape>();

  constructor() {
    super();

    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

  }

  private onAddToStage(event: egret.Event) {


    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 4; j++) {
        this.draw(i, j)
      }
    }


    setInterval(this.mergeShape, 100, this);



  }

  private mergeShape(that) {

    for (let i = 0; i < that.Allshap.length; i++) {

      let shape = that.Allshap[i];

      that.addChild(shape);
      //that.removeChild(shape);
    }

  }

  //this.drawidx = setInterval(this.drawCanvas,100,this);

  private draw(g_off_h, g_off_w) {

    // 画 ecg 单导
    this.initDraw(new EcgData().getEcgData(1), 1, 4, g_off_h, g_off_w)
    // 画 ecg 单导 V1
    this.initDraw(new EcgData().getEcgData(1), 2, 10, g_off_h, g_off_w);

    // 画 ecg 单导 V2
    this.initDraw(new EcgData().getEcgData(1), 3, 20, g_off_h, g_off_w);

    // 画 ecg 单导 V3
    this.initDraw(new EcgData().getEcgData(1), 4, 2, g_off_h, g_off_w);

  }


  private initDraw(datas, g_idx, speed, g_off_h, g_off_w) {

    let ecg: egret.Shape = new egret.Shape();
    ecg.cacheAsBitmap = true

    if (g_idx == 1) {
      this.addChild(ecg);
    } else {
      let len = this.Allshap.length;
      this.Allshap[len] = ecg
    }

    new DrawEcg(ecg, datas, g_idx, speed, g_off_h, g_off_w).ecgDraw();

  }



}