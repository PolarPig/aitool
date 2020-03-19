// 8条线，做8个画笔，8个虚拟画笔
var DRAWECG =[]			// idx 1
var DRAWECGV1 = []		// idx 2
var DRAWECGV2 = []		// idx 3
var DRAWECGV3 = []		// idx 4
var DRAWBREATHE = []	// idx 5
var DRAWBLOOD = []		// idx 6
var DRAWBLOODV1 = []	// idx 7
var DRAWBLOODV2 = []	// idx 8

var DrawEcg = (function() {

	//私有方法，外面将访问不到
	var _random = function(that) {

	};

	//对外公开的构造函数
	var DrawEcgFun = function(config) {

	};
	
	var ALLCTXARR = []
	
	DrawEcgFun.prototype.init = function(config) { //初始化参数、方法
		this.config = config.canconfig
		this.drawconfig = config.drawconfig
		
		this.lowgirdvas = document.getElementById(this.config.lowgirdvas); //低格
		this.canvas = document.getElementById(this.config.canvas); //主画布
		this.canvasecg =  document.getElementById(this.drawconfig[0].ecg.canvasid);
		this.canvasecgv1 =  document.getElementById(this.drawconfig[0].ecgv1.canvasid);
		this.canvasecgv2 =  document.getElementById(this.drawconfig[0].ecgv2.canvasid);
		this.canvasecgv3 =  document.getElementById(this.drawconfig[0].ecgv3.canvasid);
		this.canvasbreathe =  document.getElementById(this.drawconfig[0].breathe.canvasid);
		this.canvasblood =  document.getElementById(this.drawconfig[0].blood.canvasid);
		this.canvasbloodv1 =  document.getElementById(this.drawconfig[0].blood2.canvasid);
		this.canvasbloodv2 =  document.getElementById(this.drawconfig[0].blood3.canvasid);
		
		
		
		this.timep = document.getElementById(this.config.timep)

		this.width = this.canvas.width
		this.height = this.canvas.height
		
		
		_initcanvas(this)
		
		console.log(this)
		
		
		
		console.log(this.drawconfig)
		
		
		return this;
	};
	
	
	
	DrawEcgFun.prototype.draw = function() { //渲染元素
		
		if ( this.lowgirdvas != undefined){
			// 画低格
			_drawGrid(this)
		}
		
		
		for(let i=0;i<this.drawconfig.length;i++){
			let drawcfg = this.drawconfig[i]
			dealdrawcfg(drawcfg,i,this)
		}
		
		return this;
	};
	
	//处理一个窗口数据
	var dealdrawcfg = function(drawcfg,i,that){
		console.log(drawcfg)
		let off_w = parseInt(i % 4)
		let off_h = parseInt(i / 4)

		let j =0
		for(key in drawcfg){
			let item = drawcfg[key]
			console.log(item)
			var ecgObj = {
				ecgdata:	item.datas, 
				idx:		item.idx,
				color:		item.color,
				speed:		item.speed,
				off_w:		off_w,
				off_h:		off_h,
				i:    		i,
				j:			j
			}
			_realData(ecgObj)
			j++
		}
		
		
		// 2.二级虚拟画布缓冲：  处理循环数组 写入到 虚拟内存画布
		// let memidx = setInterval(drawBufToCanMem, 40,that);
		setInterval(drawMemEcg, 40,that);
		setInterval(drawMemEcgv1, 40,that);
		setInterval(drawMemEcgv2, 40,that);
		setInterval(drawMemEcgv3, 40,that);
		setInterval(drawMembreathe, 40,that);
		setInterval(drawMemblood, 40,that);
		setInterval(drawMembloodv1, 40,that);
		setInterval(drawMembloodv2, 40,that);
	
		
		// 42毫秒人眼上限， 把虚拟内存画布 刷到 画布上
		setInterval(_copyDraw, 100,that);
		
		


	    
	    
	}

	//1.开始处理 x,y 坐标
	var _realData = function(that) {

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
		let g_sub_x = 0
		let g_sub_width = (width/750)*10
		
		// 数据是否取完标识
		let g_data_flag = true
	
		// 开启与暂停标识
		let g_start_stop_flag = 0
	
		
		// 1.一级buff缓冲： 处理数据进入到 循环数组 750个元素
		let bufidx = setInterval(dealArrayBuff, speed);

		let dataarr = new Array(755); 
		
		let begin=new Date();
		
		// 1. 处理数据到 buff 中 750 数组
		function dealArrayBuff(){
			let data = getData(ecgdata)
			if(data == undefined) {
				g_data_flag = false
				g_start_stop_flag = 2
				return dataarr
			}
			if ( idx == 1){
				idx
			}
			if ( g_start_stop_flag == 2){
				g_start_stop_flag = 1
			}
			
			g_data_flag = true
			
			if(g_sub_idx > 750) {
				if ( timep != undefined){
					let end=new Date();
					let time=end-begin;
					time = parseInt(time/1000)
					timep.innerText = time+"秒"
					begin = end;
				}
				g_sub_idx = 0
			}
			let x = (g_sub_idx * width) / 750 + off_w*390;
			let y = idx*25 - (data * 78) / 150 + off_h * 220;	
			
			let item = dataarr[g_sub_idx]
			if ( item == undefined){
				item = {}
			}
			item.x = x
			item.y = y
			dataarr[g_sub_idx] = item
			g_sub_x = x
			
			// 制造缺口
			for (let i = g_sub_idx+1; i < g_sub_idx+5; i++) {
				let next = dataarr[i]
				if ( next == undefined){
					next = {}
				}
				next.y = 0
				dataarr[i] =  next
			}
			
			if ( idx == 1){
				DRAWECG[that.i]= dataarr
			}else if ( idx == 2){
				DRAWECGV1[that.i]= dataarr
			}else if ( idx == 3){
				DRAWECGV2[that.i]= dataarr
			}else if ( idx == 4){
				DRAWECGV3[that.i]= dataarr
			}else if ( idx == 5){
				DRAWBREATHE[that.i]= dataarr
			}else if ( idx == 6){
				DRAWBLOOD[that.i]= dataarr
			}else if ( idx == 7){
				DRAWBLOODV1[that.i]= dataarr
			}else if ( idx == 8){
				DRAWBLOODV2[that.i]= dataarr
			}
			g_sub_idx++
		}
	
		function getData(ecgdata) {
			let data = ecgdata[g_idx]
			if ( data != undefined){
				g_idx++
			}
			return data
		}
		
	}


	
	var drawMemEcg = function(that){
		drawToMem(that.cbufctx,DRAWECG,that.drawconfig[0].ecg.color);
	}
	
	var drawMemEcgv1 = function(that){
		drawToMem(that.cbufctxV1,DRAWECGV1,that.drawconfig[0].ecgv1.color);
	}
	
	var drawMemEcgv2= function(that){
		drawToMem(that.cbufctxV2,DRAWECGV2,that.drawconfig[0].ecgv2.color);
	}
	
	var drawMemEcgv3= function(that){
		drawToMem(that.cbufctxV3,DRAWECGV3,that.drawconfig[0].ecgv3.color);
	}
	
	var drawMembreathe= function(that){
		drawToMem(that.breathectx,DRAWBREATHE,that.drawconfig[0].breathe.color);
	}
	
	var drawMemblood= function(that){
		drawToMem(that.bloodctx,DRAWBLOOD,that.drawconfig[0].blood.color);
	}
	var drawMembloodv1= function(that){
		drawToMem(that.blood2ctx,DRAWBLOODV1,that.drawconfig[0].blood2.color);
	}
	var drawMembloodv2= function(that){
		drawToMem(that.blood3ctx,DRAWBLOODV2,that.drawconfig[0].blood3.color);
	}
	//2.开始画到虚拟canvas 
	var drawBufToCanMem = function(that){

	}
	
	var drawToMem = function(cbufctx,allarr,color){
		
		cbufctx.beginPath();
		cbufctx.lineWidth = 1;
		cbufctx.strokeStyle = color;
		
		for(let i =0;i< allarr.length;i++){
			let dataarr = allarr[i]
			if ( dataarr.length == 0){
				continue
			}

			
			let flag = true
			for(let j=0;j<dataarr.length;j++){
				let item = dataarr[j]
				if(item != undefined && item.y != undefined){
					if ( item.y ==0){
						flag = true
					}else if ( item.y != 0){
						if ( flag){
							cbufctx.moveTo(item.x, item.y);
							flag = false
						}
						cbufctx.lineTo(item.x, item.y);
					}
				}
			}
		}
	}
	
	//3.开始把虚拟canvas 画到 canvas
	var _copyDraw = function(that){
		
		_copyD(that.cbufctx,that.ctxecg,that.bufCanvas,that.width,that.height)
		_copyD(that.cbufctxV1,that.ctxecgv1,that.bufCanvasV1,that.width,that.height)
		_copyD(that.cbufctxV2,that.ctxecgv2,that.bufCanvasV2,that.width,that.height)
		_copyD(that.cbufctxV3,that.ctxecgv3,that.bufCanvasV3,that.width,that.height)
		_copyD(that.breathectx,that.ctxbreathe,that.breathe,that.width,that.height)
		_copyD(that.bloodctx,that.ctxblood,that.blood,that.width,that.height)
		_copyD(that.blood2ctx,that.ctxbloodv1,that.blood2,that.width,that.height)
		_copyD(that.blood3ctx,that.ctxbloodv2,that.blood3,that.width,that.height)
		
//		that.cbufctx.stroke(); // ---bufCanvas
//		that.cbufctxV1.stroke();// ---bufCanvasV1
//		that.cbufctxV2.stroke(); // --bufCanvasV2
//		that.cbufctxV3.stroke(); // --bufCanvasV3
//		that.breathectx.stroke();// --breathe
//		that.bloodctx.stroke();// --blood
//		that.blood2ctx.stroke();// --blood2
//		that.blood3ctx.stroke();// --blood3
//		
//		
//		that.blood2ctx.drawImage(that.blood3,0,0);
//		that.bloodctx.drawImage(that.blood2,0,0);
//		that.breathectx.drawImage(that.blood,0,0);
//		that.cbufctxV3.drawImage(that.breathe,0,0);
//		that.cbufctxV2.drawImage(that.bufCanvasV3,0,0);
//		that.cbufctxV1.drawImage(that.bufCanvasV2,0,0);
//		that.cbufctx.drawImage(that.bufCanvasV1,0,0);
//		
//		that.ctxq.globalCompositeOperation="destination-atop";
//		that.ctxq.drawImage(that.bufCanvas, 0, 0);
//		
//		that.cbufctx.clearRect(0,0,that.width,that.height)
//		that.cbufctxV1.clearRect(0,0,that.width,that.height)
//		that.cbufctxV2.clearRect(0,0,that.width,that.height)
//		that.cbufctxV3.clearRect(0,0,that.width,that.height)
//		that.breathectx.clearRect(0,0,that.width,that.height)
//		that.bloodctx.clearRect(0,0,that.width,that.height)
//		that.blood2ctx.clearRect(0,0,that.width,that.height)
//		that.blood3ctx.clearRect(0,0,that.width,that.height)
		

	}

	var _copyD = function(cbufctx,ctxq,cbuf,width,height){
		cbufctx.stroke(); // ---bufCanvas
		ctxq.drawImage(cbuf, 0, 0);
		cbufctx.clearRect(0,0,width,height)
	}
	
	var _initcanvas = function(that){
		

		for(let i=0;i<40;i++){
			DRAWECG[i] = []
			DRAWECGV1[i] = []
			DRAWECGV2[i] = []
			DRAWECGV3[i] = []
			DRAWBREATHE[i] = []
			DRAWBLOOD[i] = []
			DRAWBLOODV1[i] = []
			DRAWBLOODV2[i] = []
		}

		
		//心电波画笔
		that.ctxq = that.canvas.getContext('2d');
		that.ctxecg = that.canvasecg.getContext('2d');
		that.ctxecgv1 = that.canvasecgv1.getContext('2d');
		that.ctxecgv2 = that.canvasecgv2.getContext('2d');
		that.ctxecgv3 = that.canvasecgv3.getContext('2d');
		that.ctxbreathe = that.canvasbreathe.getContext('2d');
		that.ctxblood = that.canvasblood.getContext('2d');
		that.ctxbloodv1 = that.canvasbloodv1.getContext('2d');
		that.ctxbloodv2 = that.canvasbloodv2.getContext('2d');
		

		//创建虚拟canvas  单导 
		that.bufCanvas = _createVirtualCanvas(that.width, that.height)
		// 缓存画笔             单导 
		that.cbufctx = that.bufCanvas.getContext("2d");
		
		//创建虚拟canvas  单导 v1
		that.bufCanvasV1 = _createVirtualCanvas(that.width, that.height)
		// 缓存画笔             单导 v1
		that.cbufctxV1 = that.bufCanvasV1.getContext("2d");
		
		//创建虚拟canvas  单导 v2
		that.bufCanvasV2 = _createVirtualCanvas(that.width, that.height)
		// 缓存画笔             单导 v2
		that.cbufctxV2 = that.bufCanvasV2.getContext("2d");
		
		//创建虚拟canvas  单导 v3
		that.bufCanvasV3 = _createVirtualCanvas(that.width, that.height)
		// 缓存画笔             单导 v3
		that.cbufctxV3 = that.bufCanvasV3.getContext("2d");
		
		//创建虚拟canvas  呼吸
		that.breathe = _createVirtualCanvas(that.width, that.height)
		// 缓存画笔              呼吸
		that.breathectx = that.breathe.getContext("2d");
		
		//创建虚拟canvas  血养
		that.blood = _createVirtualCanvas(that.width, that.height)
		// 缓存画笔              血养
		that.bloodctx = that.blood.getContext("2d");
		
		//创建虚拟canvas  血养2
		that.blood2 = _createVirtualCanvas(that.width, that.height)
		// 缓存画笔              血养2
		that.blood2ctx = that.blood2.getContext("2d");
		
		//创建虚拟canvas  血养3
		that.blood3 = _createVirtualCanvas(that.width, that.height)
		// 缓存画笔              血养2
		that.blood3ctx = that.blood3.getContext("2d");
		
	}

	// 创建个虚拟画布
	var _createVirtualCanvas = function(width, height) {
		// 缓存
		let bufCanvas = document.createElement("canvas");
		bufCanvas.width = width;
		bufCanvas.height = height;
		return bufCanvas
	}

	// 画低格
	var _drawGrid = function(that) {

		//低格画笔
		let ctx = that.lowgirdvas.getContext('2d');
		let width = that.lowgirdvas.width
		let height = that.lowgirdvas.height
		// 填充背景颜色
		ctx.fillStyle = "#242833";
		ctx.fillRect(0, 0, width, height);

		// 绿色矩形
		ctx.beginPath();
		//线的粗细
		ctx.lineWidth = "1";

		ctx.strokeStyle = "#303641"; //#5D4332"
		ctx.moveTo(0, 0);
		ctx.lineTo(0.5, height);
		ctx.moveTo(0.5, height);
		ctx.lineTo(width, height);
		ctx.moveTo(width, height);
		ctx.lineTo(width, 0.5);
		ctx.moveTo(width, 0.5);
		ctx.lineTo(0.5, 0.5);

		for(let i = 19; i < (width); i = i + 19) {
			ctx.moveTo(0.5, i - 0.5);
			ctx.lineTo(width, i - 0.5);
		}

		for(let i = 19; i < (width); i = i + 19) {
			ctx.moveTo(i - 0.5, 0.5);
			ctx.lineTo(i - 0.5, width);
		}
		ctx.stroke();
	}

	//返回构造函数
	return DrawEcgFun;
}());


