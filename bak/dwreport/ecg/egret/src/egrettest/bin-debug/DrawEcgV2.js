// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DrawEcgV2 = (function () {
    /**
     * shape 画笔
     * datas 数据
     * g_idx 第几行
     * speed 速度
     */
    function DrawEcgV2(datas, idx, speed, g_off_w, g_off_h, datasarr) {
        this.g_idx = 1; //第几行
        this.g_data_idx = 0;
        this.gap = 3;
        this.index = 0;
        this.datas = [];
        this.datasarr = [];
        // 速度
        this.speed = 4;
        // 第几列 默认第 0 列表
        this.g_off_w = 0;
        // 第几行 默认第 0 行 
        this.g_off_h = 0;
        this.datas = datas;
        this.g_idx = idx;
        this.speed = speed;
        this.g_off_w = g_off_w;
        this.g_off_h = g_off_h;
        this.datasarr = datasarr;
    }
    DrawEcgV2.prototype.startDraw = function () {
        this.datas = new EcgData().getEcgData(1);
        this.timerdata = new egret.Timer(this.speed, 0);
        this.timerdata.addEventListener(egret.TimerEvent.TIMER, this.timerDataFunc, this);
        this.timerdata.start();
    };
    DrawEcgV2.prototype.timerDataFunc = function () {
        var data = this.datas[this.g_data_idx];
        if (data == undefined) {
            return;
        }
        this.g_data_idx++;
        if (this.index > 750) {
            this.index = 0;
        }
        var x = (this.index * 375) / 750 + this.g_off_w * 375;
        var y = (this.g_idx + 1) * 25 - (Number(data) * 76) / 100 + this.g_off_h * 220;
        var item = {
            x: x,
            y: y
        };
        this.datasarr[this.g_idx - 1][this.index] = item;
        // 制造缺口
        for (var i = this.index + 1; i < this.index + 5; i++) {
            var next = this.datasarr[this.g_idx - 1][i];
            if (next == undefined) {
                next = {};
            }
            next.y = 0;
            this.datasarr[this.g_idx - 1][i] = next;
        }
        this.index++;
    };
    return DrawEcgV2;
}());
__reflect(DrawEcgV2.prototype, "DrawEcgV2");
//# sourceMappingURL=DrawEcgV2.js.map