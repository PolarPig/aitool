var DrawEcg = (function() {

	//私有方法，外面将访问不到
	var _random = function(that) {

	};

	//对外公开的构造函数
	var DrawEcgFun = function(config) {

	};

	DrawEcgFun.prototype.init = function(config) { //初始化参数、方法
		this.lowgirdvas = document.getElementById(config.lowgirdvas); //低格
		this.canvas = document.getElementById(config.canvas); //主画布
		this.timep = document.getElementById(config.timep)
		this.ecgdata = config.datas;      // 单导 
 		this.ecgmudata = config.ecgmudata;// 单导 v1
		this.idx = config.idx;// 第几行
		this.color = config.color;//线颜色
		this.speed = config.speed;//速度 

		return this;
	};

	DrawEcgFun.prototype.draw = function() { //渲染元素
		console.log("draw")
		console.log(this)
		
		if ( this.lowgirdvas != undefined){
			// 画低格
			_drawGrid(this)
		}
		
		
		//心电波画笔
		this.ctxq = this.canvas.getContext('2d');

		this.width = this.canvas.width
		this.height = this.canvas.height



		//创建虚拟canvas  单导 
		this.bufCanvas = _createVirtualCanvas(this.width, this.height)
		// 缓存画笔             单导 
		this.cbufctx = this.bufCanvas.getContext("2d");

		//创建虚拟canvas  单导 v1
		this.bufCanvasV1 = _createVirtualCanvas(this.width, this.height)
		// 缓存画笔             单导 v1
		this.cbufctxV1 = this.bufCanvasV1.getContext("2d");

		var ecgObj = {
			width:		this.width,
			height:		this.height,
			ctxq:		this.ctxq,
			cbufctx:	this.cbufctx,
			bufCanvas:	this.bufCanvas,
			ecgdata:	this.ecgdata,
			idx:		1,
			color:		this.color,
			speed:		this.speed
		}
		//开始画 单导
		_realDraw(ecgObj)
		
		var ecgObjV1 = {
			width:		this.width,
			height:		this.height,
			ctxq:		this.ctxq,
			cbufctx:	this.cbufctxV1,
			bufCanvas:	this.bufCanvasV1,
			ecgdata:	this.ecgmudata,
			idx:		2,
			color:		this.color,
			speed:		this.speed
		}
		//开始画 单导 V1
		_realDraw(ecgObjV1)
		
		
	};

	//开始画
	var _realDraw = function(that) {

		let width = that.width 			//宽
		let height = that.height		//高
		let ctxq = that.ctxq    		//画布 画笔
		let cbufctx = that.cbufctx		//虚拟画布 画笔
		let bufCanvas = that.bufCanvas	//虚拟画布
		let ecgdata = that.ecgdata		//数据
		let idx = that.idx				//第几行
		let color = that.color			//线颜色
		let speed = that.speed			//速度
		
		cbufctx.beginPath();
		cbufctx.lineWidth = 1;
		cbufctx.strokeStyle = color;

		ctxq.beginPath();
		ctxq.lineWidth = 1;
		ctxq.strokeStyle = color;
		
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
		// 2.二级虚拟画布缓冲：  处理循环数组 写入到 虚拟内存画布
		let memidx = setInterval(drawBufToCanMem, 40);
		// 3.三级实时画布：  42毫秒人眼上限， 把虚拟内存画布 刷到 画布上
	    let drawidx = setInterval(drawCanvas, 42);
	    
		let dataarr = new Array(755); 
		
		let begin=new Date();
		
		// 1. 处理数据到 buff 中 750 数组
		function dealArrayBuff(){
			let data = getData(ecgdata)
			if(data == undefined) {
				g_data_flag = false
				g_start_stop_flag = 2
				return
			}
			
			if ( g_start_stop_flag == 2){
				g_start_stop_flag = 1
				memidx = setInterval(drawBufToCanMem, 40);
				drawidx = setInterval(drawCanvas, 42);
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
			let x = (g_sub_idx * width) / 750;
			let y = idx*25 - (data * 9.5) / 100;	
			
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
			
			
			g_sub_idx++
		}
	
		function drawBufToCanMem(){
			if(!g_data_flag) {
				if ( g_start_stop_flag == 2){
					clearInterval(memidx );
				}
				return
			}
			
			let flag = true
			cbufctx.beginPath();
			for (let i = 0; i < dataarr.length; i++) {
				let item = dataarr[i]
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
		
		
		function drawCanvas(){
			if(!g_data_flag) {
				if ( g_start_stop_flag == 2){
					clearInterval(drawidx );
				}
				return
			}
			cbufctx.stroke();
//			ctxq.clearRect(0,0,width,height)
			ctxq.globalCompositeOperation="destination-atop";
//			ctxq.globalCompositeOperation="source-in";
			ctxq.drawImage(bufCanvas, 0, 0, width, height,0, 0, width, height);
			cbufctx.clearRect(0,0,width,height)
		}
		
		function getData(ecgdata) {
			let data = ecgdata[g_idx]
			if ( data != undefined){
				g_idx++
			}
			return data
		}
		
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

//$(function() {
//  new DrawEcg().init({lowgirdvas:'#lowgird',canvas:"#ecg",datas:datas}).draw();
//});



