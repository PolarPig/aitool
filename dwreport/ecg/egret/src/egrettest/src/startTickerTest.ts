// TypeScript file
class startTickerTest extends egret.DisplayObjectContainer {
  public constructor() {
    super();
    this.once(egret.Event.ADDED_TO_STAGE, this.onLoad, this);
  }

  private hero: egret.Bitmap;
  private timeOnEnterFrame: number = 0;
  private speed: number = 0.5;

  private onLoad(event: egret.Event) {
    var hero: egret.Bitmap = new egret.Bitmap(RES.getRes("egret_icon_png"));
    this.addChild(hero);
    this.hero = hero;
    //监听帧事件
    this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    this.timeOnEnterFrame = egret.getTimer();
  }

  private onEnterFrame(e: egret.Event) {
    var now = egret.getTimer();
    var time = this.timeOnEnterFrame;
    var pass = now - time;
    console.log("onEnterFrame: ", (1000 / pass).toFixed(5));
    this.hero.x += this.speed * pass;
    if (this.hero.x > 300)
      this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    this.timeOnEnterFrame = egret.getTimer();
  }
}