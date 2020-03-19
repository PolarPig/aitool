

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
	ctxq.globalCompositeOperation="destination-atop";
	
	// 缓存
	let canvasBuffer = document.createElement("canvas");
	canvasBuffer.width = canvas.width;
	canvasBuffer.height = canvas.height;
	// 缓存画笔
	let cbufctx = canvasBuffer.getContext("2d");
	
	// 缓存
	let canvasBuffer1 = document.createElement("canvas");
	canvasBuffer1.width = canvas.width;
	canvasBuffer1.height = canvas.height;
	// 缓存画笔
	let cbufctx1 = canvasBuffer1.getContext("2d");
	
		// 缓存
	let canvasBuffer2 = document.createElement("canvas");
	canvasBuffer2.width = canvas.width;
	canvasBuffer2.height = canvas.height;
	// 缓存画笔
	let cbufctx2 = canvasBuffer2.getContext("2d");
	
	
			// 缓存
	let canvasBuffer3 = document.createElement("canvas");
	canvasBuffer3.width = canvas.width;
	canvasBuffer3.height = canvas.height;
	// 缓存画笔
	let cbufctx3 = canvasBuffer3.getContext("2d");
	
	
			// 缓存
	let canvasBuffer4 = document.createElement("canvas");
	canvasBuffer4.width = canvas.width;
	canvasBuffer4.height = canvas.height;
	// 缓存画笔
	let cbufctx4 = canvasBuffer4.getContext("2d");
	
	
	
			// 缓存
	let canvasBuffer5 = document.createElement("canvas");
	canvasBuffer5.width = canvas.width;
	canvasBuffer5.height = canvas.height;
	// 缓存画笔
	let cbufctx5 = canvasBuffer5.getContext("2d");
	
	
			// 缓存
	let canvasBuffer6 = document.createElement("canvas");
	canvasBuffer6.width = canvas.width;
	canvasBuffer6.height = canvas.height;
	// 缓存画笔
	let cbufctx6 = canvasBuffer6.getContext("2d");
	
	
			// 缓存
	let canvasBuffer7 = document.createElement("canvas");
	canvasBuffer7.width = canvas.width;
	canvasBuffer7.height = canvas.height;
	// 缓存画笔
	let cbufctx7 = canvasBuffer7.getContext("2d");
	
	
	
	//抗锯齿
	cbufctx.imageSmoothingEnabled = true
	
	let width = canvas.width;
	let height = canvas.height;

	
	// 填充背景颜色
	ctx.fillStyle = "#242833";
	ctx.fillRect(0, 0, width, height);

	//画低格
	drawGrid(ctx)

	cbufctx.beginPath();
	cbufctx.lineWidth = 1;
	cbufctx.strokeStyle = "#32FF32";
	
	cbufctx1.beginPath();
	cbufctx1.lineWidth = 1;
	cbufctx1.strokeStyle = "red";
	
	cbufctx2.beginPath();
	cbufctx2.lineWidth = 1;
	cbufctx2.strokeStyle = "aquamarine";
	
	
	cbufctx3.beginPath();
	cbufctx3.lineWidth = 1;
	cbufctx3.strokeStyle = "#B5655E";
	
		
	cbufctx4.beginPath();
	cbufctx4.lineWidth = 1;
	cbufctx4.strokeStyle = "greenyellow";
	
		
	cbufctx5.beginPath();
	cbufctx5.lineWidth = 1;
	cbufctx5.strokeStyle = "darkgoldenrod";
	
		
	cbufctx6.beginPath();
	cbufctx6.lineWidth = 1;
	cbufctx6.strokeStyle = "blueviolet";
	
		
	cbufctx7.beginPath();
	cbufctx7.lineWidth = 1;
	cbufctx7.strokeStyle = "tomato";
	
		

	
	// 启动
	start(datas,0,ctxq,cbufctx,canvasBuffer,4);
	start(datas,1,ctxq,cbufctx1,canvasBuffer1,10);
	start(datas2,2,ctxq,cbufctx2,canvasBuffer2,4);
	start(datas2,3,ctxq,cbufctx3,canvasBuffer2,20);
	start(datas,4,ctxq,cbufctx4,canvasBuffer2,15);
	start(datas2,5,ctxq,cbufctx5,canvasBuffer2,10);
//	start(datas,6,ctxq,cbufctx6,canvasBuffer2,10);
//	start(datas2,7,ctxq,cbufctx7,canvasBuffer2,4);
	
					
	
	// 3.三级实时画布：  42毫秒人眼上限， 把虚拟内存画布 刷到 画布上
	setInterval(drawCanvas, 100);
	    
	    
	function start(datas,idx,ctxq,cbufctx,canvasBuffer,speed){
		
		
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
		let memidx = setInterval(drawBufToCanMem, 100);

		let dataarr = new Array(755);
		for (let i=0;i<755;i++)	 {
			let item = {
				x:0,
				y:0
			}
			dataarr[i] = item
		}
		
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
			let y = 10 - (data * 19) / 100 + idx*10;
			
			let item = dataarr[g_sub_idx]
			item.x = x
			item.y = y
			dataarr[g_sub_idx] = item
			g_sub_x = x
			
			// 制造缺口
			for (let i = g_sub_idx+1; i < g_sub_idx+5; i++) {
				let next = dataarr[i]
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
			for (let i = 0; i < 750; i++) {
				let item = dataarr[i]
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
	
		
		function getData(datas) {
			let data = datas[g_idx]
			if ( data != undefined){
				g_idx++
			}
			return data
		}
	}
	
	
	function drawCanvas(){

			cbufctx.stroke();
			cbufctx1.stroke();
			cbufctx2.stroke();
			cbufctx3.stroke();
			cbufctx4.stroke();
			cbufctx5.stroke();
			cbufctx6.stroke();
			cbufctx7.stroke();
			
			
			
			cbufctx6.drawImage(canvasBuffer7,0,0);
			cbufctx5.drawImage(canvasBuffer6,0,0);
			cbufctx4.drawImage(canvasBuffer5,0,0);
			cbufctx3.drawImage(canvasBuffer4,0,0);
			cbufctx2.drawImage(canvasBuffer3,0,0);
			cbufctx1.drawImage(canvasBuffer2,0,0);
			cbufctx.drawImage(canvasBuffer1,0,0);
			
			
			ctxq.drawImage(canvasBuffer, 0, 0);
			
			cbufctx.clearRect(0,0,width,height)
			cbufctx1.clearRect(0,0,width,height)
			cbufctx2.clearRect(0,0,width,height)
			cbufctx3.clearRect(0,0,width,height)
			cbufctx4.clearRect(0,0,width,height)
			cbufctx5.clearRect(0,0,width,height)
			cbufctx6.clearRect(0,0,width,height)
			cbufctx7.clearRect(0,0,width,height)
			
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
	

}