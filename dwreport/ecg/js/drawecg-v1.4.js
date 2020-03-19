var DrawEcg = (function() {

	//私有方法，外面将访问不到
	var _random = function(that) {

	};

	//对外公开的构造函数
	var DrawEcgFun = function(config) {

	};
	
	var ALLCTXARR = []

	DrawEcgFun.prototype.init = function(config) { //初始化参数、方法
		this.config = config
		
		this.lowgirdvas = document.getElementById(this.config.ecg.lowgirdvas); //低格
		this.canvas = document.getElementById(this.config.ecg.canvas); //主画布
		this.timep = document.getElementById(this.config.ecg.timep)

		this.width = this.canvas.width
		this.height = this.canvas.height
		
		let item = inititem(this,0,0);
		ALLCTXARR.push(item)

		item = inititem(this,0,1);
		ALLCTXARR.push(item)
		
		item = inititem(this,0,2);
		ALLCTXARR.push(item)
		
		item = inititem(this,0,3);
		ALLCTXARR.push(item)
		
		//心电波画笔
		this.ctxq = this.canvas.getContext('2d');

		//创建虚拟canvas  单导 
		this.bufCanvas = _createVirtualCanvas(this.width, this.height)
		// 缓存画笔             单导 
		this.cbufctx = this.bufCanvas.getContext("2d");


		//创建虚拟canvas  单导 v1
		this.bufCanvasV1 = _createVirtualCanvas(this.width, this.height)
		// 缓存画笔             单导 v1
		this.cbufctxV1 = this.bufCanvasV1.getContext("2d");
		
		//创建虚拟canvas  单导 v2
		this.bufCanvasV2 = _createVirtualCanvas(this.width, this.height)
		// 缓存画笔             单导 v2
		this.cbufctxV2 = this.bufCanvasV2.getContext("2d");
		
		//创建虚拟canvas  单导 v3
		this.bufCanvasV3 = _createVirtualCanvas(this.width, this.height)
		// 缓存画笔             单导 v3
		this.cbufctxV3 = this.bufCanvasV3.getContext("2d");
		
		//创建虚拟canvas  呼吸
		this.breathe = _createVirtualCanvas(this.width, this.height)
		// 缓存画笔              呼吸
		this.breathectx = this.breathe.getContext("2d");
		
		//创建虚拟canvas  血养
		this.blood = _createVirtualCanvas(this.width, this.height)
		// 缓存画笔              血养
		this.bloodctx = this.blood.getContext("2d");
		
		//创建虚拟canvas  血养2
		this.blood2 = _createVirtualCanvas(this.width, this.height)
		// 缓存画笔              血养2
		this.blood2ctx = this.blood2.getContext("2d");
		
		//创建虚拟canvas  血养3
		this.blood3 = _createVirtualCanvas(this.width, this.height)
		// 缓存画笔              血养2
		this.blood3ctx = this.blood3.getContext("2d");
		
		
		return this;
	};
	
	var inititem = function(that,off_w,off_h){
		
		//心电波画笔
		let ctxq = that.canvas.getContext('2d');

		//创建虚拟canvas  单导 
		let bufCanvas = _createVirtualCanvas(that.width, that.height);
		// 缓存画笔             单导 
		let cbufctx = bufCanvas.getContext("2d");
		//创建虚拟canvas  单导 v1
		let bufCanvasV1 = _createVirtualCanvas(that.width, that.height);
		// 缓存画笔             单导 v1
		let cbufctxV1 = bufCanvasV1.getContext("2d");
		//创建虚拟canvas  单导 v2
		let bufCanvasV2 = _createVirtualCanvas(that.width, that.height);
		// 缓存画笔             单导 v2
		let cbufctxV2 = bufCanvasV2.getContext("2d");
		
		//创建虚拟canvas  单导 v3
		let bufCanvasV3 = _createVirtualCanvas(that.width, that.height);
		// 缓存画笔             单导 v3
		let cbufctxV3 = bufCanvasV3.getContext("2d");
		
		//创建虚拟canvas  呼吸
		let breathe = _createVirtualCanvas(that.width, that.height);
		// 缓存画笔              呼吸
		let breathectx = breathe.getContext("2d");
		
		//创建虚拟canvas  血养
		let blood = _createVirtualCanvas(that.width, that.height);
		// 缓存画笔              血养
		let bloodctx = blood.getContext("2d");
		
		//创建虚拟canvas  血养2
		let blood2 = _createVirtualCanvas(that.width, that.height);
		// 缓存画笔              血养2
		let blood2ctx = blood2.getContext("2d");
		
		//创建虚拟canvas  血养3
		let blood3 = _createVirtualCanvas(that.width, that.height);
		// 缓存画笔              血养2
		let blood3ctx = blood3.getContext("2d");
			
			
		var ctxitem ={
			//心电波画笔
			ctxq : ctxq,

			//创建虚拟canvas  单导 
			bufCanvas : bufCanvas,
			// 缓存画笔             单导 
			cbufctx : cbufctx,
			//创建虚拟canvas  单导 v1
			bufCanvasV1 : bufCanvasV1,
			// 缓存画笔             单导 v1
			cbufctxV1 : cbufctxV1,
			//创建虚拟canvas  单导 v2
			bufCanvasV2 : bufCanvasV2,
			// 缓存画笔             单导 v2
			cbufctxV2 : cbufctxV2,
			
			//创建虚拟canvas  单导 v3
			bufCanvasV3 : bufCanvasV3,
			// 缓存画笔             单导 v3
			cbufctxV3 : cbufctxV3,
			
			//创建虚拟canvas  呼吸
			breathe : breathe,
			// 缓存画笔              呼吸
			breathectx : breathectx,
			
			//创建虚拟canvas  血养
			blood : blood,
			// 缓存画笔              血养
			bloodctx : bloodctx,
			
			//创建虚拟canvas  血养2
			blood2 : blood2,
			// 缓存画笔              血养2
			blood2ctx : blood2ctx,
			
			//创建虚拟canvas  血养3
			blood3 : blood3,
			// 缓存画笔              血养2
			blood3ctx : blood3ctx,
			
			off_w:off_w,
			off_h:off_h
		}
		return ctxitem
	}


	DrawEcgFun.prototype.draw = function() { //渲染元素
		console.log("draw")
		console.log(this)
		
		if ( this.lowgirdvas != undefined){
			// 画低格
			_drawGrid(this)
		}



		var ecgObj = {// 单导 
			width:		this.width,
			height:		this.height,
			ctxq:		this.ctxq,
			cbufctx:	this.cbufctx,
			bufCanvas:	this.bufCanvas,
			
			ecgdata:	this.config.ecg.datas, 
			idx:		this.config.ecg.idx,
			color:		this.config.ecg.color,
			speed:		this.config.ecg.speed
		}
		//开始画 单导
		_realDraw(ecgObj)
		
		var ecgObjV1 = {// 单导 v1
			width:		this.width,
			height:		this.height,
			ctxq:		this.ctxq,
			cbufctx:	this.cbufctxV1,
			bufCanvas:	this.bufCanvasV1,
			
			ecgdata:	this.config.ecgv1.datas,
			idx:		this.config.ecgv1.idx,
			color:		this.config.ecgv1.color,
			speed:		this.config.ecgv1.speed
		}
		
		//开始画 单导 V1
		_realDraw(ecgObjV1)
		
		var ecgObjV2 = {// 单导 v2
			width:		this.width,
			height:		this.height,
			ctxq:		this.ctxq,
			cbufctx:	this.cbufctxV2,
			bufCanvas:	this.bufCanvasV2,
			
			ecgdata:	this.config.ecgv2.datas,
			idx:		this.config.ecgv2.idx,
			color:		this.config.ecgv2.color,
			speed:		this.config.ecgv2.speed
		}
		
		//开始画 单导 V2
		_realDraw(ecgObjV2)
		
		var ecgObjV3 = {// 单导 v3
			width:		this.width,
			height:		this.height,
			ctxq:		this.ctxq,
			cbufctx:	this.cbufctxV3,
			bufCanvas:	this.bufCanvasV3,
			
			ecgdata:	this.config.ecgv3.datas,
			idx:		this.config.ecgv3.idx,
			color:		this.config.ecgv3.color,
			speed:		this.config.ecgv3.speed
		}
		
		//开始画 单导 V3
		_realDraw(ecgObjV3)
		
				
		var ecgObjbreathe = {// 呼吸 breathe
			width:		this.width,
			height:		this.height,
			ctxq:		this.ctxq,
			cbufctx:	this.breathectx,
			bufCanvas:	this.breathe,
			
			ecgdata:	this.config.breathe.datas,
			idx:		this.config.breathe.idx,
			color:		this.config.breathe.color,
			speed:		this.config.breathe.speed
		}
		
		//开始画 呼吸 V3
		_realDraw(ecgObjbreathe)
		
		
		var ecgObjblood = {// 血养 blood
			width:		this.width,
			height:		this.height,
			ctxq:		this.ctxq,
			cbufctx:	this.bloodctx,
			bufCanvas:	this.blood,
			
			ecgdata:	this.config.blood.datas,
			idx:		this.config.blood.idx,
			color:		this.config.blood.color,
			speed:		this.config.blood.speed
		}
		
		//开始画 血养 blood
		_realDraw(ecgObjblood)
		
		var ecgObjblood2 = {// 血养 blood
			width:		this.width,
			height:		this.height,
			ctxq:		this.ctxq,
			cbufctx:	this.blood2ctx,
			bufCanvas:	this.blood2,
			
			ecgdata:	this.config.blood2.datas,
			idx:		this.config.blood2.idx,
			color:		this.config.blood2.color,
			speed:		this.config.blood2.speed
		}
		
		//开始画 血养 blood2
		_realDraw(ecgObjblood2)
		
		
		var ecgObjblood3 = {// 血养 blood3
			width:		this.width,
			height:		this.height,
			ctxq:		this.ctxq,
			cbufctx:	this.blood3ctx,
			bufCanvas:	this.blood3,
			
			ecgdata:	this.config.blood3.datas,
			idx:		this.config.blood3.idx,
			color:		this.config.blood3.color,
			speed:		this.config.blood3.speed
		}
		
		//开始画 血养 blood 3
		_realDraw(ecgObjblood3)
		
		
		
		
		// 42毫秒人眼上限， 把虚拟内存画布 刷到 画布上
		setInterval(_copyDraw, 100,this);
		
		return this;
	};

	//开始画
	var _realDraw = function(that) {

		let width = 375;//that.width 			//宽
		let height = 220;//that.height		//高
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
		}
		
		function getData(ecgdata) {
			let data = ecgdata[g_idx]
			if ( data != undefined){
				g_idx++
			}
			return data
		}
		
	}
	
	var _copyDraw = function(that){
		
		that.cbufctx.stroke(); // ---bufCanvas
		that.cbufctxV1.stroke();// ---bufCanvasV1
		that.cbufctxV2.stroke(); // --bufCanvasV2
		that.cbufctxV3.stroke(); // --bufCanvasV3
		that.breathectx.stroke();// --breathe
		that.bloodctx.stroke();// --blood
		that.blood2ctx.stroke();// --blood2
		that.blood3ctx.stroke();// --blood3
		
		
		that.blood2ctx.drawImage(that.blood3,0,0);
		that.bloodctx.drawImage(that.blood2,0,0);
		that.breathectx.drawImage(that.blood,0,0);
		that.cbufctxV3.drawImage(that.breathe,0,0);
		that.cbufctxV2.drawImage(that.bufCanvasV3,0,0);
		that.cbufctxV1.drawImage(that.bufCanvasV2,0,0);
		that.cbufctx.drawImage(that.bufCanvasV1,0,0);
		
		that.ctxq.globalCompositeOperation="destination-atop";
		that.ctxq.drawImage(that.bufCanvas, 0, 0);
		
		that.cbufctx.clearRect(0,0,that.width,that.height)
		that.cbufctxV1.clearRect(0,0,that.width,that.height)
		that.cbufctxV2.clearRect(0,0,that.width,that.height)
		that.cbufctxV3.clearRect(0,0,that.width,that.height)
		that.breathectx.clearRect(0,0,that.width,that.height)
		that.bloodctx.clearRect(0,0,that.width,that.height)
		that.blood2ctx.clearRect(0,0,that.width,that.height)
		that.blood3ctx.clearRect(0,0,that.width,that.height)
		
		
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



