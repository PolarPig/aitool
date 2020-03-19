// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DrawEcg = (function () {
    /**
     * shape 画笔
     * datas 数据
     * g_idx 第几行
     * speed 速度
     */
    function DrawEcg(shape, datas, idx, speed, g_off_h, g_off_w) {
        this.g_sub_idx = 0;
        this.g_idx = 1; //第几行
        this.g_data_idx = 0;
        this.bufidx = 0; //buf 定时器
        this.memidx = 0; //虚拟画布定时器
        this.drawidx = 0; //画布定时器
        // 数据是否取完标识
        this.g_data_flag = true;
        // 开启与暂停标识
        this.g_start_stop_flag = 0;
        // 画图数据
        this.dataarr = [755];
        this.datas = [];
        // 速度
        this.speed = 4;
        // 颜色
        this.color = 0x32FF32;
        // 是否画低格 0 画
        this.gridflag = 0;
        // 第几列 默认第 0 列表
        this.g_off_w = 0;
        // 第几行 默认第 0 行 
        this.g_off_h = 0;
        this._shape = shape;
        this.datas = datas;
        this.g_idx = idx;
        this.speed = speed;
        this.g_off_w = g_off_w;
        this.g_off_h = g_off_h;
    }
    //初始化赋值
    DrawEcg.prototype.ecgDraw = function () {
        var shape = this._shape;
        if (this.g_idx == 1) {
            //画低格
            this.ecgDrawGrid();
        }
        if (this.g_idx == 1) {
            shape.graphics.lineStyle(1, 0x32FF32);
        }
        else if (this.g_idx == 2) {
            shape.graphics.lineStyle(1, 0xFFA500);
        }
        else if (this.g_idx == 3) {
            shape.graphics.lineStyle(1, 0xFF4500);
        }
        else if (this.g_idx == 4) {
            shape.graphics.lineStyle(1, 0xFFFF00);
        }
        this.bufidx = setInterval(this.dealArrayBuff, this.speed, this);
        // this.memidx = setInterval(this.drawBufToCanMem, 40,this);
        this.drawidx = setInterval(this.drawCanvas, 100, this);
    };
    DrawEcg.prototype.dealArrayBuff = function (that) {
        var data = that.getData();
        if (data == undefined) {
            that.g_data_flag = false;
            that.g_start_stop_flag = 2;
            return;
        }
        if (that.g_start_stop_flag == 2) {
            that.g_start_stop_flag = 1;
            // that.memidx = setInterval(that.drawBufToCanMem, 40);
            that.drawidx = setInterval(that.drawCanvas, 100);
        }
        that.g_data_flag = true;
        if (that.g_sub_idx > 750) {
            that.g_sub_idx = 0;
        }
        var x = (that.g_sub_idx * 252) / 750;
        var y = that.g_idx * 25 - (Number(data) * 76) / 100;
        x = x + 255 * that.g_off_w;
        y = y + 150 * that.g_off_h;
        var item = that.dataarr[that.g_sub_idx];
        if (item == undefined) {
            item = {};
        }
        item.x = x;
        item.y = y;
        that.dataarr[that.g_sub_idx] = item;
        // 制造缺口
        for (var i = that.g_sub_idx + 1; i < that.g_sub_idx + 5; i++) {
            var next = that.dataarr[i];
            if (next == undefined) {
                next = {};
            }
            next.y = 0;
            that.dataarr[i] = next;
        }
        that.g_sub_idx++;
    };
    DrawEcg.prototype.drawCanvas = function (that) {
        var shape = that._shape;
        shape.graphics.clear();
        if (that.g_idx == 1) {
            //画低格
            that.ecgDrawGrid();
        }
        if (that.g_idx == 1) {
            shape.graphics.lineStyle(1, 0x32FF32);
        }
        else if (that.g_idx == 2) {
            shape.graphics.lineStyle(1, 0xFFA500);
        }
        else if (that.g_idx == 3) {
            shape.graphics.lineStyle(1, 0xFF4500);
        }
        else if (that.g_idx == 4) {
            shape.graphics.lineStyle(1, 0xFFFF00);
        }
        if (!that.g_data_flag) {
            if (that.g_start_stop_flag == 2) {
                clearInterval(that.drawidx);
            }
            return;
        }
        var flag = true;
        for (var i = 0; i < that.dataarr.length; i++) {
            var item = that.dataarr[i];
            if (item != undefined && item.y != undefined) {
                if (item.y == 0) {
                    flag = true;
                }
                else if (item.y != 0) {
                    if (flag) {
                        shape.graphics.moveTo(item.x, item.y);
                        flag = false;
                    }
                    shape.graphics.lineTo(item.x, item.y);
                }
            }
        }
    };
    DrawEcg.prototype.getData = function () {
        var value = this.datas[this.g_data_idx];
        if (value == undefined) {
            return value;
        }
        this.g_data_idx++;
        return value;
    };
    DrawEcg.prototype.ecgDrawGrid = function () {
        var shapgrid = this._shape;
        shapgrid.graphics.lineStyle(1, 0x303641);
        var width = 252;
        var height = 148;
        var offw = this.g_off_w * 255; // 偏移
        var offh = this.g_off_h * 150;
        shapgrid.graphics.moveTo(offw, offh);
        shapgrid.graphics.lineTo(offw, height + offh);
        shapgrid.graphics.moveTo(offw, height + offh);
        shapgrid.graphics.lineTo(width + offw, height + offh);
        shapgrid.graphics.moveTo(width + offw, height + offh);
        shapgrid.graphics.lineTo(width + offw, offh);
        shapgrid.graphics.moveTo(width + offw, offh);
        shapgrid.graphics.lineTo(offw, offh);
        for (var i = 19; i < (width); i = i + 19) {
            shapgrid.graphics.moveTo(i + offw, offh);
            shapgrid.graphics.lineTo(i + offw, height + offh);
        }
        for (var i = 19; i < (height); i = i + 19) {
            shapgrid.graphics.moveTo(offw, i + offh);
            shapgrid.graphics.lineTo(width + offw, i + offh);
        }
    };
    return DrawEcg;
}());
__reflect(DrawEcg.prototype, "DrawEcg");
//# sourceMappingURL=DrawEcg.js.map