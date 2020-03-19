// TypeScript file

class DrawGrid {

    private _shapgrid:egret.Shape;

    // 第几列 默认第 0 列表
    private g_off_w = 0;
     // 第几行 默认第 0 行 
    private g_off_h = 0;

    constructor(shape,g_off_w,g_off_h){
        this._shapgrid = shape
        this.g_off_w = g_off_w
        this.g_off_h = g_off_h
    }

        //画低格
    public ecgDrawGrid():void {
        
        let shapgrid = this._shapgrid

        shapgrid.graphics.lineStyle(1, 0x303641);

        let width = 252
		let height = 148

        let offw = this.g_off_w*255 ; // 偏移
        let offh = this.g_off_h*150;  

		shapgrid.graphics.moveTo(offw, offh);
		shapgrid.graphics.lineTo(offw, height+offh);
		shapgrid.graphics.moveTo(offw, height+offh);
		shapgrid.graphics.lineTo(width+offw, height+offh);
		shapgrid.graphics.moveTo(width+offw, height+offh);
		shapgrid.graphics.lineTo(width+offw, offh);
		shapgrid.graphics.moveTo(width+offw, offh);
		shapgrid.graphics.lineTo(offw, offh);


		for(let i = 19; i < (width); i = i + 19) {
			shapgrid.graphics.moveTo(i+offw , offh);
			shapgrid.graphics.lineTo(i+offw , height+offh);
		}

		for(let i = 19; i < (height); i = i + 19) {
			shapgrid.graphics.moveTo(offw, i+offh );
			shapgrid.graphics.lineTo(width+offw, i +offh);
		}


    }
}