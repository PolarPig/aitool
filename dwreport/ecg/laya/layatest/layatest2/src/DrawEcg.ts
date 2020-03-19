
import Sprite = Laya.Sprite;
import Stage = Laya.Stage;
import WebGL = Laya.WebGL;
import EcgData from "./EcgData";
var DRAWECG = []			// idx 1
var DRAWECGDATAARR = [1505]
var DRAWECGDATAARRV1 = [1505]
var DRAWECGDATAARRV2 = [1505]
var DRAWECGDATAARRV3 = [1505]
export default class DrawEcg {
    private sp: Sprite;
    private datas
    private datas1
    private datas2
    private datas3
    private g_data_idx = 0




    constructor() {
        Laya.init(1130, 2200, WebGL);
        this.drawSomething();
    }
    private drawSomething(): void {
        this.sp = new Sprite();
        Laya.stage.addChild(this.sp);

        //画折线
        // this.sp.graphics.drawLines(20, 88, [0, 0, 39, -50, 78, 0, 120, -50], "#ff0000", 1);

        this.datas = new EcgData().getEcgData(1)
        this.datas1 = new EcgData().getEcgData(1)
        this.datas2 = new EcgData().getEcgData(1)
        this.datas3 = new EcgData().getEcgData(1)

        this.initdata()

        let obj = {
            canconfig: {
                canvas: "ecg",
                lowgirdvas: 'lowgird',
                timep: "timep"
            },
            drawconfig: [{
                // 单导 
                ecg:  { datas: this.datas, idx: 1, color: "#32FF32", speed: 4, canvasid: "ecg" },
                // 单导 v1
                ecgv1: { datas: this.datas3, idx: 2, color: "red", speed: 10, canvasid: "ecgv1" },
                // 单导 v2
                ecgv2: { datas: this.datas, idx: 3, color: "yellow", speed: 11, canvasid: "ecgv2" },
                // 单导 v3
                ecgv3: { datas: this.datas3, idx: 4, color: "#F08080", speed: 4, canvasid: "ecgv3" },
                // 呼吸
                breathe: { datas: this.datas, idx: 5, color: "#7CFC00", speed: 60, canvasid: "breathe" },
                // 血养
                blood: { datas: this.datas3, idx: 6, color: "#FF8C00", speed: 15, canvasid: "blood" },
                // 血养
                blood2: { datas: this.datas, idx: 7, color: "#FFD700", speed: 5, canvasid: "bloodv1" },
                // 血养
                blood3: { datas: this.datas3, idx: 8, color: "#FF8C00", speed: 10, canvasid: "bloodv2" },
            }]
        }

        this.init(obj)

        var time = new Laya.Timer(true)
        time.loop(42, this, this.drawecg,[this.sp])


        let spv1 =   new Sprite();
        Laya.stage.addChild(spv1);
        var time2 = new Laya.Timer(true)
        time2.loop(42, this, this.drawecgv1,[spv1])
        
    }

    private drawecg(sp){
        sp.graphics.drawLines(0, 0, DRAWECGDATAARR, "#ff0000", 1);
    }

    private drawecgv1(sp){
    

        sp.graphics.drawLines(0, 0, DRAWECGDATAARRV1, "#ff0000", 1);

    }




    private init(config) {
        let drawconfig = config.drawconfig
        for (let i = 0; i < drawconfig.length; i++) {
            let drawcfg = drawconfig[i]
            this.dealdrawcfg(drawcfg, i, this)
        }

    }

    //处理一个窗口数据
    private dealdrawcfg(drawcfg, i, that) {
        console.log(drawcfg)
        let off_w = i % 4
        let off_h = i / 4

        let j = 0
        for (let key in drawcfg) {
            let item = drawcfg[key]
            console.log(item)
            var ecgObj = {
                ecgdata: item.datas,
                idx: item.idx,
                color: item.color,
                speed: item.speed,
                off_w: off_w,
                off_h: off_h,
                i: i,
                j: j
            }
            this._realData(ecgObj)
            j++
        }


    }

    private _realData(that) {

        let width = 375;//that.width 			//宽
        let height = 220;//that.height		//高
        let ecgdata = that.ecgdata		//数据
        let idx = that.idx				//第几行
        let speed = that.speed			//速度

        let off_w = that.off_w
        let off_h = that.off_h

        // 全局 数据下标
        let g_idx = 0
        // 每画完一组3秒数据 750个点,重新计算
        let g_sub_idx = 0
        let g_sub_index = 0
        let g_sub_x = 0
        let g_sub_width = (width / 750) * 10

        // 数据是否取完标识
        let g_data_flag = true

        // 开启与暂停标识
        let g_start_stop_flag = 0


        var time = new Laya.Timer(true)
        time.loop(4, this, dealData)

        let dataarr = new Array(755);

        let begin = new Date();

        function dealData() {
            let data = getData(ecgdata)
            if (data == undefined) {
                g_data_flag = false
                g_start_stop_flag = 2
                return 
            }

            if (g_start_stop_flag == 2) {
                g_start_stop_flag = 1
            }

            g_data_flag = true

            if (g_sub_idx > 1500) {
                g_sub_idx = 0
                g_sub_index = 0
            }

            let x = (g_sub_index * width) / 750 + off_w * 390;
            let y = idx * 25 - (data * 78) / 150 + off_h * 220;

            if (idx == 1) {
                DRAWECGDATAARR[g_sub_idx] = x
                DRAWECGDATAARR[g_sub_idx+1] = y
            }else if ( idx == 2){
                DRAWECGDATAARRV1[g_sub_idx] = x
                DRAWECGDATAARRV1[g_sub_idx+1] = y
            }

            g_sub_idx = g_sub_idx+2
            g_sub_index++

        }

        function getData(ecgdata) {
            let data = ecgdata[g_idx]
            if (data != undefined) {
                g_idx++
            }
            return data
        }

    }



    private initdata() {
        for (let i = 0; i < 40; i++) {
            DRAWECG[i] = []
            //
        }
    }

}
