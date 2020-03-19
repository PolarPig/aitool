// TypeScript file

class DrawGridv2 {

  private _shapgrid: egret.Shape;


  constructor(shape) {
    this._shapgrid = shape
  }

  //画低格
  public ecgDrawGrid(): void {

    let shapgrid = this._shapgrid

    shapgrid.graphics.lineStyle(1, 0x303641);

    let width = 1536
    let height = 2250


    shapgrid.graphics.moveTo(0, 0);
    shapgrid.graphics.lineTo(0, height);
    shapgrid.graphics.moveTo(0, height);
    shapgrid.graphics.lineTo(width, height);
    shapgrid.graphics.moveTo(width, height);
    shapgrid.graphics.lineTo(width, 0);
    shapgrid.graphics.moveTo(width, 0);
    shapgrid.graphics.lineTo(0, 0);


    let idx = 0
    for (let i = 19; i < (width); i = i + 19) {
      shapgrid.graphics.moveTo(i, 0);
      shapgrid.graphics.lineTo(i, height);
    }

    for (let i = 19; i < (height); i = i + 19) {
      shapgrid.graphics.moveTo(0, i);
      shapgrid.graphics.lineTo(width, i);
    }

    shapgrid.graphics.lineStyle(3, 0xFFFFFF);

    for (let i = 1; i < 5; i++) {
      shapgrid.graphics.moveTo(i * 387, 0);
      shapgrid.graphics.lineTo(i * 387, height);
    }

    for (let i = 1; i < 10; i++) {
      shapgrid.graphics.moveTo(0, i * 220);
      shapgrid.graphics.lineTo(width, i * 220);
    }


  }
}