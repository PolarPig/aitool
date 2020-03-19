/**
 * @copyright zsp
 * @author ll
 * @desc 绘制直线api。
 */

class Main3 extends egret.DisplayObjectContainer {
    
    
    private ALLDg:Array<Dg> = new Array<Dg>();


    constructor() {
        super();
        
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
  
    }


    private initDraw(datas,g_idx,speed,g_off_h,g_off_w){
        let dgshap = new egret.Shape()
        dgshap.cacheAsBitmap = true
        this.addChild(dgshap)
        let dg = new Dg(dgshap,new EcgData().getEcgData(1),g_idx,speed,g_off_h,g_off_w)
        this.ALLDg.push(dg)
       
    }


    private draw(g_off_h,g_off_w){

        // 画 ecg 单导
        this.initDraw(new EcgData().getEcgData(1),1,4,g_off_h,g_off_w)
          // 画 ecg 单导 V1
        this.initDraw(new EcgData().getEcgData(1),2,10,g_off_h,g_off_w);

        // 画 ecg 单导 V2
        this.initDraw(new EcgData().getEcgData(1),3,20,g_off_h,g_off_w);

        // 画 ecg 单导 V3
        this.initDraw(new EcgData().getEcgData(1),4,2,g_off_h,g_off_w);


    }
    private onAddToStage(event:egret.Event) {


      for(let i=0;i<10;i++){
        for (let j =0;j<4;j++){
             this.draw(i,j)
         }
       }
         
       
       /// 产生动画
       this.stage.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{

         let tmpshap = this.ALLDg[0]._shape

          for(let i =0;i<this.ALLDg.length;i++){
              this.ALLDg[i].ecgDraw()
          }

        }, this)

    }

}