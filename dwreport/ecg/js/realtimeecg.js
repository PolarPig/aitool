

var ecgdraw = function(lowgirdvas,canvas) {

	let dflag = randomNum(1,4)
	if(dflag == 2){
		datas = datas1
	}
	if(dflag == 3){
		datas = datas2
	}
	if(dflag == 4){
		datas = datas3
	}
	
	//低格画笔
	let ctx = lowgirdvas.getContext('2d');
	//抗锯齿
	ctx.imageSmoothingEnabled = true
	//心电波画笔
	let ctxq = canvas.getContext('2d');
	//抗锯齿
	ctxq.imageSmoothingEnabled = true

	// 缓存
	let canvasBuffer = document.createElement("canvas");
	canvasBuffer.width = canvas.width;
	canvasBuffer.height = canvas.height;
	// 缓存画笔
	let cbufctx = canvasBuffer.getContext("2d");
	//抗锯齿
	cbufctx.imageSmoothingEnabled = true
	
	//控制
	let index = 0

	let width = canvas.width;
	let height = canvas.height;

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
	
	// 填充背景颜色
	ctx.fillStyle = "#242833";
	ctx.fillRect(0, 0, width, height);

	//画低格
	drawGrid(ctx)

	cbufctx.beginPath();
	cbufctx.lineWidth = 1;
	cbufctx.strokeStyle = "#32FF32";
	
	ctxq.beginPath();
	ctxq.lineWidth = 1;
	ctxq.strokeStyle = "#32FF32";
	
	// 启动
	start(datas);
//	start(datas2);
	
	function start(datas){
		// 1.一级buff缓冲： 处理数据进入到 循环数组 750个元素
		let bufidx = setInterval(dealArrayBuff, 4);
		// 2.二级虚拟画布缓冲：  处理循环数组 写入到 虚拟内存画布
		let memidx = setInterval(drawBufToCanMem, 40);
		// 3.三级实时画布：  42毫秒人眼上限， 把虚拟内存画布 刷到 画布上
	    let drawidx = setInterval(drawCanvas, 42);
	    
		let dataarr = new Array(755); 
		
		let begin=new Date();
		
		// 1. 处理数据到 buff 中 750 数组
		function dealArrayBuff(){
			let data = getData(datas)
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
				let end=new Date();
				let time=end-begin;
				time = parseInt(time/1000)
				document.getElementById("timep").innerText = time+"秒"
				begin = end;
				g_sub_idx = 0
			}
			let x = (g_sub_idx * width) / 750;
			let y = 50 - (data * 38) / 100;
			
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
			ctxq.clearRect(0,0,width,height)
			ctxq.drawImage(canvasBuffer, 0, 0, width, height,0, 0, width, height);
			cbufctx.clearRect(0,0,width,height)
		}
	}
	
	
	
	

	function getData(datas) {
		let data = datas[g_idx]
		if ( data != undefined){
			g_idx++
		}
		return data
	}

	function drawGrid(ctx) {

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
	

//	function getData() {
//		let data = datas[g_idx]
//		if ( data != undefined){
//			g_idx++
//		}
//		return data
//	}
//	
//	// 利用缓存技术，提高性能
//	function drawMem() {
//		let data = getData()
//		if(data == undefined) {
//			g_data_flag = false
//			return
//		}
//		g_data_flag = true
//
//		if(g_sub_idx > 750) {
//			g_sub_idx = 0
//		}
//
//		let x = (g_sub_idx * width) / 750;
//		let y = 50 - (data * 38) / 100;
//		
//		if(g_sub_idx == 0) {
//			cbufctx.moveTo(0, y);
//		}
//
//		cbufctx.lineTo(x, y);
//		
//		g_sub_idx++
//
//	}
//	
//	// 直接画到画布上
//	function drawEcg() {
//		let data = getData()
//		if(data == undefined) {
//			return
//		}
//		
//		
//
//		if(g_sub_idx > 750) {
//			g_sub_idx = 0
//		}
//
//		let x = (g_sub_idx * width) / 750;
//		let y = 50 - (data * 38) / 100;
//		
//		if(g_sub_idx == 0) {
//			ctxq.moveTo(0, y);
//		}
//
//		ctxq.lineTo(x, y);
//		ctxq.stroke();
//		
//		g_sub_idx++
//
//	}

}