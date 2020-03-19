// TypeScript file

class Dg {

  public _shape: egret.Shape;
  private g_sub_idx = 0;
  private g_idx = 1;//第几行
  private g_data_idx = 0;

  private bufidx = 0;//buf 定时器
  private memidx = 0;//虚拟画布定时器
  private drawidx = 0;//画布定时器

  // 数据是否取完标识
  private g_data_flag = true;

  // 开启与暂停标识
  private g_start_stop_flag = 0;

  // 画图数据
  private dataarr = [755]

  private datas = []

  // 速度
  private speed = 4;
  // 颜色
  private color = 0x32FF32

  // 是否画低格 0 画
  private gridflag = 0;

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
  constructor(shape, datas, idx, speed, g_off_h, g_off_w) {
    this._shape = shape
    this.datas = datas
    this.g_idx = idx
    this.speed = speed;
    this.g_off_w = g_off_w;
    this.g_off_h = g_off_h;

    this.bufidx = setInterval(this.dealArrayBuff, this.speed, this);

  }



  //初始化赋值
  public ecgDraw(): void {

    var shape: egret.Shape = this._shape;

    if (this.g_idx == 1) {
      //画低格
      this.ecgDrawGrid();
    }


    if (this.g_idx == 1) {
      shape.graphics.lineStyle(1, 0x32FF32);
    } else if (this.g_idx == 2) {
      shape.graphics.lineStyle(1, 0xFFA500);
    } else if (this.g_idx == 3) {
      shape.graphics.lineStyle(1, 0xFF4500);
    } else if (this.g_idx == 4) {
      shape.graphics.lineStyle(1, 0xFFFF00);
    }


    this.drawCanvas(this)


  }

  private dealArrayBuff(that): void {
    let data = that.getData()
    if (data == undefined) {
      that.g_data_flag = false
      that.g_start_stop_flag = 2
      return
    }

    if (that.g_start_stop_flag == 2) {
      that.g_start_stop_flag = 1
      // that.memidx = setInterval(that.drawBufToCanMem, 40);
      that.drawidx = setInterval(that.drawCanvas, 100);
    }

    that.g_data_flag = true

    if (that.g_sub_idx > 750) {
      that.g_sub_idx = 0
    }

    let x = (that.g_sub_idx * 252) / 750;
    let y = that.g_idx * 25 - (Number(data) * 76) / 100;

    x = x + 255 * that.g_off_w;

    y = y + 150 * that.g_off_h;

    let item = that.dataarr[that.g_sub_idx]
    if (item == undefined) {
      item = {}
    }
    item.x = x

    item.y = y
    that.dataarr[that.g_sub_idx] = item

    // 制造缺口
    for (let i = that.g_sub_idx + 1; i < that.g_sub_idx + 5; i++) {
      let next = that.dataarr[i]
      if (next == undefined) {
        next = {}
      }
      next.y = 0
      that.dataarr[i] = next
    }

    that.g_sub_idx++

  }



  private drawCanvas(that): void {
    var shape: egret.Shape = that._shape;

    shape.graphics.clear()

    if (that.g_idx == 1) {
      //画低格
      that.ecgDrawGrid();
    }

    if (that.g_idx == 1) {
      shape.graphics.lineStyle(1, 0x32FF32);
    } else if (that.g_idx == 2) {
      shape.graphics.lineStyle(1, 0xFFA500);
    } else if (that.g_idx == 3) {
      shape.graphics.lineStyle(1, 0xFF4500);
    } else if (that.g_idx == 4) {
      shape.graphics.lineStyle(1, 0xFFFF00);
    }


    if (!that.g_data_flag) {
      if (that.g_start_stop_flag == 2) {
        clearInterval(that.drawidx);
      }
      return
    }

    let flag = true

    for (let i = 0; i < that.dataarr.length; i++) {
      let item = that.dataarr[i]
      if (item != undefined && item.y != undefined) {
        if (item.y == 0) {
          flag = true
        } else if (item.y != 0) {
          if (flag) {
            shape.graphics.moveTo(item.x, item.y);
            flag = false
          }
          shape.graphics.lineTo(item.x, item.y);
        }
      }

    }


  }



  private getData(): Number {

    let value = this.datas[this.g_data_idx]
    if (value == undefined) {
      return value
    }

    this.g_data_idx++

    return value
  }


  private ecgDrawGrid(): void {
    var shapgrid: egret.Shape = this._shape

    shapgrid.graphics.lineStyle(1, 0x303641);

    let width = 252
    let height = 148

    let offw = this.g_off_w * 255; // 偏移
    let offh = this.g_off_h * 150;

    shapgrid.graphics.moveTo(offw, offh);
    shapgrid.graphics.lineTo(offw, height + offh);
    shapgrid.graphics.moveTo(offw, height + offh);
    shapgrid.graphics.lineTo(width + offw, height + offh);
    shapgrid.graphics.moveTo(width + offw, height + offh);
    shapgrid.graphics.lineTo(width + offw, offh);
    shapgrid.graphics.moveTo(width + offw, offh);
    shapgrid.graphics.lineTo(offw, offh);


    for (let i = 19; i < (width); i = i + 19) {
      shapgrid.graphics.moveTo(i + offw, offh);
      shapgrid.graphics.lineTo(i + offw, height + offh);
    }

    for (let i = 19; i < (height); i = i + 19) {
      shapgrid.graphics.moveTo(offw, i + offh);
      shapgrid.graphics.lineTo(width + offw, i + offh);
    }


  }



}