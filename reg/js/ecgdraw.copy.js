
var ecgdraw = function () {


	g_main_top_xy = getDivPosition("maindiv");
	g_navcanvas_xy = getDivPosition('navcanvas');



	// 心电波
	var canvas = document.getElementById(g_canvasId);
	// 导航
	var navcanvas = document.getElementById(g_navcanvasId);
	//  导航 折线图
	var navchartcanvas = document.getElementById(g_chartcanvasId);
	// 单导 QRS波
	var qrscanvas = document.getElementById(g_qrscanvasId);


	// QRS 波 画笔
	var qrsctx = qrscanvas.getContext('2d');
	// QRS 波 定位线 画笔
	var qrsposctx = qrscanvas.getContext('2d');
	// QRS 波 定位线 文本 画笔
	var qrspostxtctx = qrscanvas.getContext('2d');
	// QRS 波 低格画笔
	var qrsgridctx = qrscanvas.getContext('2d');


	// 导航波形画笔
	var navctx = navcanvas.getContext('2d');
	// 矩形框画笔
	var navrectctx = navcanvas.getContext('2d');
	// 导航折线图形画笔
	var navchartctx = navchartcanvas.getContext('2d');
	var navlinectx = navchartcanvas.getContext('2d');


	//低格画笔
	var ctx = canvas.getContext('2d');
	//心电波画笔
	var ctxq = canvas.getContext('2d');
	//心电波文本画笔
	var ctxtext = canvas.getContext('2d');
	//心电波定位线画笔
	var ctxpos = canvas.getContext('2d');
	//心电波框选画笔
	var ctxrect = canvas.getContext('2d')
	//标尺画笔  5 10 5 高度 38像素
	var ctxsc = canvas.getContext('2d');



	var width = canvas.width - g_scaleArea;
	var height = canvas.height;

	// 填充背景颜色
	ctx.fillStyle = "#242833";
	ctx.fillRect(0, 0, width + g_scaleArea, height);

	navchartctx.fillStyle = "#242833";
	navchartctx.fillRect(0, 0, navchartcanvas.width, navchartcanvas.height);
	navchartctx.stroke();


	if (g_flag == 1) { // g_flag 控制低格
		g_grid_exists = !g_grid_exists;
		g_flag = 0;
	}

	// 1. 画低格
	if (g_grid_exists) {
		// 画低格
		drawGrid(ctx);
	}

	if (g_grid_pos_flag) {
		gridposdraw()
	}
	// 2.画波形
	drawEcg(ctxq);

	// 3.画标尺
	drawScale(ctxsc);

	// 4.画缩略图
	drawNav(navctx);

	// 5.画缩略图-矩形框
	drawNavRect(navrectctx);

	// 6.画缩略图 - 折线图
	drawChartNav(navchartctx);

	// 画标尺
	function drawScale(ctxsc) {
		ctxsc.beginPath();
		ctxsc.lineWidth = "1";
		ctxsc.strokeStyle = "red";
		for (let i = 0; i < 6; i++) {
			ctxsc.moveTo(0, g_lineHeight * (i + 1));
			ctxsc.lineTo(5, g_lineHeight * (i + 1));
			ctxsc.lineTo(5, g_lineHeight * (i + 1) - 38);
			ctxsc.lineTo(15, g_lineHeight * (i + 1) - 38);
			ctxsc.lineTo(15, g_lineHeight * (i + 1));
			ctxsc.lineTo(20, g_lineHeight * (i + 1));
		}
		ctxsc.stroke();
	}

	function drawEcg(ctxq) {
		ctxq.beginPath();
		ctxq.lineWidth = "1";
		ctxq.strokeStyle = "#32FF32";

		let firstflagred = 0;
		let firstflaggreen = 0;
		let firstflagye = 0;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < g_mmPs; j++) {
				let idx = i * g_mmPs + j + g_offx;
				let itemobj = dataobjs[idx];
				if (!itemobj) {
					ctxq.stroke();
					return;
				}
				let data = itemobj.value;
				let x = g_scaleArea + (j * width) / g_mmPs;
				let y = g_lineHeight * (i + 1) - (data * 38) / (g_pixPmm * g_mmPmV) - 40;
				x = Math.ceil(x)
				y = Math.ceil(y)

				if (itemobj.flag == 1) {
					firstflagred = firstflagred + 1;
					firstflaggreen = 0;
					firstflagye = 0;

				} else if (itemobj.flag == 2) {
					firstflagye = firstflagye + 1;
					firstflaggreen = 0;
					firstflagred = 0;
				} else if (itemobj.flag == 0) {
					firstflaggreen = firstflaggreen + 1;
					firstflagred = 0;
					firstflagye = 0;
				}

				let flag = 0;
				if (idxdatas[idx] != undefined) {
					let txtflag = idxdatas[idx].txtflag;
					ctxtext.font = "20px Courier New";

					flag = idxdatas[idx].flag;
					if (flag == 0) {
						ctxtext.fillStyle = colorArr[1];
					} else if (flag == 99) {
						ctxtext.fillStyle = colorArr[45];
					} else {
						ctxtext.fillStyle = colorArr[flag];
					}
					// if (flag == 0) {
					// 	ctxtext.fillStyle = "white";
					// } else if (flag == 1) {
					// 	ctxtext.fillStyle = "red";
					// } else if (flag == 2) {
					// 	ctxtext.fillStyle = "yellow";
					// }
					idxdatas[idx].x = x;
					idxdatas[idx].y = y;
					ctxtext.fillText(txtflag, x - 5, y - 5);
					ctxtext.stroke();
				}

				if (mdxdatas[idx] != undefined) {
					ctxtext.font = "10px Courier New";
					ctxtext.fillStyle = "white";
					let distance = mdxdatas[idx].distance;
					let heartRate = mdxdatas[idx].heartRate;
					ctxtext.fillText(distance, x - 5, y - 30);
					ctxtext.fillText(heartRate, x - 5, y - 20);
					ctxtext.stroke();
				}



				if (firstflagred == 1) {
					ctxq.stroke();
					ctxq.beginPath();
					ctxq.lineWidth = "1";
					ctxq.strokeStyle = "red";
				}
				if (firstflaggreen == 1) {
					ctxq.stroke();
					ctxq.beginPath();
					ctxq.strokeStyle = "#32FF32";
				}
				if (firstflagye == 1) {
					ctxq.stroke();
					ctxq.beginPath();
					ctxq.strokeStyle = "yellow";
				}

				if (j == 0) {
					ctxq.moveTo(g_scaleArea, y);
				}
				ctxq.lineTo(x, y);

			}
		}

		ctxq.stroke();

		if (g_flag == 1) { // g_flag 控制低格
			g_grid_exists = !g_grid_exists;
			g_flag = 0;
		}

		// 画定位线
		if (g_grid_pos_flag) {
			gridposdraw()
		}
	}

	// 画定位线
	function gridposdraw() {

		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < g_mmPs; j++) {
				let idx = i * g_mmPs + j + g_offx;
				let itemobj = dataobjs[idx];
				if (!itemobj) {
					ctxq.stroke();
					return;
				}
				let data = itemobj.value;
				let x = g_scaleArea + (j * width) / g_mmPs;
				let y = g_lineHeight * (i + 1) - (data * 38) / (g_pixPmm * g_mmPmV) - 40;
				x = Math.ceil(x)
				y = Math.ceil(y)

				// 画定位线
				if (itemobj.qrs != undefined && itemobj.isdraw != undefined && itemobj.isdraw == 1) {
					ctxq.stroke();
					ctxpos.beginPath();
					ctxpos.lineWidth = "1";
					ctxpos.strokeStyle = "#93959B";
					ctxpos.moveTo(x, y - 10.5);
					ctxpos.lineTo(x, y + 10.5);
					ctxpos.stroke();
				}

			}
		}


	}



	function drawGrid(ctx) {
		// 绿色矩形
		ctx.beginPath();
		//线的粗细
		ctx.lineWidth = "1";

		ctx.strokeStyle = "#303641";  //#5D4332"
		ctx.moveTo(0, 0);
		ctx.lineTo(0.5, height);
		ctx.moveTo(0.5, height);
		ctx.lineTo(width + g_scaleArea, height);
		ctx.moveTo(width + g_scaleArea, height);
		ctx.lineTo(width + g_scaleArea, 0.5);
		ctx.moveTo(width + g_scaleArea, 0.5);
		ctx.lineTo(0.5, 0.5);

		for (let i = 19; i < (width + g_scaleArea); i = i + 19) {
			ctx.moveTo(0.5, i - 0.5);
			ctx.lineTo(width + g_scaleArea, i - 0.5);
		}

		for (let i = 19; i < (width + g_scaleArea); i = i + 19) {
			ctx.moveTo(i - 0.5, 0.5);
			ctx.lineTo(i - 0.5, width + g_scaleArea);
		}
		ctx.stroke();
	}


	// 画缩略图
	function drawNav(navctx) {
		navctx.fillStyle = "#242833";
		navctx.fillRect(0, 0, navcanvas.width, navcanvas.height);
		navctx.stroke();

		navctx.beginPath();
		navctx.lineWidth = "1";
		navctx.strokeStyle = "#32FF32";
		navctx.moveTo(0, 0);
		for (let i = 0; i < datas.length; i++) {
			let data = datas[i];
			let x = (i * navcanvas.width) / datas.length;
			let y = 50 - (data * 38) / (g_pixPmm * g_mmPmV);

			navctx.lineTo(x, y);

		}
		navctx.stroke();
	}

	// 画缩略图 - 折线图
	function drawChartNav(navchartctx) {
		let scroobj = getDivScroll("maindiv")
		//console.log(scroobj)
		let scroobjs = getDivPosition("maindiv")
		//console.log(scroobjs)

		navchartctx.fillStyle = "#242833";
		navchartctx.fillRect(0, 0, navchartcanvas.width, navchartcanvas.height);
		navchartctx.stroke();

		var startX = 25;
		var startY = 70;

		var data = [0, 40, 80, 120, 160, 200]; //坐标轴坐标
		var ydata = ['18:00', '18:05', '18:15', '18:20', '18:25', '18:30',];
		//建立坐标系
		function creat() {
			navchartctx.beginPath();
			navchartctx.lineWidth = "1";
			navchartctx.moveTo(startX, 2);
			navchartctx.lineTo(startX, startY);
			navchartctx.moveTo(startX, startY);
			navchartctx.lineTo(navchartcanvas.width, startY);
			navchartctx.closePath();
			navchartctx.stroke();
		}

		//填充横纵坐标
		function insert() {
			navchartctx.beginPath();
			navchartctx.fillStyle = "#61687A";

			var x = 25;
			var y = 80;
			//绘制横坐标
			for (var i in data) {
				navchartctx.fillText(data[i], x - 20, y - 10);
				y -= (navchartcanvas.height - 20) / data.length;
			}

			x = 40;
			y = 80;
			//绘制纵坐标
			for (var i in ydata) {
				navchartctx.fillText(ydata[i], x - 20, y);
				x += navchartcanvas.width / ydata.length;
			}
			navchartctx.stroke();
		}

		navchartctx.beginPath();
		navchartctx.lineWidth = "1";
		navchartctx.strokeStyle = "#61687A";

		creat();
		navchartctx.stroke();


		insert();



		navchartctx.beginPath();
		navchartctx.lineWidth = "1";
		navchartctx.strokeStyle = "#32FF32";
		let flag = 0;
		for (let i in mdxdatas) {
			let data = mdxdatas[i];
			if (data == undefined) {
				continue;
			}
			let x = (i * navchartcanvas.width) / mdxdatas.length + 20;
			let y = 80 - (data.heartRate * 37) / (g_pixPmm * g_mmPmV);
			if (flag == 0) {
				navchartctx.moveTo(x, y);
				flag++;
			}
			navchartctx.lineTo(x, y);
			data.x = x;
			data.y = y;

		}
		navchartctx.stroke();
		//		navcanvasMove()
	}

	function navcanvasClick(e) {
		if (Line.on == true) {
			return;
		}
		//		g_navclickLine = []

		//drawEcgEx(ctxq, g_offx);
		// 取得画布上被单击的点
		let clickX = e.pageX - g_charcanvas_xy.x;
		let clickY = e.pageY - g_charcanvas_xy.y;
		console.log(clickX)
		g_clickX = clickX
		g_clickY = clickY

		drawChartNav(navchartctx)
		if (clickX > 25) {
			//			navchartctx.beginPath();
			//			navchartctx.lineWidth = "1";
			//			navchartctx.strokeStyle = "red";
			//	
			//			navchartctx.moveTo(clickX, 10);
			//			navchartctx.lineTo(clickX, 70);
			//			navchartctx.stroke();


			//console.log(mdxdatas)
			for (let i in mdxdatas) {

				// 25 像素多少个下标  25 = (x/250)/60 * 490 x=(25/490)*60*250
				let x = (27 / 490) * 60 * 250

				let data = mdxdatas[i];
				let idx = data.idx
				if ((data.x - clickX) < 25 && (data.x - clickX) > 20) {
					g_offx = data.idx - 34

					drawEcgEx(ctxq, g_offx);

					g_x = ((g_offx - x) / 250) / 60 * 490
					if (g_x < 0) {
						g_x = 0
					}
					scrollout(g_x)


					break;
				}
			}


		}


	}

	function navcanvasMove(e) {
		if (Line.on == true) {
			return;
		}
		//		console.log("e.pageX:"+e.pageX+",e.pageY:"+e.pageY)
		//		console.log("g_charcanvas_xy.x:"+g_charcanvas_xy.x+",g_charcanvas_xy.y:"+g_charcanvas_xy.y)
		//drawEcgEx(ctxq, g_offx);
		// 取得画布上被单击的点
		let clickX = e.pageX - g_charcanvas_xy.x;
		let clickY = e.pageY - g_charcanvas_xy.y;
//		console.log("clickX:" + clickX + ",clickY:" + clickY)

		drawChartNav(navchartctx)

		if (clickX > 25) {
			navchartctx.beginPath();
			navchartctx.lineWidth = "1";
			navchartctx.strokeStyle = "aquamarine";

			navchartctx.moveTo(clickX, 10);
			navchartctx.lineTo(clickX, 70);
			navchartctx.stroke();
		}

		for (let i in mdxdatas) {
			let x = (27 / 490) * 60 * 250
			let data = mdxdatas[i];
			let idx = data.idx
			let clickX = g_clickX || 0
			if ((data.x - clickX) < 25 && (data.x - clickX) > 20) {
				g_offx = data.idx - 34
				drawEcgEx(ctxq, g_offx);

				break;
			}
		}


	}
	function navcanvasUp(e) {
		if (Line.on == true) {
			return;
		}

		//drawEcgEx(ctxq, g_offx);
		// 取得画布上被单击的点
		let clickX = e.pageX - canvas.offsetLeft - g_charcanvas_xy.x;
		let clickY = e.pageY - canvas.offsetTop - g_charcanvas_xy.y;
	}

	function navcanvasOut(e) {

		drawChartNav(navchartctx)

	}
	function rectar(x, y, width, height) {
		console.log(x)
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.isSelected = false;
	}

	function drawNavRect(navrectctx) {
		navrectctx.beginPath();
		navrectctx.fillStyle = "rgba(211,213,216,0.5)";
		navrectctx.lineWidth = "4";
		navrectctx.strokeStyle = "white";
		navrectctx.fillRect(x1, 15, g_navrectwidth, 60);

		console.log(x1)
		var rect = new rectar(x1, 15, g_navrectwidth, 60);
		console.log(rect)
		g_rect = rect
		g_rects.push(rect);
		g_SelectedRect = rect;
		console.log(g_SelectedRect)
		console.log(g_rects)
		navrectctx.stroke();
	}

	function canvasWorkMove(e) {
		if (Line.on == true) {
			return;
		}

		let scroobj = getDivScroll("maindiv")
		//console.log(scroobj)
		let clickX = e.pageX - canvas.offsetLeft - g_main_top_xy.x;
		let clickY = e.pageY - canvas.offsetTop - g_main_top_xy.y + 60 + scroobj.top;
		g_right_idx = 0;
		$("#wrap").hide();
		// console.log("clickX="+clickX+",clickY="+clickY)

		// 计数索引
		let yhang = parseInt(clickY / g_lineHeight);
		let yidx = yhang * g_mmPs;
		let xidx = parseInt((g_mmPs / width) * (clickX - g_scaleArea));

		let idx = (yidx + xidx + g_offx);

		//获取附近 真正索引
		let realIdx = getRealIdx(idx);
		let dataobj = idxdatas[realIdx];
		//console.log("realIdx:"+realIdx)
		if (realIdx != undefined) {
			// if ( g_moveArea[realIdx] != undefined){
			// 	return
			// }
			g_moveArea = [];
			drawEcgEx(ctxq, g_offx);

			//console.log(dataobj)

			//console.log("x="+dataobj.x+",y="+dataobj.y)
			//console.log(clickY)
			if (clickY >= (dataobj.y - 30)) {
				ctxrect.beginPath();
				ctxrect.lineWidth = "1";
				ctxrect.strokeStyle = "aqua";
				ctxrect.strokeRect(dataobj.x - 15, dataobj.y - 10, 30, 60);
				ctxrect.stroke();
				g_moveArea[realIdx] = realIdx;
			}


		} else {
			if (g_moveArea != undefined && g_moveArea.length > 0) {
				g_moveArea = [];
				drawEcgEx(ctxq, g_offx);
			}

			if (clickY % g_lineHeight > 90) {
				g_right_idx = idx;
			}

			if (dataobj == undefined) {
				let dataobj = dataobjs[idx];
				if (dataobj != undefined) {
					g_moveLine = []
					drawEcgEx(ctxq, g_offx);


					//console.log(dataobj.x)
					//console.log('clickX: ' + clickX)
					ctxrect.beginPath();
					ctxrect.lineWidth = "1";
					ctxrect.strokeStyle = "aqua";
					ctxrect.strokeRect(dataobj.x, dataobj.y - 30, 0, 60);
					ctxrect.stroke();
					g_moveLine[idx] = idx;
				}

				if (dataobj == undefined || dataobj.x == undefined) {
					return
				}
			}


		}


	}

	function canvasWorkClick(e) {
		if (Line.on == true) {
			return;
		}

		let scroobj = getDivScroll("maindiv")
		console.log(scroobj)
		g_subdatas = [];
		g_qrspos = [];

		// $("#showqrs").hide()

		g_clickArea = [];
		g_clickLine = [];
		drawEcgEx(ctxq, g_offx);
		// 取得画布上被单击的点
		let clickX = e.pageX - canvas.offsetLeft - g_main_top_xy.x;
		let clickY = e.pageY - canvas.offsetTop - g_main_top_xy.y + 60 + scroobj.top;
		// console.log("x="+clickX+",y="+clickY)
		// 计数索引
		let yhang = parseInt(clickY / g_lineHeight);
		let yidx = yhang * g_mmPs;
		let xidx = parseInt((g_mmPs / width) * (clickX - g_scaleArea));
		let idx = (yidx + xidx + g_offx);
		g_preidx = idx;
		//获取附近 真正索引
		console.log(idx)
		let realIdx = getRealIdx(idx);
		deleteQRSIndex = realIdx
		console.log(realIdx)
		if (realIdx != undefined) {
			addQRSIndex = undefined
			let rect = {};

			let dataobj = idxdatas[realIdx];
			if (clickY >= (dataobj.y - 30)) {
				ctxrect.beginPath();
				ctxrect.lineWidth = "1";
				ctxrect.strokeStyle = "red";
				ctxrect.strokeRect(dataobj.x - 15, dataobj.y - 10, 30, 60);
				ctxrect.stroke();

				rect.w = 30;
				rect.h = 60;
				rect.idx = realIdx;
				rect.flag = dataobj.flag;
				g_clickArea[realIdx] = rect;

				g_bottom_idx = dataobj.subidx
				$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第" + g_bottom_idx + "个心搏，共有 " + g_bottom_total_idx + " 个心搏")
			}
		} else {
			addQRSIndex = idx + 25
			let rect = {};
			let dataobj = dataobjs[idx];

			if (dataobj == undefined || dataobj.x == undefined) {
				return
			}

			ctxrect.beginPath();
			ctxrect.lineWidth = "1";
			ctxrect.strokeStyle = "red";
			ctxrect.strokeRect(dataobj.x, dataobj.y - 30, 0, 60)
			ctxrect.stroke();

			rect.w = 0
			rect.h = 60
			rect.idx = idx
			g_clickLine[idx] = rect
		}
	}

	function canvasWorkUp(e) {
		if (Line.on == true) {
			return;
		}

		let scroobj = getDivScroll("maindiv")
		console.log(scroobj)

		// 取得画布上被单击的点
		let clickX = e.pageX - canvas.offsetLeft - g_main_top_xy.x;
		let clickY = e.pageY - canvas.offsetTop - g_main_top_xy.y + 60 + scroobj.top;
		// console.log("x="+clickX+",y="+clickY)
		// 计数索引
		let yhang = parseInt(clickY / g_lineHeight);
		let yidx = yhang * g_mmPs;
		let xidx = parseInt((g_mmPs / width) * (clickX - g_scaleArea));
		let idx = (yidx + xidx + g_offx);

		let realIdx = getRealIdx(idx);

		g_nexidx = idx;

		if (g_preidx > g_nexidx) {
			let tmp = g_preidx;
			g_preidx = g_nexidx;
			g_nexidx = tmp;
		}

		let realPreIdx = getRealIdxNearMin(g_preidx);
		let realNexIdx = getRealIdxNearMax(g_nexidx);

		let diffidx = realNexIdx - realPreIdx;
		let difflen = parseInt(diffidx / g_mmPs);
		for (let i = 0; i < difflen; i++) {
			for (let j = (realPreIdx + i * g_mmPs); j < (realNexIdx - (difflen - i) * g_mmPs); j++) {
				let obj = idxdatas[j];
				if (obj != undefined) {
					let rect = {};
					rect.w = 30;
					rect.h = 60;
					rect.idx = j;
					g_clickArea[j] = rect;
				}
			}

		}




		drawEcgEx(ctxq, g_offx);


	}
	var g_qrsidx;

	function canvasWorkDoubleClick(e) {
		if (Line.on == true) {
			return;
		}

		let scroobj = getDivScroll("maindiv")
		console.log(scroobj)

		g_subdatas = [];
		g_qrspos = [];
		g_qrsidx = undefined;
		g_dbclickPos = undefined;
		// 取得画布上被单击的点
		let clickX = e.pageX - canvas.offsetLeft - g_main_top_xy.x;
		let clickY = e.pageY - canvas.offsetTop - g_main_top_xy.y + 60 + scroobj.top;
		// 计数索引
		let yhang = parseInt(clickY / g_lineHeight);
		let yidx = yhang * g_mmPs;
		let xidx = parseInt((g_mmPs / width) * (clickX - g_scaleArea));
		let idx = (yidx + xidx + g_offx);
		//获取附近 真正索引
		let realIdx = getRealIdx(idx);
		if (realIdx != undefined) {
			g_qrsidx = realIdx;
			$("#showqrs").show();
			// 填充背景颜色
			qrsctx.fillStyle = "#242833";
			qrsctx.fillRect(0, 0, qrscanvas.width, qrscanvas.height);

			// 单导 低格线
			gridQRSLow(qrsgridctx, qrscanvas);

			// 单导 心电波
			gridQRSHeat(qrsctx, realIdx);

		}
	}

	// 单导 心电波
	function gridQRSHeat(qrsctx, realIdx) {
		g_subdatas = [];
		let jidx = 0;
		for (let i = realIdx - 100; i < realIdx; i++) {
			var obj = dataobjs[i];
			if (obj == undefined) {
				continue;
			}
			obj.subidx = jidx;
			g_subdatas[jidx] = obj;
			jidx++;
		}
		for (let i = realIdx; i < realIdx + 100; i++) {
			var obj = dataobjs[i];
			if (obj == undefined) {
				continue;
			}
			obj.subidx = jidx;
			g_subdatas[jidx] = obj;
			jidx++;
		}
		// console.log(g_subdatas)

		qrsctx.beginPath();
		qrsctx.lineWidth = "1";
		qrsctx.strokeStyle = "#32FF32";

		for (let idx in g_subdatas) {
			let data = g_subdatas[idx];
			let x = (idx * qrscanvas.width) / g_subdatas.length;
			let y = 220 - (data.value * 500) / (g_pixPmm * g_mmPmV);
			if (idx == 0) {
				qrsctx.moveTo(x, y);
			}
			qrsctx.lineTo(x, y);
		}

		qrsctx.stroke();

		// 画定位线
		gridQRSPos(g_subdatas);


	}

	// 画定位线
	function gridQRSPos(g_subdatas) {

		let p1flag = 0;
		for (let idx in g_subdatas) {
			let itemobj = g_subdatas[idx];
			// 画定位线
			if (itemobj.qrs != undefined && itemobj.isdraw != undefined && itemobj.isdraw == 1) {

				if (itemobj.qrs == "P1") {
					p1flag = 1;
				}
				if (p1flag == 0) {
					continue;
				}

				let x = (idx * qrscanvas.width) / g_subdatas.length;
				let y = 220 - (itemobj.value * 500) / (g_pixPmm * g_mmPmV);

				qrsposctx.beginPath();
				qrsposctx.strokeStyle = itemobj.color;

				let obj = itemobj;
				obj.x = x;
				obj.y = y;
				if (itemobj.isfull == 1) {
					//实线
					qrsposctx.setLineDash([]);
					qrsposctx.lineWidth = "2";
					qrsposctx.moveTo(x, y - 100.5);
					qrsposctx.lineTo(x, y + 100.5);
					qrsposctx.stroke();

					qrspostxtctx.font = "20px Courier New";
					qrspostxtctx.fillStyle = itemobj.color;
					qrspostxtctx.fillText(itemobj.qrs, x - 10, y - 110.5);
					qrspostxtctx.stroke();

				} else {
					// 虚线
					qrsposctx.setLineDash([5]);
					qrsposctx.lineWidth = "1";
					qrsposctx.moveTo(x, y - 50.5);
					qrsposctx.lineTo(x, y + 50.5);
					qrsposctx.stroke();

					qrspostxtctx.font = "20px Courier New";
					qrspostxtctx.fillStyle = itemobj.color;
					qrspostxtctx.fillText(itemobj.qrs, x - 10, y - 55.5);
					qrspostxtctx.stroke();

				}
				g_qrspos[idx] = obj;

			}
		}
	}

	// 单导 低格线
	function gridQRSLow(qrsgridctx, qrscanvas) {
		let qrswidth = qrscanvas.width;
		let qrsheight = qrscanvas.height;
		// 绿色矩形
		qrsgridctx.beginPath();
		//线的粗细
		qrsgridctx.lineWidth = "1";
		qrsgridctx.strokeStyle = "#686C00";
		qrsgridctx.moveTo(0, 0);
		qrsgridctx.lineTo(0.5, qrsheight);
		qrsgridctx.moveTo(0.5, qrsheight);
		qrsgridctx.lineTo(qrswidth, qrsheight);
		qrsgridctx.moveTo(qrswidth, qrsheight);
		qrsgridctx.lineTo(qrswidth, 0.5);
		qrsgridctx.moveTo(qrswidth, 0.5);
		qrsgridctx.lineTo(0.5, 0.5);

		let ifulline = 0;
		for (let i = 17; i < (qrswidth); i = i + 17) {

			ifulline++;
			if (ifulline % 5 == 0) {
				qrsgridctx.setLineDash([]);
				qrsgridctx.beginPath();
			} else {
				qrsgridctx.setLineDash([5]);
				qrsgridctx.beginPath();
			}
			qrsgridctx.moveTo(0.5, i - 0.5);
			qrsgridctx.lineTo(qrswidth, i - 0.5);

			qrsgridctx.stroke();

		}
		ifulline = 0;
		for (let i = 11; i < (qrswidth); i = i + 11) {
			ifulline++;
			if (ifulline % 5 == 0) {
				qrsgridctx.setLineDash([]);
				qrsgridctx.beginPath();
			} else {
				qrsgridctx.setLineDash([5]);
				qrsgridctx.beginPath();
			}

			qrsgridctx.moveTo(i - 0.5, 0.5);
			qrsgridctx.lineTo(i - 0.5, qrswidth);

			qrsgridctx.stroke();

		}
		qrsgridctx.setLineDash([]);
		qrsgridctx.stroke();
	}






	function canvasClick(e) {
		// 使矩形允许拖拽
		//		console.log(isDragging)
		isDragging = !isDragging;
		// 取得画布上被单击的点
		let clickX = e.pageX - g_navcanvas_xy.x;
		let clickY = e.pageY - g_navcanvas_xy.y;
		//let clickY = e.pageY - navcanvas.offsetTop - g_navcanvas_xy.y;

		if (!isDragging) {
			let rect = g_rects[0];
			console.log(rect)
			let stopx = rect.x;
			g_offx = (stopx * datas.length) / width;
			g_offx = parseInt(g_offx);
			drawEcgEx(ctxq, g_offx);
			return;
		}

		// 查找被单击的矩形框
		for (let i = g_rects.length - 1; i >= 0; i--) {
			let rect = g_rects[i];
			if (rect == undefined) {
				continue;
			}
			widthstart = rect.x;
			widthend = rect.x + rect.width;
			heightstart = rect.y;
			heightend = rect.y + rect.height;
			// 判断这个点是否在矩形框中
			if ((clickX >= widthstart && clickX < (widthend - 20)) && (clickY >= heightstart) && (clickY < (heightend - 20))) {
				// 清除之前选择的矩形框
				if (g_SelectedRect != null) {
					g_SelectedRect.isSelected = false;
				}
				g_SelectedRect = rect;
				x1 = clickX - g_SelectedRect.x;
				y1 = clickY - g_SelectedRect.y;
				//选择矩形
				rect.isSelected = true;

				//更新显示
				drawRect(navrectctx, rect);
			}
		}
	}

	function drawRect(navrectctx, rect) {
		navrectctx.clearRect(0, 0, navcanvas.width, navcanvas.height);
		drawNav(navctx);
		navrectctx.beginPath();
		navrectctx.fillStyle = "rgba(211,213,216,0.5)";
		navrectctx.lineWidth = "4";
		navrectctx.strokeStyle = "white";
		navrectctx.fillRect(rect.x, rect.y, rect.width, rect.height);
		navrectctx.stroke();
	}

	function dragRect(e) {
		// 判断矩形是否开始拖拽
		if (isDragging == true) {
			// 判断拖拽对象是否存在
			if (g_SelectedRect != null) {
				// 取得鼠标位置
				//				console.log(e.pageX)
				//				console.log(g_navcanvas_xy.x)
				var x = e.pageX - g_navcanvas_xy.x;
				locationX = x
				//var x = e.pageX - navcanvas.offsetLeft - g_navcanvas_xy.x;
				// var y = e.pageY - navcanvas.offsetTop;
				// 将矩形移动到鼠标位置
				g_SelectedRect.x = x - x1;
				if (g_SelectedRect.x < 0) {
					g_SelectedRect.x = 0;
				}
				if ((g_SelectedRect.x + g_navrectwidth) > navcanvas.width) {
					g_SelectedRect.x = navcanvas.width - g_navrectwidth;
				}
				// SelectedRect.y = y - y1;
				// x1 = SelectedRect.x
				// 更新画布
				drawRect(navrectctx, g_SelectedRect);

				let rect = g_rects[0];
				//				console.log(rect)
				let stopx = g_SelectedRect.x;
				g_offx = (stopx * datas.length) / width;
				g_offx = parseInt(g_offx);
			}
		}
	}

	function canvasout() {
		g_clickArea = [];
		// 移出,不准移动方框
		isDragging = false;
		let rect = g_rects[0];
		//		let stopx = rect.x;
		//		let stopx = locationX;
		g_x = g_SelectedRect.x
		let stopx = g_SelectedRect.x * 2;
		g_offx = (stopx * datas.length) / width;
		g_offx = parseInt(g_offx);

		drawEcgEx(ctxq, g_offx);
		return;


	}
	scrollout = function (dis) {
		console.log(g_x)
		g_SelectedRect.x = g_x
		navrectctx.clearRect(0, 0, g_navrectwidth, 60);
		drawNav(navctx)
		navrectctx.beginPath();
		navrectctx.fillStyle = "rgba(211,213,216,0.5)";
		navrectctx.lineWidth = "4";
		navrectctx.strokeStyle = "white";
		navrectctx.fillRect(dis, 15, g_navrectwidth, 60);
	}

	function drawClickRect() {
		if (g_clickArea != undefined && g_clickArea.length > 0) {
			ctxrect.beginPath();
			ctxrect.lineWidth = "1";
			ctxrect.strokeStyle = "red";
			for (let idx in g_clickArea) {
				let rect = g_clickArea[idx];
				// console.log(idxdatas)
				let dataobj = idxdatas[idx];
				if (dataobj == undefined) {
					return
				} else {
					ctxrect.strokeRect(dataobj.x - 15, dataobj.y - 10, rect.w, rect.h);
				}

			}
			ctxrect.stroke();
		} else {
			ctxrect.beginPath();
			ctxrect.lineWidth = "1";
			ctxrect.strokeStyle = "red";
			for (let idx in g_clickLine) {
				let rect = g_clickLine[idx];
				let dataobj = dataobjs[idx];
				ctxrect.strokeRect(dataobj.x, dataobj.y - 30, rect.w, rect.h);
			}
			ctxrect.stroke();
		}
	}

	function drawClickLine() {
		let clickX = g_clickX || 26
		navchartctx.beginPath();
		navchartctx.lineWidth = "1";
		navchartctx.strokeStyle = "red";
		navchartctx.moveTo(clickX, 10);
		navchartctx.lineTo(clickX, 70);
		navchartctx.stroke();
	}

	function drawEcgEx(ctxq, offx) {
		ctxq.clearRect(0, 0, canvas.width, canvas.height);
		// 填充背景颜色
		ctx.fillStyle = "#242833";
		ctx.fillRect(0, 0, width + g_scaleArea, height);

		if (g_flag == 1) { // g_flag 控制低格
			g_grid_exists = !g_grid_exists;
			g_flag = 0;
		}

		// 1. 画低格
		if (g_grid_exists) {
			// 画低格
			drawGrid(ctx);
		}
		// 画定位线
		if (g_grid_pos_flag) {
			gridposdraw()
		}
		// 2.画标尺
		drawScale(ctxsc);

		// 3. 画选中 QRS波 方框
		drawClickRect();

		drawClickLine();

		ctxq.beginPath();
		ctxq.lineWidth = "1";
		ctxq.strokeStyle = "#32FF32";

		let firstflagred = 0;
		let firstflaggreen = 0;
		let firstflagye = 0;

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < g_mmPs; j++) {

				let idx = i * g_mmPs + j + offx
				let itemobj = dataobjs[idx];
				if (!itemobj) {
					ctxq.stroke();
					return;
				}
				let data = itemobj.value;
				if (itemobj.flag == 1) {
					firstflagred = firstflagred + 1;
					firstflaggreen = 0;
					firstflagye = 0;
				} else if (itemobj.flag == 2) {
					firstflagye = firstflagye + 1;
					firstflaggreen = 0;
					firstflagred = 0;

				} else if (itemobj.flag == 0) {
					firstflaggreen = firstflaggreen + 1;
					firstflagred = 0;
					firstflagye = 0;
				}

				if (firstflagred == 1) {
					ctxq.stroke();
					ctxq.beginPath();
					ctxq.strokeStyle = "red";
				}

				if (firstflaggreen == 1) {
					ctxq.stroke();
					ctxq.beginPath();
					ctxq.strokeStyle = "#32FF32";
				}

				if (firstflagye == 1) {
					ctxq.stroke();
					ctxq.beginPath();
					ctxq.strokeStyle = "yellow";
				}

				let x = g_scaleArea + (j * width) / g_mmPs;
				let y = g_lineHeight * (i + 1) - (data * 38) / (g_pixPmm * g_mmPmV) - 40;

				x = Math.ceil(x)
				y = Math.ceil(y)
				if (idxdatas[idx] != undefined) {
					let txtflag = idxdatas[idx].txtflag;
					ctxtext.font = "20px Courier New";

					let flag = idxdatas[idx].flag;
					if (flag == 0) {
						ctxtext.fillStyle = colorArr[1];
					} else if (flag == 99) {
						ctxtext.fillStyle = colorArr[45];
					} else {
						ctxtext.fillStyle = colorArr[flag];
					}
					// if (flag == 0) {
					// 	ctxtext.fillStyle = "white";
					// } else if (flag == 1) {
					// 	ctxtext.fillStyle = "red";
					// } else if (flag == 2) {
					// 	ctxtext.fillStyle = "yellow";
					// }
					idxdatas[idx].x = x;
					idxdatas[idx].y = y - 15;
					ctxtext.fillText(txtflag, x - 5, y - 5);
					ctxtext.stroke();
				}

				if (mdxdatas[idx] != undefined) {
					ctxtext.font = "10px Courier New";
					ctxtext.fillStyle = "white";
					let distance = mdxdatas[idx].distance;
					let heartRate = mdxdatas[idx].heartRate;
					ctxtext.fillText(distance, x - 5, y - 30);
					ctxtext.fillText(heartRate, x - 5, y - 20);
					ctxtext.stroke();
				}

				if (dataobjs[idx] != undefined) {
					dataobjs[idx].x = x + 10;
					dataobjs[idx].y = y;
				}

				if (j == 0) {
					ctxq.moveTo(g_scaleArea, y);
				}
				ctxq.lineTo(x, y);

			}
		}

		ctxq.stroke();


	}


	function qrscanvasDoubleClick(e) {

	}


	function qrscanvasClick(e) {

		g_clickPos = undefined;
		// 取得画布上被单击的点
		let clickX = e.pageX - qrscanvas.offsetLeft;
		let clickY = e.pageY - qrscanvas.offsetTop;
		// console.log("x="+clickX+",y="+clickY)

		let endpos = g_qrspos.pop();
		if (endpos == undefined) {
			return;
		}
		let minx = endpos.x;
		let min = minx;
		let minpos = undefined;
		g_qrspos.push(endpos);
		for (let idx in g_qrspos) {
			let pos = g_qrspos[idx];
			if (pos == undefined) {
				continue;
			}
			// console.log("posx="+pos.x+",posy="+pos.y+",qrs="+pos.qrs)
			if (Math.abs(clickX - pos.x) < min && (Math.abs(clickX - pos.x) - 25) > 0 && (Math.abs(clickX - pos.x) - 25) < 15) {
				min = Math.abs(clickX - pos.x);
				minx = pos.x;
				minpos = pos;
				minpos.subidx = parseInt(idx);
			}
		}
		if (minpos != undefined) {
			// console.log("minposx="+minpos.x+",minposy="+minpos.y+",qrs="+minpos.qrs)
			g_clickPos = minpos;
			g_clickPos.clickX = clickX;
			g_clickPos.clickY = clickY;

		}

	}

	function qrscanvasMove(e) {

	}

	function qrscanvasOut(e) {

		// 取得画布上被单击的点
		let clickX = e.pageX - qrscanvas.offsetLeft;
		let clickY = e.pageY - qrscanvas.offsetTop;
		// console.log("x="+clickX+",y="+clickY)
		if (g_clickPos != undefined) {
			// console.log("g_clickPos")
			// console.log(g_clickPos)

			let idx = parseInt((clickX * g_subdatas.length) / qrscanvas.width);

			// 移动
			qrsMove(g_clickPos, idx);


		}

		g_clickPos = undefined;
	}

	// 移动
	function qrsMove(checkPos, idx) {
		let subdata = g_subdatas[idx];
		// console.log("subdata")
		// console.log(subdata)
		if (subdata == undefined) {
			return;
		}
		// 保证不能出界
		let pidx = checkPos.subidx;
		let nidx = subdata.subidx;
		if (pidx > nidx) {
			for (var i = pidx - 1; i >= nidx; i--) {
				let tmpdata = g_subdatas[i];
				if (tmpdata != undefined && tmpdata.qrs != undefined && tmpdata.isdraw != undefined && tmpdata.isdraw == 1) {
					subdata = g_subdatas[i + 1];
					break;
				}
			}
		} else {
			for (var i = pidx + 1; i <= nidx; i++) {
				let tmpdata = g_subdatas[i];
				if (tmpdata != undefined && tmpdata.qrs != undefined && tmpdata.isdraw != undefined && tmpdata.isdraw == 1) {
					subdata = g_subdatas[i - 1];
					break;
				}
			}
		}

		if ((subdata.idx != undefined && subdata.idx == checkPos.idx) || subdata.qrs != undefined) {
			return;
		}

		subdata.color = checkPos.color;
		checkPos.color = undefined;

		subdata.flag = checkPos.flag;
		checkPos.flag = undefined;

		subdata.isdraw = checkPos.isdraw;
		checkPos.isdraw = undefined;

		subdata.isfull = checkPos.isfull;
		checkPos.isfull = undefined;

		subdata.qrs = checkPos.qrs;
		checkPos.qrs = undefined;

		g_qrspos[subdata.subidx] = subdata;
		g_qrspos[checkPos.subidx] = undefined;

		g_dbclickPos = subdata;

		// 填充背景颜色
		qrsctx.fillStyle = "#242833";
		qrsctx.fillRect(0, 0, qrscanvas.width, qrscanvas.height);

		// 单导 低格线
		gridQRSLow(qrsgridctx, qrscanvas);

		// 单导 心电波
		gridQRSHeat(qrsctx, g_qrsidx);

	}

	// delete键删除qrs波
	function deleteQRS(e) {
		// console.log(e)
		var e = window.event || e
		var code = e.which || e.keyCode
		if (code == 46) {
			if (deleteQRSIndex != undefined) {
				console.log(deleteQRSIndex)
				let url = Url;
				param = {
					method: 'POST',
					body: data = JSON.stringify({
						"reqHead": {
							"functionId": "DWS001002003",
						},
						"body": {
							"anaecgFileid": anaecgFileid,
							"qrsPos": deleteQRSIndex
						}
					}),
				};
				fetch(url, param).then(res => {
					return res.json();
				}).then(data => {
					console.log(data)
					if (data.respHead.respCode == '000') {
						console.log('删除成功！')

						// 采样点数据
						datas = [];
						// qrs info 数据
						idxdata;
						// QRS 中心坐标
						idxdatas = []
						// QRS 之间坐标
						mdxdatas = []
						// 处理后的采样点数据
						dataobjs = []

						$('#m').fadeOut();
						$(".btns-group").removeClass("stop_event");
						console.log(data);
						var result = data.body.data
						// 1. 心电印象
						$('.ecg_impression_body').text(result.ecg_result);
						if (result.ecg_level != undefined && result.ecg_level == -1) {
							ecgdraw();
							return
						}
						// 心率
						setText('heartH', result.hr)
						// 2. 获取原始采样点                                                            // result.rrDats
						getHeartDataByUrl("/get_ecg_voltage?file=" + fileDatas + "&begin=1&end=300&filter=1&reduce_sampling_rate=0", function (ecgdata, startTime, dataLength) {
							if (startTime === null || startTime === undefined) {
								startTime = '16:16:06'
							}

							// RR间期原始数据
							//datas = new Array(2,1,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,3,1,2,1,2,2,1,2,2,2,1,1,1,2,1,2,1,2,2,1,2,2,1,2,2,2,2,3,3,3,4,4,4,3,4,4,4,4,3,3,5,4,3,5,3,2,3,2,3,2,2,1,1,0,1,0,0,1,0,0,-1,-1,0,0,-1,0,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,-1,-1,-1,0,-1,-1,0,0,1,0,-1,0,-1,-1,0,0,-1,-1,0,0,0,-1,-1,-1,0,-1,-1,0,0,-1,0,0,-1,0,0,0,0,-1,0,-1,0,-1,-2,-1,-1,-1,-1,-2,-2,0,-2,-2,-2,-1,-1,-2,-2,-2,-1,-2,-1,-2,-2,-2,-1,-1,-1,-2,-1,-2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-2,-1,-1,-2,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,1,0,0,2,3,2,3,5,4,4,3,5,4,3,3,2,2,1,0,-1,-1,-2,-2,-2,-2,-3,-3,-3,-3,-3,-2,-5,-4,-4,-5,-3,-5,-4,-5,-5,-4,-2,-3,-2,-2,-1,0,3,8,13,16,14,8,2,-7,-12,-15,-16,-14,-11,-10,-6,-5,-5,-4,-4,-4,-4,-3,-2,-2,-3,-3,-4,-3,-4,-4,-3,-2,-4,-4,-4,-4,-4,-4,-3,-2,-4,-2,-2,-2,-3,-3,-3,-2,-4,-3,-2,-3,-3,-3,-2,-2,-1,-1,-1,-2,-1,0,-2,0,-1,0,1,0,-1,0,0,0,-2,-2,0,0,0,0,0,0,-1,-1,-2,1,-1,0,-1,-1,-1,-1,-1,0,0,-2,-2,-2,-2,-2,-2,-2,-2,-2,-3,-2,-2,-2,-3,-2,-2,-3,-2,-2,-2,-2,-2,-3,-2,-2,-3,-2,-2,-2,-2,-2,-2,-2,-1,-2,-1,-2,-1,-1,-2,-1,-1,-1,-1,-1,-1,-2,-2,-1,-3,-2,-2,-1,-1,-1,0,-2,-2,-3,-1,-2,-2,-1,-2,-2,-2,-2,-1,-1,-2,-2,-2,-2,-2,-2,0,-2,-2,-2,-2,-4,-1,-1,-3,-2,-1,0,0,0,1,1,1,2,3,5,2,2,1,2,1,2,1,0,0,-1,-2,-3,-4,-3,-4,-4,-4,-3,-4,-4,-2,-4,-4,-4,-4,-4,-4,-4,-3,-5,-3,-3,-3,-3,-2,-2,-3,0,0,5,11,16,16,12,6,-2,-11,-14,-17,-16,-14,-10,-8,-5,-4,-4,-3,-2,-3,-2,-3,-3,-2,-3,-2,-1,-1,-2,-3,-2,-1,-2,0,-1,-3,-1,-3,-1,-1,-1,-1,-1,0,-1,0,0,-2,0,0,0,-1,0,-1,-3,-1,-1,-2,0,-2,0,0,1,0,0,2,1,0,2,1,1,1,0,1,3,2,1,1,0,2,1,2,2,2,1,1,0,0,-1,0,1,0,0,-1,0,-1,-1,-1,-1,-1,0,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-2,-1,-1,0,-1,-1,-1,0,-1,-1,-1,-1,0,-1,-1,-1,-2,-1,-2,0,-2,-1,-2,-3,-4,-3,-4,-4,-3,-2,-1,0,0,0,1,0,0,0,0,0,1,1,1,2,1,1,3,3,4,8,11,16,19,20,15,8,2,-5,-10,-10,-9,-5,-4,-1,0,0,2,2,2,2,1,1,2,2,1,1,3,1,1,4,2,1,3,1,2,2,0,2,1,1,0,2,1,2,3,3,2,3,2,2,2,1,2,1,2,2,2,2,3,1,2,2,4,5,5,4,4,4,4,4,4,4,4,4,4,3,5,4,4,4,5,3,2,2,2,2,2,1,1,2,1,1,1,0,1,0,0,0,0,-1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,0,2,0,0,1,0,2,0,0,1,1,1,1,0,1,1,0,0,1,1,0,0,0,0,1,0,1,2,1,1,0,0,0,0,2,1,2,2,0,1,0,0,0,1,1,1,1,1,2,0,1,0,1,1,0,0,0,2,1,0,1,0,0,0,0,1,0,0,0,1,0,0,1,1,0,0,0,0,1,0,0,0,1,0,1,0,0,0,2,1,1,2,1,2,2,2,3,3,2,4,3,3,4,4,5,6,7,6,9,8,7,7,7,6,4,4,4,2,2,0,0,1,0,-1,0,0,0,0,0,-1,0,0,-2,0,0,0,0,0,0,0,0,-1,-1,-1,0,0,5,7,13,18,17,13,8,-1,-7,-12,-13,-12,-9,-6,-5,-4,-2,-2,-1,-1,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,-1,0,0,1,1,2,0,1,0,1,0,2,1,0,2,2,2,2,2,2,1,1,1,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,1,1,2,0,1,0,0,0,0,1,0,0,0,0,-1,0,-1,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,1,0,0,1,0,0,1,1,1,1,1,0,0,1,1,0,1,0,0,1,0,1,0,0,1,0,0,0,0,1,1,1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,1,1,1,1,1,0,0,2,1,2,2,3,3,4,4,4,6,5,5,5,4,3,3,3,2,2,2,0,0,0,-2,-2,-1,-3,-1,-3,-2,-2,-2,-2,-2,-2,-3,-4,-2,-2,-2,-2,-2,-2,-3,-3,-3,-2,0,2,4,9,13,17,17,10,4,-5,-12,-15,-16,-13,-10,-8,-7,-4,-4,-2,-3,-2,-1,-1,0,-3,-2,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,-1,0,0,0,-2,-1,-1,0,0,0,-1,0,0,-1,-1,-1,0,0,0,0,0,1,0,1,0,1,1,2,0,0,1,1,0,1,1,1,2,0,0,1,0,1,0,0,0,0,0,-1,0,0,-1,0,0,-2,-1,-1,-1,-2,-1,-2,-1,-3,-2,-2,-2,-2,-1,-2,-3,0,-4,-4,-3,-4,0,-2,-4,-1,-2,-3,-3,-4,-4,-4,-4,-2,-4,-3,-2,-4,-3,-3,-4,-4,-5,-4,-3,-2,-2,0,0,-1,-2,0,-2,-2,0,0,0,0,0,-1,1,1,0,2,5,7,13,17,19,15,9,3,-5,-12,-12,-11,-11,-8,-5,-4,-1,0,0,0,-1,0,0,-2,0,1,0,-1,0,0,1,1,0,0,0,0,1,1,0,1,1,0,0,1,1,0,0,0,0,0,0,1,0,-1,1,0,-1,1,0,1,1,1,1,2,3,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,3,4,1,1,1,1,0,-2,-2,0,0,0,0,-1,-1,-1,-2,0,-1,-2,-2,-2,-1,-1,-1,0,-2,0,-1,-2,-1,0,-1,-2,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,-1,0,1,2,0,1,0,0,0,0,0,0,2,2,0,1,0,2,0,0,2,0,0,-1,0,0,1,2,2,2,0,2,2,2,2,2,2,1,0,0,2,0,1,2,2,2,1,2,2,3,2,3,1,2,2,2,3,2,2,2,2,1,2,1,1,0,1,0,1,2,0,2,2,2,2,2,2,2,2,2,2,2,3,2,2,4,1,4,5,2,4,3,2,3,5,5,5,5,6,6,9,8,9,9,8,7,7,6,7,6,6,7,4,3,4,1,2,1,1,1,0,0,0,1,1,0,1,0,2,0,0,0,1,0,0,2,1,3,3,5,8,9,15,17,19,16,9,1,-5,-9,-10,-10,-7,-5,-5,0,1,0,0,1,1,1,1,1,2,2,2,2,2,2,2,2,1,2,2,2,1,2,2,2,4,3,3,2,3,2,4,3,2,2,2,3,3,5,5,3,4,4,3,4,4,4,4,5,5,5,5,6,5,5,4,6,6,5,6,6,5,7,5,6,7,6,6,6,7,6,8,8,6,5,7,5,6,7,5,6,4,6,5,6,5,5,5,6,6,5,4,4,5,4,5,5,5,5,6,6,5,6,5,6,5,6,5,7,6,7,8,9,6,7,7,7,8,8,7,8,7,8,8,8,8,6,7,8,7,6,7,6,7,6,6,5,6,5,6,6,6,6,6,6,5,7,6,8,7,8,8,8,9,9,10,10,11,12,12,11,11,12,11,9,10,8,8,6,6,6,6,4,4,2,4,3,1,4,2,1,2,1,1,0,1,1,1,1,2,1,2,1,1,1,3,3,3,4,7,9,16,19,22,19,15,6,-1,-7,-10,-9,-8,-6,-3,-2,0,2,1,1,2,1,1,2,3,4,2,1,2,3,1,1,2,3,1,1,2,1,2,3,2,4,3,3,2,3,3,2,2,2,3,2,4,3,3,4,4,3,4,3,4,4,2,4,3,4,2,3,5,4,5,5,4,4,4,5,5,5,5,3,6,4,3,4,4,4,3,4,3,1,2,1,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,-1,-1,0,-2,-3,-3,-1,-1,-2,-3,-2,-3,-4,-2,-3,-4,-5,-4,-3,-3,-1,-1,-1,-1,0,-1,1,0,0,0,0,0,-1,-1,1,0,0,1,2,6,10,15,16,17,12,5,-1,-8,-13,-13,-11,-10,-7,-5,-3,-1,-2,0,0,-1,0,0,-1,-1,-1,0,0,0,0,-1,0,0,0,0,0,-1,-1,-2,0,-1,-1,-1,-1,-1,-1,0,-1,0,0,0,0,0,0,0,0,-1,0,-2,-1,0,-1,1,1,0,1,1,2,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,-1,-1,-1,-1,-1,-2,-2,-2,-2,-3,-1,-2,-4,-4,-4,-4,-4,-4,-4,-4,-4,-4,-3,-4,-4,-4,-4,-4,-4,-4,-2,-4,-4,-4,-4,-2,-2,-4,-3,-3,-4,-3,-4,-2,-4,-2,-2,-3,-3,-2,-2,-3,-3,-3,-4,-4,-4,-4,-3,-4,-4,-3,-2,-3,-3,-3,-3,-3,-4,-3,-4,-3,-3,-3,-3,-3,-3,-4,-3,-3,-3,-3,-3,-4,-3,-3,-3,-3,-3,-2,-3,-3,-3,-4,-4,-3,-4,-3,-4,-4,-3,-4,-3,-4,-4,-3,-3,-3,-2,-3,-4,-4,-4,-1,-3,-3,-3,-4,-2,-2,-2,-2,-2,-1,-1,-1,-1,0,0,0,1,2,2,3,3,1,3,2,3,2,4,1,0,0,0,0,-1,-2,-2,-2,-2,-2,-3,-3,-3,-3,-4,-5,-4,-3,-3,-4,-3,-2,-3,-3,-3,-3,-4,-2,-2,-1,0,2,6,12,13,15,10,2,-5,-11,-14,-15,-14,-10,-9,-7,-4,-4,-2,-2,-3,0,-2,-2,-1,-1,-2,-1,-1,-1,-2,-2,-2,-2,-1,-1,0,-1,-2,-1,-1,-2,0,-1,0,-1,-1,-1,0,-1,0,0,0,0,-1,0,1,0,0,1,1,0,0,2,1,2,2,2,2,2,2,2,2,2,2,2,2,3,4,2,2,2,2,1,1,2,3,2,2,2,0,1,0,1,1,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,2,2,0,0,1,2,1,2,1,2,2,2,2,2,2,1,1,2,1,2,1,2,2,1,1,0,0,2,1,1,0,1,0,0,2,2,1,1,1,2,1,1,3,2,3,3,4,3,4,5,5,6,6,6,6,5,6,4,5,3,4,3,3,3,1,0,0,1,0,0,-1,0,-1,-1,-1,-1,0,-1,0,-1,-2,-1,-1,-1,-1,0,-1,-1,0,-1,1,1,5,11,14,17,17,13,6,-1,-9,-12,-14,-10,-9,-8,-4,-3,-1,-1,0,0,0,0,0,0,-1,0,-1,0,-1,0,2,0,0,0,0,0,0,0,1,0,-1,0,0,0,0,0,2,1,0,0,1,0,1,0,0,2,1,2,2,1,2,1,2,2,2,1,1,3,2,2,2,3,2,2,2,2,2,2,2,2,3,2,2,1,0,1,0,0,2,0,0,1,1,0,0,-1,0,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-2,-1,-1,-1,-1,-1,-1,-1,-1,-2,-1,-1,-1,-1,-2,-2,-3,-3,-3,-2,-2,-3,-3,-5,-3,-5,-5,-5,-5,-5,-4,-3,-3,-1,-1,-1,0,0,0,0,0,-1,0,-1,0,0,-1,-1,-1,-1,1,2,6,11,17,17,15,9,0,-7,-12,-13,-13,-10,-5,-5,-4,-2,-2,-1,-1,0,0,0,-1,-1,0,0,0,-1,-1,0,-1,0,0,0,0,-1,1,0,-1,0,0,0,-1,-1,0,0,0,-1,-1,-1,0,0,-1,0,-1,-1,0,0,-1,-1,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,0,0,1,0,1,0,0,-1,-1,-1,-2,-1,-1,-2,-2,-2,-2,-4,-2,-4,-3,-4,-5,-5,-3,-4,-4,-5,-5,-5,-5,-5,-5,-5,-5,-5,-3,-5,-5,-4,-4,-5,-4,-5,-3,-3,-4,-4,-3,-3,-3,-3,-4,-3,-4,-4,-3,-4,-3,-4,-3,-4,-3,-3,-3,-4,-3,-3,-2,-3,-4,-3,-3,-4,-3,-4,-3,-4,-4,-4,-4,-4,-4,-3,-3,-3,-4,-3,-4,-4,-2,-2,-4,-4,-4,-2,-2,-2,-2,-2,-4,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-4,-2,-2,-2,-2,-2,-3,-2,-2,-2,-3,-2,-2,-1,-2,-2,-2,-2,-1,-2,-1,0,-1,-2,-2,-1,-1,0,-1,0,-1,0,0,0,2,3,2,3,2,2,2,2,2,1,2,1,0,0,-1,-1,-1,-1,-1,-2,-2,-2,-4,-1,-2,-2,-2,-2,-2,-2,-4,-2,-3,-2,-2,-2,-4,-1,-2,-1,-1,0,2,7,10,15,13,9,3,-5,-11,-14,-13,-13,-9,-7,-5,-3,-4,-2,-2,-1,-2,-1,-1,0,-1,-1,0,-1,0,0,-2,-2,-1,0,-1,0,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,0,0,0,1,-1,1,0,0,0,2,2,1,2,2,0,1,2,1,2,1,1,2,2,2,2,2,1,2,3,2,2,2,3,3,2,2,3,2,2,2,2,2,2,2,1,1,0,1,1,1,1,0,1,1,1,0,0,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1,2,2,2,2,2,2,3,2,3,2,2,2,2,2,2,2,2,2,3,2,3,2,2,2,2,1,2,1,2,2,3,2,2,2,1,3,1,1,2,2,2,2,2,2,1,2,1,3,3,3,3,4,4,5,6,6,6,8,8,8,7,8,6,7,6,5,6,3,3,2,2,1,1,1,1,0,0,1,1,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,1,0,1,1,5,7,10,14,18,19,15,8,1,-6,-12,-11,-11,-8,-5,-3,-1,-1,0,0,1,0,0,1,1,1,1,1,1,0,0,0,1,0,1,2,0,1,1,2,0,2,1,0,1,1,1,1,1,3,0,2,2,1,3,3,3,2,2,2,3,3,4,3,4,4,4,4,4,4,4,3,5,4,5,5,4,5,3,3,4,4,4,2,3,4,3,2,2,2,2,2,1,1,1,2,2,2,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-2,-1,-4,-3,-2,-2,-1,-1,-1,0,1,0,1,0,1,1,0,0,0,1,0,0,0,0,1,5,5,10,15,19,19,14,8,0,-8,-13,-13,-10,-8,-5,-3,-2,-1,-1,0,0,1,0,0,0,1,0,1,0,1,1,0,0,2,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,-1,0,0,-1,0,0,1,1,1,0,2,0,2,2,2,2,2,1,2,1,1,1,3,1,2,2,1,1,1,0,1,0,0,0,0,0,-2,0,-2,-1,-1,-1,-2,-2,0,-2,-2,-2,-2,-2,-1,-1,-2,-1,-2,-2,-2,-2,-1,-2,-2,-2,-1,-2,-2,-1,-2,-2,-1,-1,0,0,-1,-2,-1,-2,0,-2,-2,-1,-1,0,-1,-2,-2,0,-2,-2,-1,0,-2,0,-1,-2,-1,0,-1,-1,-1,0,0,-1,0,-1,0,-1,-1,-1,0,0,0,-1,-1,0,-1,-1,0,-1,-1,0,-1,-1,0,0,-2,-1,0,0,0,-1,0,0,-1,-1,-1,-1,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,-1,0,0,-1,0,0,-1,0,-1,0,0,1,0,1,0,1,0,1,1,1,2,3,2,4,4,4,4,4,4,4,3,4,1,1,0,0,0,0,-1,0,-1,0,-3,0,-2,-2,-1,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,0,1,6,10,13,16,10,7,-2,-10,-13,-14,-13,-9,-6,-6,-3,-3,-2,-2,-2,-2,-2,-1,-2,-1,-2,-1,0,-1,-1,-1,-1,-1,0,0,-1,-1,-1,0,-1,-1,-1,-1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,2,1,1,2,2,1,2,2,2,2,2,2,3,2,1,4,2,2,2,2,1,1,1,1,0,1,1,0,0,0,0,1,0,-1,0,0,0,-1,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,2,2,0,0,1,0,1,0,0,0,0,0,0,0,0,1,1,2,1,1,2,2,2,1,2,1,2,2,0,1,2,0,1,2,2,1,1,1,2,1,1,1,0,1,1,2,2,2,2,2,2,2,2,3,3,3,3,5,8,6,8,8,8,8,8,8,7,6,6,6,4,4,3,1,1,1,1,1,0,0,0,0,-1,0,-1,0,0,0,-1,0,0,-1,0,0,-1,-1,0,0,0,0,2,5,11,15,17,16,12,5,-3,-8,-12,-12,-10,-8,-4,-3,-2,-1,-1,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,1,0,0,0,1,0,2,1,0,1,0,1,1,1,2,1,1,2,1,1,1,0,1,2,1,4,1,2,2,3,4,2,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,5,4,3,3,4,2,3,3,3,1,3,2,1,3,2,1,2,1,2,0,1,0,2,1,0,2,1,2,1,-1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,0,-2,-1,-1,-2,-2,-2,-2,-2,-1,-1,-1,0,0,0,1,1,1,1,1,0,0,1,2,2,2,2,2,3,3,6,10,15,19,21,20,15,6,0,-8,-9,-10,-8,-4,-4,-1,0,0,0,0,1,2,1,1,2,1,1,1,1,3,1,1,1,0,1,1,0,1,1,1,1,0,1,1,0,0,0,1,1,1,0,1,0,1,2,1,1,1,1,0,1,0,1,2,3,1,2,1,2,2,2,2,3,3,1,3,2,2,3,2,2,1,2,1,0,0,0,0,0,0,0,0,0,0,-2,-2,-1,0,-1,-1,-1,-2,-1,-1,-1,-1,-3,-1,-3,-2,-1,-3,-3,-1,-4,-2,-2,-2,-1,-3,-2,-2,-3,-3,-2,-2,-1,-1,-2,-1,-2,-3,-3,-3,-3,-2,-2,-4,-4,-3,-3,-3,-2,-3,-4,-4,-2,-4,-3,-3,-4,-4,-4,-4,-3,-4,-4,-4,-4,-4,-3,-1,-4,-2,-3,-3,-4,-4,-4,-4,-3,-4,-4,-4,-4,-4,-4,-4,-4,-4,-2,-3,-4,-2,-4,-2,-3,-4,-4,-4,-4,-4,-4,-3,-4,-4,-3,-4,-4,-2,-4,-3,-3,-4,-4,-4,-3,-4,-2,-3,-4,-4,-3,-4,-2,-3,-4,-2,-3,-3,-2,-2,-2,-2,-3,-2,-2,-1,-2,-1,0,-1,1,0,0,0,1,1,1,1,1,0,0,-1,0,0,-2,-3,-2,-5,-5,-4,-5,-4,-5,-5,-4,-6,-5,-6,-6,-6,-6,-5,-5,-6,-5,-6,-5,-5,-5,-3,-1,-1,1,3,8,12,12,7,2,-7,-14,-15,-17,-15,-12,-9,-8,-7,-8,-6,-4,-4,-4,-4,-4,-4,-3,-4,-3,-4,-4,-4,-4,-3,-2,-4,-4,-1,-3,-3,-3,-3,-2,-2,-3,-3,-2,-2,-2,-2,-2,-2,-2,-1,-1,-3,-1,-2,-1,-1,-2,-1,-1,-2,-1,-1,-1,-1,-1,0,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,-1,-2,-1,-1,-2,-2,-3,-3,-2,-2,-3,-3,-4,-3,-3,-4,-4,-5,-4,-4,-3,-3,-4,-2,-3,-3,-3,-2,-3,-2,-4,-2,-2,-2,-2,-1,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-1,-1,-2,-2,-2,-1,-1,-2,-1,-2,-3,-1,-2,-3,-3,-2,-2,-1,-3,-2,-1,-2,-3,-2,-3,-2,-2,-3,-3,-1,-2,-2,-2,-2,-2,-1,-1,-2,-1,0,0,0,1,1,3,3,3,3,1,3,1,2,1,0,0,0,0,-1,-2,-3,-4,-4,-3,-4,-4,-3,-5,-5,-4,-5,-3,-4,-4,-3,-3,-3,-2,-3,-4,-4,-2,-3,-2,-1,0,3,7,11,15,12,7,1,-8,-13,-16,-16,-14,-10,-8,-6,-4,-4,-2,-2,-3,-1,-3,-1,-2,-1,-2,-2,0,-2,-1,0,0,0,0,0,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,3,2,2,2,3,1,3,3,3,3,4,4,4,3,3,2,2,3,3,3,2,4,3,2,2,2,2,2,2,1,1,1,1,0,1,1,0,0,0,2,1,0,1,2,0,-1,0,1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,-1,-2,-1,-1,-1,-1,-3,-1,-2,-2,-3,-2,-2,0,-1,-1,0,0,0,1,1,0,2,0,0,0,0,2,1,2,2,2,2,5,7,10,14,20,22,18,12,3,-4,-10,-11,-9,-5,-2,-1,0,2,2,2,2,2,1,2,2,2,2,2,2,3,2,1,3,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,2,1,2,1,0,1,2,1,2,2,2,3,1,2,3,2,4,3,3,3,3,3,3,3,2,3,4,2,3,1,3,1,2,2,1,1,1,1,0,1,1,-1,0,0,1,0,1,0,0,0,0,0,-1,0,0,0,-2,0,0,0,-1,-2,-2,0,-1,-2,0,0,0,-1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,-1,0,-2,0,-1,0,-1,0,0,-2,0,0,0,0,-1,-1,-1,0,-2,-1,-1,-1,-1,0,0,0,-1,-1,-1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,1,2,2,3,4,4,4,4,4,4,4,4,3,4,3,2,1,0,0,-1,-1,-1,-4,-3,-2,-1,-4,-3,-3,-3,-4,-4,-3,-4,-5,-4,-3,-4,-3,-2,-2,-3,0,0,1,4,5,11,14,15,12,5,0,-8,-14,-15,-15,-12,-9,-7,-4,-4,-4,-4,-4,-3,-4,-2,-2,-1,-3,-3,-3,-3,-3,-3,-2,-2,-1,-2,-2,-2,-2,-2,-2,-1,-2,-2,-2,0,-2,-3,-2,-2,-2,-1,-2,-2,-1,-1,-2,-2,-2,-2,-1,-2,-2,-1,-2,0,0,-2,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,-1,-1,-1,-3,-3,-2,-1,-3,-2,-2,-2,-2,0,-3,0,-4,-2,-2,-2,-2,-2,-2,-2,-2,-2,-1,-2,-2,-2,0,-2,-2,-1,-1,-1,-1,-1,-2,-1,-2,-1,-1,0,-1,0,0,-1,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,0,0,-1,0,0,-1,0,0,-2,-1,0,-1,-1,-1,-1,0,-1,-1,-1,-1,0,-1,0,-1,0,0,0,1,2,1,1,3,3,2,3,5,3,3,4,4,3,2,2,1,0,0,0,0,-1,0,-1,-2,-2,-3,-1,-3,-3,-3,-2,-2,-1,-2,-2,-3,-1,-2,-3,-3,-2,-1,-2,-2,-1,0,3,7,10,14,15,10,7,0,-10,-13,-14,-11,-10,-9,-6,-4,-4,-3,-2,0,-1,0,0,0,-1,0,-2,0,-1,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,1,1,1,1,0,1,1,1,1,2,2,2,3,2,4,3,4,4,4,3,4,3,4,4,4,4,4,4,2,3,3,1,1,1,2,1,1,2,1,0,1,1,0,1,1,0,1,0,1,1,2,0,1,1,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-2,-1,-1,-2,-1,-2,-2,-1,0,1,1,1,2,3,3,2,1,1,1,1,2,2,3,3,2,4,4,4,7,9,15,19,22,20,15,8,-1,-6,-9,-9,-8,-4,-2,0,0,1,2,2,2,2,2,2,3,2,2,2,2,2,2,3,3,3,4,3,3,2,2,2,2,2,4,3,3,2,3,2,3,2,2,3,3,3,3,3,3,5,5,4,4,3,4,3,4,5,5,5,6,5,5,5,5,5,5,4,5,5,6,6,5,5,4,4,3,4,1,1,1,0,1,1,0,1,0,1,0,0,1,1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,-1,-1,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,-1,0,0,0,0,0,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,1,1,1,0,1,1,1,2,1,1,3,3,4,5,5,5,6,5,4,5,3,3,4,3,2,2,0,0,1,0,0,0,0,0,-2,-1,0,-1,-1,-2,-2,-2,-2,-3,-2,-2,-2,-2,-1,-2,-1,0,0,3,5,10,15,18,15,11,4,-5,-11,-14,-13,-13,-8,-7,-4,-4,-2,-1,-3,-2,0,-2,-1,-2,-1,-1,-2,-2,-3,-1,-1,-1,0,-2,-2,-2,0,-2,-2,0,-3,-2,-2,-2,-1,-1,-1,0,0,-3,-1,-1,0,-1,-1,-2,0,-2,-1,-2,0,0,-1,0,1,0,2,0,1,0,1,1,0,1,0,0,1,0,1,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,-1,-1,0,0,0,-1,-3,-1,0,-1,-1,0,-2,0,-2,-1,-1,-1,0,0,-2,0,-1,0,0,0,0,-2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,-1,-1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,2,1,3,2,1,3,4,4,4,4,4,4,4,4,4,3,2,0,0,0,-1,-2,-2,-2,-3,-4,-2,-2,-2,-2,-3,-4,-2,-4,-2,-3,-3,-3,-2,-4,-3,-4,-3,-3,-3,-1,0,1,7,11,14,15,10,6,-1,-8,-13,-14,-13,-11,-9,-7,-4,-4,-3,-3,-2,-2,-2,-1,-1,-2,-1,0,-2,0,-2,-1,0,0,0,-1,0,-1,-1,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,-1,0,0,1,2,0,0,0,1,0,1,1,1,1,1,2,2,2,2,2,2,2,2,1,1,1,0,0,0,0,0,0,0,1,-1,0,0,-1,0,0,0,0,0,0,-1,0,0,0,0,0,-2,-1,-2,-3,-1,-1,-1,-2,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-3,-2,-3,-4,-3,-3,-3,-3,-4,-4,-4,-4,-4,-4,-5,-3,-2,-3,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,4,7,13,16,18,15,11,3,-6,-10,-12,-12,-9,-5,-4,-1,0,0,0,1,1,2,0,0,1,0,1,1,1,0,0,1,1,0,1,1,1,0,1,0,1,2,2,1,0,0,0,2,2,0,0,1,0,0,1,0,1,0,3,1,2,2,1,1,2,2,2,2,2,2,3,4,2,3,2,3,3,2,2,2,3,2,2,1,1,1,1,0,0,0,-1,0,0,0,0,0,-1,0,-1,0,0,0,0,0,0,-1,0,-2,-1,-2,-2,-1,-1,0,0,-1,-1,-1,0,-2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,0,-1,-1,0,0,-1,0,-1,-1,0,-1,0,0,0,0,-1,0,0,0,0,0,0,-1,0,0,-1,0,-1,0,0,0,-1,-1,-1,0,0,0,0,0,0,0,0,0,1,1,1,2,2,3,4,4,5,4,4,4,5,4,5,3,3,3,1,2,0,0,0,-1,0,-1,-2,-1,-2,-2,-3,-2,-3,-3,-3,-2,-3,-4,-2,-2,-4,-2,-1,-2,-1,-1,0,1,5,7,13,17,17,13,7,-1,-9,-13,-14,-14,-10,-8,-7,-4,-4,-4,-3,-2,-3,-2,-2,-2,-1,-1,-1,-3,-1,-3,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-1,-1,-2,-2,-1,-2,-1,-1,-1,-1,-2,-1,-1,-1,-1,-1,0,-1,0,-1,-1,-2,-1,-2,0,0,0,0,0,1,1,1,0,-1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,-2,-1,0,-1,-2,-1,0,-2,-1,-1,-3,-2,-2,-2,-2,-2,-1,-1,-2,-2,-2,-2,-2,-2,-2,-2,-2,-3,-2,-3,-1,-1,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-1,-2,-2,-1,-1,-1,-2,-2,-1,-2,-2,0,-2,-1,-1,-1,-2,-1,0,-2,0,0,0,0,-1,-2,-1,-1,-2,-3,-2,-2,0,-1,-1,-1,-1,0,-2,-2,-1,-1,0,-1,0,0,0,0,0,2,2,2,2,3,5,3,3,4,3,2,2,2,0,1,0,0,-1,-2,-2,-2,-3,-2,-4,-3,-3,-4,-4,-4,-3,-4,-4,-3,-4,-4,-3,-4,-3,-3,-2,-3,0,-1,-1,1,4,9,11,15,15,10,3,-6,-11,-15,-15,-12,-10,-7,-5,-4,-3,-2,-1,-1,-2,0,-1,-2,-2,-2,-1,-1,-2,0,0,0,1,0,0,0,0,0,0,-1,0,0,0,-1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2,2,1,2,1,2,1,2,1,1,1,2,1,2,2,1,2,2,1,1,1,1,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,-1,0,1,-1,0,0,0,0,0,1,0,0,0,0,-1,0,0,0,-1,-1,-1,-1,-1,-2,-2,-2,-2,-1,-2,-2,-2,-2,-2,-1,0,0,1,0,2,1,2,2,2,2,2,2,1,1,2,2,2,3,2,5,8,11,15,20,20,15,8,0,-6,-10,-10,-8,-5,-2,0,0,1,1,1,1,2,1,1,1,1,3,1,2,2,2,3,3,3,3,4,3,4,3,3,3,2,2,3,3,3,4,3,3,3,4,4,2,2,3,3,3,2,4,4,4,4,4,4,4,4,6,4,5,5,5,4,6,4,5,5,4,4,4,6,4,4,4,4,3,4,3,3,4,2,1,2,2,2,2,1,1,1,0,1,0,1,1,0,0,0,2,1,0,0,0,1,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,2,2,1,1,2,1,2,2,0,2,2,2,0,2,0,1,1,2,1,1,0,1,1,2,1,1,0,1,1,1,1,1,0,1,0,0,2,2,2,2,0,0,1,0,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,3,3,2,2,3,4,3,2,4,2,3,4,6,6,6,8,7,8,8,8,8,8,6,7,6,4,4,3,1,1,1,2,1,0,1,0,0,0,0,-1,-1,-1,-1,0,-1,0,-1,-1,0,-1,0,0,1,1,2,6,11,15,20,19,13,7,0,-8,-13,-12,-12,-8,-5,-3,-2,-1,-2,0,0,-1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,2,0,0,0,1,0,1,0,1,1,3,1,0,0,0,0,0,2,0,0,0,0,-1,1,1,0,0,0,0,0,0,-1,0,-1,-1,0,-1,0,0,0,0,-1,-1,0,-1,0,0,-2,-1,-1,0,-1,-1,-1,-1,-2,-2,-1,0,-1,0,-1,0,-1,-1,-1,0,-1,-1,0,0,-1,0,0,0,0,0,0,0,-1,0,0,-2,-1,-2,-2,-2,-1,0,-2,-1,-2,-1,-1,-2,-1,-1,-1,-2,-2,-1,-2,-2,0,-2,-1,-2,-1,-1,-1,-1,-1,-1,-1,0,0,1,1,1,1,2,2,3,3,3,2,3,2,3,2,1,1,0,0,-1,-1,-2,-3,-2,-2,-2,-2,-2,-2,-4,-4,-4,-4,-4,-4,-4,-4,-4,-4,-5,-3,-4,-4,-3,-1,-1,0,3,6,12,15,14,9,3,-3,-12,-17,-17,-15,-11,-9,-7,-4,-4,-3,-2,-1,-1,-2,-2,-2,-2,-1,-2,-2,-2,-2,-2,-2,-2,-1,-1,-1,-1,-1,0,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,2,2,2,2,1,2,1,1,0,2,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,0,-1,0,0,0,0,0,-1,-1,-1,-2,0,0,0,0,0,0,0,-2,-1,-2,-2,-2,-2,0,-3,-2,-3,-2,-2,-3,-3,-3,-4,-3,-2,-3,-3,-2,-2,-1,0,0,1,0,1,0,0,0,0,1,0,0,0,1,1,2,2,4,8,11,16,19,16,10,3,-5,-10,-12,-10,-8,-5,-3,-3,-1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2,0,1,0,2,1,0,1,0,1,1,0,1,0,0,0,1,2,0,0,3,2,1,3,0,3,1,2,1,2,2,4,4,3,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,2,3,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,-1,-1,0,-1,-1,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-2,-1,0,0,0,-1,-1,0,0,0,0,0,0,-1,0,-2,0,0,0,0,0,1,-1,0,0,-1,-2,-1,0,-1,-1,-2,-2,0,-1,-2,0,-2,-1,-2,-2,-2,-1,-2,-2,-2,-1,-2,-2,-1,-2,-2,-2,-2,-1,-1,-1,-1,-2,-1,-1,0,-1,0,-1,0,0,0,1,1,1,1,2,3,4,4,4,4,4,4,3,2,1,1,2,0,0,0,-2,-2,-2,-2,-2,-2,-4,-4,-2,-2,-4,-4,-3,-4,-3,-4,-2,-2,-3,-2,-2,-3,-2,-1,0,1,5,8,15,17,15,10,3,-6,-12,-14,-13,-12,-10,-6,-6,-3,-2,-3,-3,-2,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,0,-1,-1,-1,0,-1,0,-1,-1,0,-1,-1,0,-1,0,0,-1,0,0,0,0,0,0,0,-1,0,0,0,1,0,0,0,0,1,0,1,1,0,1,0,1,2,0,1,1,0,1,0,0,0,0,1,0,0,1,1,0,1,0,0,0,0,0,0,0,-1,0,0,0,0,-1,0,-1,-1,-3,-2,-1,-2,0,-2,-2,0,-1,-1,-1,0,0,0,-1,0,-1,-2,0,-1,-1,-1,-1,-1,-1,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,-2,-1,-1,-1,0,0,-1,0,0,0,-1,0,-2,0,0,0,1,0,0,0,1,0,0,1,1,2,2,2,2,5,2,3,4,2,2,2,1,1,1,0,-1,-1,-1,-2,-1,-2,-2,-3,-3,-3,-2,-4,-4,-4,-5,-5,-5,-3,-3,-3,-5,-4,-4,-4,-4,-3,-2,-2,-1,1,4,10,14,15,11,5,-1,-10,-14,-16,-17,-15,-9,-9,-7,-5,-5,-5,-4,-4,-4,-3,-2,-3,-2,-3,-3,-1,-3,-2,-3,-2,-3,-2,-3,-3,-2,-2,-3,-4,-1,-3,-4,-3,-2,-3,0,-2,-1,-1,0,0,-1,-1,-1,0,0,-1,0,0,0,0,-1,1,1,0,1,1,1,1,0,0,0,2,1,0,1,0,0,0,0,2,0,0,0,0,-1,0,-1,-1,0,-1,-1,-1,-1,0,-2,-1,-1,-2,-2,-2,-1,-2,-2,-3,-3,-3,-3,-4,-3,-3,-3,-2,-3,-3,-2,-3,-4,-4,-4,-3,-4,-4,-4,-4,-4,-6,-6,-4,-4,-5,-4,-5,-6,-6,-6,-4,-5,-4,-4,-2,-1,-2,-2,-2,-1,-1,-2,-2,-2,0,-1,-2,-2,0,0,0,1,3,7,11,16,17,12,6,-1,-10,-14,-14,-12,-11,-5,-5,-3,-1,-2,-1,0,-1,0,0,0,0,0,0,-1,0,-1,0,0,-1,0,-1,0,0,0,0,0,0,0,0,-1,0,-1,0,0,-1,0,0,0,0,0,0,0,0,1,0,0,1,2,1,1,1,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,-1,0,-1,0,0,-1,-1,-1,-1,-1,-1,-2,-1,-2,-2,-2,-2,-2,-2,-2,-2,-1,-2,-1,-2,-2,-1,-1,0,0,0,-1,0,-1,0,0,-1,-1,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,-1,-1,0,-1,0,0,0,0,0,0,0,0,-1,0,0,0,0,-1,-1,0,1,0,1,0,0,0,-1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,2,0,2,0,1,1,2,2,1,1,2,1,1,1,0,1,2,1,0,1,0,2,2,2,3,3,3,4,2,4,4,3,2,4,4,4,6,6,5,8,6,8,6,7,7,6,6,6,5,5,2,3,2,2,0,1,0,1,0,0,0,0,-1,0,0,0,-1,-1,-1,-1,0,0,-1,0,0,-1,1,2,4,5,10,13,16,19,17,10,2,-6,-11,-12,-12,-8,-6,-4,-1,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,1,0,3,2,0,1,2,3,2,2,0,1,2,2,2,2,2,0,2,1,2,3,2,3,2,3,3,1,3,2,2,2,2,2,2,3,2,1,1,1,2,1,2,1,1,1,1,1,2,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,1,2,1,1,0,1,1,1,0,2,0,0,0,0,2,2,1,0,0,2,1,0,1,0,1,0,2,1,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,0,0,1,1,0,2,2,3,2,3,4,4,3,5,5,4,6,6,6,6,4,5,2,2,1,1,1,0,0,0,-2,-2,-2,-1,-2,-1,-2,-3,-3,-2,-1,-1,-2,-1,-1,-1,-1,-1,-2,-1,-1,-2,-1,0,1,3,6,12,15,16,14,6,-2,-9,-14,-14,-13,-11,-8,-5,-4,-2,-1,-2,-1,-1,-1,0,-2,-1,-1,0,-1,-1,-1,-1,0,0,0,0,0,0,0,0,0,-1,0,1,0,0,1,0,1,0,0,0,0,1,1,0,1,0,0,1,1,0,1,2,1,3,1,2,3,1,2,1,2,3,1,2,1,3,3,2,0,2,2,1,1,1,1,1,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-2,-2,-3,-3,-1,-3,-2,-1,-3,-1,-3,-3,-1,-2,-3,-2,-2,-3,-2,-2,-2,-2,-2,-3,-3,-3,-3,-4,-4,-2,-4,-5,-5,-3,-4,-4,-4,-3,-2,-2,-1,0,-2,0,0,0,0,0,1,0,-1,0,0,1,0,0,1,4,7,12,15,18,16,10,3,-5,-11,-14,-11,-10,-6,-5,-4,0,-2,0,0,1,0,0,1,1,1,-1,0,-1,-1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,0,0,1,1,0,1,1,1,1,1,1,0,1,1,0,0,1,1,1,1,1,1,2,2,3,2,2,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0,-1,-1,-1,-2,-2,-2,0,-1,-2,-3,-2,-2,-2,-2,-3,-3,-4,-4,-4,-3,-4,-2,-3,-2,-2,-2,-2,-2,-2,-2,-2,-1,-1,-2,-2,-1,-2,0,0,-2,-1,0,-1,-1,0,-1,0,-1,-2,-1,0,0,0,-2,-2,-2,0,-2,-1,-2,-2,-1,-1,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-1,0,0,-1,0,-1,0,0,-2,0,0,-1,0,-2,0,-1,0,0,-1,0,0,0,-1,0,0,0,0,0,0,-1,-1,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,3,0,3,2,2,2,4,3,4,7,5,6,7,6,6,5,4,6,3,4,2,2,2,1,0,0,-1,0,-1,0,0,0,0,0,-1,0,0,0,0,-1,0,0,-1,-1,0,0,0,-1,2,5,8,13,16,18,13,8,0,-8,-12,-15,-12,-9,-7,-4,-2,-3,-1,-1,0,-1,0,-1,0,-1,0,0,-1,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,1,0,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,2,1,0,3,2,2,2,2,2,2,2,2,2,2,1,2,2,2,3,2,1,1,0,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,1,1,0,1,1,1,2,1,0,2,2,1,0,1,1,0,2,0,0,1,1,2,2,1,2,1,0,2,1,0,0,1,1,1,1,2,2,3,2,2,2,2,2,3,3,3,5,4,5,6,7,7,5,5,5,6,5,5,4,2,2,1,1,0,0,0,0,0,1,0,0,-2,-1,-2,-2,-1,-2,-2,-2,-1,-1,-2,-2,-1,-2,-2,-1,0,0,2,5,9,15,17,16,11,6,-4,-10,-13,-13,-12,-9,-7,-6,-3,-2,-2,0,-1,-1,0,-1,-1,0,-1,0,0,-1,0,0,-1,1,-1,0,0,-1,0,1,0,0,0,0,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,3,1,2,2,1,3,1,2,2,3,2,2,2,3,2,3,2,2,2,3,1,1,1,1,0,1,1,1,0,0,0,0,0,-1,0,-1,0,-1,0,-1,0,0,0,0,0,0,-1,-1,-1,-1,0,-1,0,-1,-1,-1,-1,-1,-1,-3,-1,-1,-4,-3,-3,-3,-4,-3,-4,-4,-4,-4,-4,-2,-2,-2,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,3,4,7,11,15,19,18,13,5,-2,-10,-11,-12,-8,-6,-5,-4,-1,0,0,0,0,1,2,1,0,2,2,0,1,1,0,0,1,0,1,1,2,2,0,1,1,2,0,0,1,1,0,1,0,2,0,1,0,0,0,1,1,0,1,2,1,1,2,1,1,1,2,2,2,2,1,1,1,1,1,2,3,3,2,2,2,2,0,1,1,0,1,0,-1,-1,-2,-1,0,-1,-1,-1,-1,-1,-1,-2,-1,-1,-2,-3,-1,-1,-1,-2,-1,-2,-2,-2,0,-1,-1,-1,-1,-2,0,0,-2,-2,-2,0,0,-1,0,-1,-1,0,-1,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,-1,0,0,0,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,0,-1,0,-1,-1,-1,0,-1,-1,0,-1,0,-1,0,0,0,-1,0,-1,0,0,0,0,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,-1,0,0,-1,0,-1,-1,0,0,0,0,-1,0,0,0,-1,0,0,0,0,0,0,1,0,0,0,2,1,1,1,1,1,0,2,2,2,3,2,4,5,7,6,6,6,6,5,6,4,5,3,2,1,2,2,0,0,-1,0,0,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,0,-1,1,2,4,9,13,16,17,14,8,1,-7,-11,-12,-11,-8,-6,-3,-2,0,0,0,0,0,0,1,0,1,1,0,1,1,0,2,0,1,1,2,2,2,1,1,2,1,2,1,1,1,1,1,1,1,1,2,2,3,2,2,2,2,2,3,2,3,3,3,4,4,3,4,5,4,4,5,4,3,5,2,4,3,4,3,5,4,4,3,5,5,4,4,4,4,2,3,3,3,2,3,2,3,3,3,1,3,2,1,1,0,1,0,1,2,2,2,2,2,1,3,2,2,1,1,2,3,2,4,3,3,2,4,3,2,3,2,3,2,3,2,2,2,3,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,4,2,4,3,3,3,4,5,6,6,6,7,7,7,7,8,7,7,8,7,7,5,5,4,4,2,2,2,0,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,5,9,13,18,19,16,11,2,-5,-10,-14,-13,-10,-7,-5,-2,-1,-1,-1,0,0,0,0,0,-1,0,-1,0,0,0,0,0,-1,0,0,1,0,1,0,0,0,1,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,1,1,2,1,1,2,3,0,2,1,2,4,2,2,1,2,2,2,2,2,2,1,0,2,0,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,-1,0,0,0,-1,-1,0,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-2,-1,-2,-2,-2,-2,-2,-2,-2,-3,-3,-3,-2,-4,-4,-4,-4,-3,-2,-2,-1,-1,-1,0,0,0,-1,0,0,0,1,0,0,0,0,0,0,0,3,6,11,16,19,18,12,4,-5,-11,-12,-13,-9,-7,-4,-2,-1,-1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,2,1,0,0,1,0,0,0,0,0,-1,0,0,0,0,-3,-2,-2,-2,-2,-2,-2,-2,-3,-3,-3,-4,-2,-3,-2,-3,-3,-4,-2,-2,-3,-2,-2,-2,-3,-3,-4,-3,-3,-4,-1,-2,-3,0,-3,-3,-2,-3,-3,-2,-2,-2,-2,-2,-1,-2,-3,-3,-2,-1,-2,-2,-1,-2,-1,-2,-3,-2,-2,-1,0,-2,-2,-2,-2,-2,-3,-1,-1,-1,-2,-2,-1,-2,-2,-2,-2,-2,-2,-2,-2,-3,-3,-2,-4,-2,-2,-2,-3,-3,-3,-2,-2,-1,-2,-2,-2,-1,-1,-2,-2,-2,-2,-1,-1,-1,-2,-1,-3,-3,-3,-1,-2,-2,-2,-1,-2,-2,-2,-2,-2,-2,-2,-3,-2,-2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,1,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,-1,-1,-1,-1,-3,-3,-3,-2,-2,-3,-3,-3,-2,-3,-3,-4,-3,-3,-3,-3,-2,-3,-3,-2,-1,0,3,4,9,13,17,14,10,2,-6,-11,-13,-14,-11,-10,-5,-5,-4,-2,-2,-2,-1,-1,0,-2,-1,-1,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,1,0,1,1,2,1,2,2,1,2,2,2,1,2,2,2,2,2,2,1,0,1,1,0,1,1,1,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,-1,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,1,1,1,1,0,1,0,1,1,1,2,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,2,0,2,0,1,1,2,2,2,4,5,6,4,6,6,6,5,6,4,4,5,3,4,1,1,1,0,0,0,-1,-1,-1,-2,-2,-2,-2,-1,-1,-1,-2,-2,-1,-1,-1,-2,-2,-1,-2,-2,-1,-1,1,2,6,11,16,18,14,9,1,-9,-12,-15,-15,-12,-9,-6,-5,-2,-1,-2,-1,-1,-1,-1,-2,-1,-2,0,-1,-1,0,-1,0,-1,0,-1,0,-1,0,0,0,-1,0,-1,0,0,0,-1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,2,0,2,1,0,1,2,1,1,1,1,2,2,2,1,0,0,1,0,0,0,-1,-1,-1,0,-1,0,0,-2,-1,0,-1,-1,-3,-2,-1,-2,0,-2,0,-2,-3,-3,-2,-4,-2,-3,-2,-1,-2,-2,-3,-3,-4,-3,-2,-4,-2,-3,-3,-3,-4,-5,-5,-5,-5,-5,-4,-4,-5,-4,-5,-4,-4,-5,-4,-4,-2,-1,-3,0,0,0,0,-1,-2,0,-2,-1,0,-1,-2,0,0,1,4,9,12,17,19,13,7,0,-9,-14,-15,-13,-10,-8,-5,-3,-1,-2,-1,0,-2,0,0,-1,0,0,-1,0,0,0,0,0,-1,0,0,-1,-1,0,-2,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,-1,0,0,-1,-1,-1,-2,-1,-2,-2,-2,-2,-2,-2,-2,-1,-2,-2,-2,-2,-2,-2,-2,-2,-3,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-1,-1,-1,-1,-2,-1,-2,-2,-2,-2,-2,-2,-2,-1,-2,-1,-1,0,-1,-1,-2,-2,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,0,0,-1,-1,0,-1,0,0,-1,-1,0,-1,-1,-1,0,0,0,0,0,-1,0,0,0,0,0,0,-1,-1,-1,0,0,0,0,0,0,-1,0,0,-1,-1,0,0,0,0,0,1,0,0,2,1,2,1,0,2,2,2,2,2,2,3,2,3,5,7,6,7,8,8,7,6,6,3,4,2,2,1,1,0,0,0,0,-1,-1,0,-1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,-1,0,1,2,6,10,15,18,18,15,8,0,-7,-12,-13,-10,-9,-6,-4,-3,-1,-1,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,0,2,0,0,0,1,0,1,1,0,1,1,1,2,1,2,2,3,2,3,3,2,3,3,4,4,4,3,2,4,3,2,2,2,2,2,2,2,3,2,2,3,1,2,3,3,1,1,1,0,2,1,3,2,1,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,1,2,1,1,1,2,1,2,1,1,2,0,2,0,2,1,1,1,1,1,1,1,3,1,2,2,1,1,1,1,3,1,0,3,1,2,2,3,0,1,1,1,0,1,1,1,2,1,1,1,2,1,2,2,2,2,3,2,4,5,6,6,6,7,6,7,7,5,5,5,5,4,3,4,1,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,-1,-1,-1,0,0,-2,0,-2,0,0,0,0,1,4,7,12,17,19,16,10,2,-5,-13,-14,-13,-10,-8,-5,-5,-1,-1,0,-2,-1,0,-2,-1,-1,0,0,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,2,1,0,2,1,2,1,2,1,2,1,1,2,1,3,3,2,2,2,2,1,1,1,1,1,0,0,-1,0,0,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,0,-2,-2,-1,-1,-1,-1,-2,-2,-1,-3,-2,-3,-3,-4,-3,-5,-3,-4,-2,-4,-4,-4,-2,-1,-1,0,1,0,-1,-1,0,-1,0,0,0,0,-1,0,0,0,2,2,5,9,14,16,18,14,7,-2,-8,-11,-12,-11,-8,-6,-4,-2,-1,0,0,-1,0,0,-1,0,0,0,-1,-1,0,0,-1,0,0,1,0,0,-1,-1,-1,0,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,0,-1,-1,0,-1,0,0,0,0,0,0,0,1,0,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,0,0,-1,-1,0,-1,-2,-2,-1,-3,-1,-2,-1,-2,-2,-2,-1,-4,-3,-3,-3,-2,-3,-3,-4,-2,-3,-5,-3,-2,-3,-3,-4,-3,-2,-3,-2,-2,-2,-2,-2,-2,-1,-3,0,0,-1,-1,-1,-1,-1,-1,-2,-1,-1,-1,-2,-2,0,-2,-1,-1,-1,0,-1,-1,0,-2,-2,-2,-1,0,-2,-1,-1,0,-2,0,-1,-2,-1,-2,0,-2,0,-2,-1,0,0,-2,-1,0,0,-1,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,1,0,0,0,0,1,1,1,2,1,2,4,3,5,5,6,7,5,5,5,4,4,4,4,3,3,1,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,-1,-1,-1,-2,-1,-1,0,0,0,0,1,4,9,14,17,18,13,7,-1,-7,-12,-13,-12,-10,-8,-5,-2,-2,-2,0,1,0,0,0,-1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,1,0,1,0,0,0,1,1,-1,0,1,0,0,0,0,1,1,0,1,0,1,1,2,2,1,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,0,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,1,1,1,0,0,0,1,1,1,0,1,1,2,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,1,1,1,1,1,1,2,2,1,1,1,1,2,1,2,2,5,2,5,5,5,6,6,5,5,5,6,4,5,4,4,3,3,2,0,0,0,0,0,0,-1,-1,-1,0,-2,-2,-2,-1,0,-3,-1,0,0,-1,-1,0,-1,-1,0,0,1,3,6,12,16,19,17,12,4,-5,-11,-13,-13,-11,-9,-6,-4,-3,-3,-1,0,-1,0,-1,-1,-1,0,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,1,0,1,1,1,2,2,0,0,1,2,1,2,2,1,1,2,2,2,3,2,2,2,2,2,3,0,1,1,0,1,1,1,0,1,0,0,0,-1,0,0,0,0,0,0,-1,0,-3,-1,-1,-1,-1,-2,0,-2,-1,-1,-2,-2,-2,-2,-2,-1,-1,-3,-1,-2,-3,-2,-2,-4,-3,-4,-4,-4,-4,-4,-4,-3,-5,-3,-4,-4,-2,-2,-1,0,-1,-1,0,-1,0,-1,0,0,0,0,0,0,0,1,0,4,6,10,15,17,17,12,4,-3,-10,-12,-15,-10,-7,-6,-4,-1,-2,-1,-1,0,0,0,-1,-1,0,0,-1,0,-1,0,-1,0,0,0,-1,0,0,-1,-1,0,0,0,0,0,-1,-1,-1,-2,0,-1,0,-1,-1,-1,-2,0,0,-1,0,-1,-1,-1,0,-1,0,-1,0,0,0,1,0,0,1,0,1,0,0,0,0,0,0,0,-1,0,-1,-1,-2,-2,-1,-2,-1,-2,-2,-2,-2,-2,-4,-4,-3,-3,-4,-5,-3,-4,-3,-3,-3,-2,-3,-4,-2,-4,-3,-3,-4,-2,-3,-3,-1,-1,-3,-2,-1,-2,-1,-2,-3,-1,-3,-2,-1,-1,-1,-1,-1,-1,-1,-1,-3,-1,-2,-2,-1,-2,-1,-1,-2,-2,-1,-2,-3,-2,-2,-2,-2,-2,-2,-2,-1,-2,-2,-2,-2,-1,-1,-1,-1,-2,-1,-1,-1,-1,-1,-2,-1,-2,-1,-2,-3,-1,-2,-2,-1,-1,-1,-1,-2,-1,-2,-1,-2,-1,-1,-2,-2,-3,-1,-2,-4,-2,-2,-4,-2,-3,-3,-1,-3,-1,-1,-1,-3,-1,-1,-1,-3,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-2,-1,-1,0,0,0,1,1,1,2,3,5,4,5,4,4,4,2,2,2,1,2,1,0,-1,0,-2,0,-1,-2,-2,-3,-3,-2,-4,-4,-4,-3,-4,-3,-2,-3,-3,-2,-2,-1,-2,-2,-1,-1,2,6,9,14,15,16,11,4,-6,-11,-13,-13,-12,-8,-6,-4,-4,-2,-3,-2,-3,-2,-2,0,-1,-2,0,-1,-1,0,0,-1,0,0,0,-1,0,-1,0,0,0,0,0,0,-1,0,0,0,-1,0,-1,0,0,0,0,0,0,0,0,1,0,0,2,1,1,1,3,2,1,2,2,1,1,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1,2,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,2,0,0,1,0,1,1,1,0,0,2,2,2,1,2,1,2,2,2,2,2,2,1,2,2,2,2,1,2,2,1,2,3,1,2,2,2,2,1,2,2,0,2,2,1,1,3,1,2,0,1,1,1,2,1,0,1,1,2,1,2,2,2,3,2,1,2,3,3,4,5,4,6,5,7,6,7,7,7,6,6,7,6,4,4,2,3,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,-1,-1,0,-1,1,-1,0,0,1,2,5,11,15,20,20,15,7,0,-8,-12,-13,-12,-9,-6,-4,-2,-1,-1,0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,2,0,1,2,2,0,1,1,2,2,1,3,1,1,1,1,1,2,1,2,1,1,2,2,3,2,3,2,4,3,3,3,4,4,4,3,4,3,5,4,3,3,4,5,5,5,4,4,3,3,4,4,2,4,2,3,2,2,1,2,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,-1,0,-1,-1,0,0,0,0,-1,-1,0,-1,0,-1,0,-1,0,0,-1,-2,-3,-2,-2,-3,-1,-2,-3,-4,-4,-4,-3,-2,-1,0,-1,1,1,0,0,0,0,0,0,0,1,1,0,1,1,2,5,6,10,17,19,21,16,7,0,-7,-11,-11,-9,-6,-4,-3,0,0,0,0,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,2,1,3,2,2,2,4,3,4,4,4,2,3,2,2,4,3,3,2,3,3,2,2,2,1,0,1,0,0,1,0,0,0,0,0,-1,-1,0,-1,-1,0,-1,-1,-1,-2,0,-2,0,-1,-3,-2,-3,-4,-4,-4,-4,-5,-4,-5,-5,-5,-5,-5,-5,-5,-5,-5,-4,-5,-4,-5,-5,-4,-5,-4,-5,-5,-5,-5,-6,-5,-5,-5,-5,-5,-5,-6,-4,-5,-5,-4,-5,-5,-5,-5,-5,-4,-5,-6,-5,-5,-5,-6,-6,-5,-5,-5,-5,-5,-5,-5,-4,-5,-6,-5,-5,-5,-6,-4,-5,-4,-4,-4,-4,-4,-5,-5,-5,-3,-5,-4,-5,-4,-2,-5,-4,-3,-5,-5,-5,-4,-5,-5,-5,-4,-5,-3,-5,-5,-4,-4,-3,-3,-5,-5,-4,-4,-4,-4,-4,-4,-3,-3,-4,-3,-4,-3,-4,-2,-4,-2,-3,-1,-1,-2,0,0,0,1,0,3,3,3,4,2,2,2,1,2,0,0,0,0,-1,-2,-3,-3,-3,-4,-4,-4,-4,-4,-3,-3,-4,-4,-4,-5,-4,-4,-4,-4,-4,-4,-4,-3,-2,-2,0,2,7,11,15,15,10,4,-4,-12,-15,-16,-14,-10,-7,-7,-5,-4,-2,-3,-2,-1,-2,-1,-3,-2,-2,-2,-2,-1,-1,-2,-2,-1,-2,0,0,-3,-1,0,-1,0,-1,0,-1,-2,0,-1,0,0,0,-2,0,0,-1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1,0,0,0,1,0,0,1,1,0,0,0,0,0,1,0,0,0,1,0,0,-2,0,-1,0,1,0,-1,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,1,1,1,1,0,2,1,1,1,1,1,1,1,2,1,2,2,1,1,2,1,1,1,1,1,2,2,2,1,1,2,1,1,0,1,0,0,0,0,0,0,2,0,0,0,0,2,1,1,1,1,2,0,1,2,2,1,2,2,5,5,6,6,6,6,6,6,6,5,4,5,3,3,1,1,0,-1,0,-1,-1,-2,-2,-2,-1,-2,-3,-2,-2,-3,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-1,0,2,5,9,14,18,18,12,6,-2,-9,-13,-15,-13,-9,-8,-5,-3,-4,-1,0,0,-1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,1,1,0,1,1,0,1,0,1,1,2,1,2,2,1,3,2,2,2,3,3,3,5,4,3,3,2,3,4,5,5,4,4,4,4,3,4,2,3,3,2,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,-1,-2,0,-1,-2,-2,-3,-2,-1,0,0,1,1,3,3,2,3,2,2,2,1,1,2,1,1,1,2,3,3,6,8,12,18,21,21,15,9,0,-6,-9,-10,-7,-5,-2,0,0,1,2,4,3,3,3,2,1,2,2,2,2,4,4,2,3,2,4,2,1,2,2,1,2,2,2,2,1,1,1,2,1,2,2,2,2,2,3,2,1,2,2,2,3,2,2,3,3,3,3,3,3,3,3,3,5,3,2,3,3,3,3,5,5,3,3,2,2,2,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,-1,-1,-2,0,-1,0,0,-1,0,-2,0,-2,0,-1,-2,-1,0,0,-1,-1,-1,0,-1,-1,-1,0,0,0,-1,0,0,1,0,0,-1,0,-1,0,0,0,1,0,0,0,-2,-1,0,-2,0,0,0,-2,0,0,-1,-2,0,0,0,0,-1,0,0,-2,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,0,-2,0,-1,0,0,0,-1,-1,0,0,0,-2,0,0,0,-1,0,0,0,0,-2,0,-1,-1,0,0,0,0,0,0,0,0,-1,0,0,0,-1,-1,-1,-3,-1,-1,-1,-1,0,-1,0,0,0,0,0,0,0,0,0,0,0,1,0,2,3,2,5,3,4,5,4,4,4,4,3,2,2,2,1,0,0,-1,0,0,-1,-1,-1,-1,-2,-2,-4,-2,-3,-3,-2,-3,-2,-3,-2,-2,-3,-1,-2,-2,-1,-1,3,4,9,14,16,15,10,2,-5,-10,-15,-15,-12,-9,-7,-6,-4,-2,-3,-2,-2,-2,-1,-2,-1,-2,-2,-1,-3,-2,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,0,-1,-2,-2,-1,-3,0,-3,-2,0,-1,0,-2,0,0,-1,-1,0,0,0,0,0,0,0,1,0,2,1,1,1,0,0,1,1,0,1,0,1,1,0,1,1,1,1,0,0,0,0,-1,0,0,0,0,-1,0,0,0,0,-1,-1,0,0,0,0,-2,0,0,0,-1,0,0,0,-1,0,0,0,0,0,0,-1,0,0,0,1,0,1,1,1,0,1,2,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,1,2,1,3,2,0,2,2,2,3,4,5,6,7,6,7,5,6,5,6,4,4,3,2,2,1,1,0,-1,0,-1,-1,-2,-1,-1,-1,-2,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,0,0,0,0,2,5,9,13,17,19,14,10,2,-6,-10,-12,-12,-10,-6,-5,-1,-2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,1,1,1,1,1,1,1,1,2,0,0,0,0,1,2,2,2,2,2,3,4,3,3,2,2,3,4,4,3,4,4,4,4,4,5,6,5,4,4,4,4,5,3,3,4,4,3,3,3,2,3,2,2,2,2,1,2,0,1,1,1,2,1,2,1,2,1,1,1,0,1,0,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0,-1,0,0,-1,0,0,0,-1,-1,-1,-1,-1,0,0,0,1,1,2,4,2,2,2,2,2,2,2,2,2,1,2,3,4,4,7,11,16,20,23,20,15,7,-1,-8,-9,-9,-7,-4,-1,1,2,1,3,3,4,4,3,4,4,3,4,4,4,3,5,3,4,3,4,3,4,3,4,2,2,3,2,5,4,5,5,2,4,2,3,2,3,2,2,3,3,4,3,3,3,4,5,4,6,5,5,4,5,5,6,6,6,5,6,5,5,5,5,5,5,5,5,4,5,3,2,2,3,3,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,-1,0,0,0,-1,0,-1,0,0,0,-1,-1,0,0,-1,0,0,-1,0,0,-2,-1,-1,-1,0,-1,0,0,-1,-1,-1,0,-1,-1,0,0,0,0,0,0,0,0,0,-1,-1,-2,0,-1,-1,-2,0,-1,0,0,0,-1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,3,2,4,5,4,5,5,5,4,4,3,3,3,2,2,0,0,0,0,-2,0,-2,-2,-2,-2,-4,-2,-2,0,-2,-2,-1,-2,-4,-2,0,-2,-1,0,-2,-1,0,3,4,9,13,16,17,12,5,-3,-9,-14,-15,-13,-9,-8,-6,-4,-4,-3,-2,-2,0,-2,-1,-1,-2,-1,-2,-2,-2,-1,-2,-2,0,-2,0,-1,-1,-1,-1,-1,-2,0,-1,-1,0,-1,0,-1,0,-3,0,-2,0,0,1,0,0,-1,-1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,-1,0,0,-1,0,0,0,-1,-1,-1,-2,-2,-1,-1,-2,-1,-2,-1,-2,0,-2,-1,-1,0,0,0,0,-1,-1,0,-1,0,0,-1,-1,0,-2,0,0,0,-1,-1,-2,0,0,0,0,0,0,-1,0,-1,-1,0,-2,-1,0,-1,-1,0,-1,-1,-1,0,0,-1,0,0,0,0,0,0,-2,0,0,0,0,0,-1,-1,0,0,0,0,0,0,1,1,1,1,2,2,4,3,5,4,4,4,4,3,2,2,2,1,0,0,-1,0,-2,-2,-2,-1,-3,-3,-3,-4,-4,-3,-4,-3,-4,-3,-2,-2,-3,-3,-2,-3,-2,-2,-2,-2,-2,1,2,7,11,14,15,11,4,-2,-10,-13,-14,-14,-11,-8,-7,-5,-3,-2,-2,-1,0,-1,-1,-1,-2,-2,-1,-1,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,1,3,2,3,2,3,3,3,3,3,3,3,3,3,2,2,2,2,1,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,-2,-2,-2,-3,-3,-3,-3,-2,-2,-3,-2,0,-1,0,1,1,0,1,0,0,1,0,0,1,1,1,1,1,2,2,4,7,9,16,20,20,17,9,1,-6,-11,-10,-10,-7,-4,-3,-1,-1,0,0,0,1,1,2,0,0,0,1,1,1,0,2,0,2,2,2,1,2,1,1,1,1,1,1,1,0,1,1,-1,1,0,1,1,0,1,1,1,2,2,1,1,1,2,1,2,2,2,2,2,2,2,3,3,4,3,2,2,2,3,2,2,3,2,2,1,2,1,0,0,0,0,0,-1,0,0,-1,0,-1,0,-1,-1,-1,-1,-1,-1,-1,-2,-2,-2,-2,-1,-2,-3,-2,-1,-1,-1,-1,-2,-2,-1,-2,-1,-1,-2,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,0,-2,-1,0,-1,-1,-1,-1,0,-1,-1,-1,-2,-2,-1,-2,-3,-2,-2,-1,-1,-1,-1,-2,-1,-1,-2,-2,-1,-2,-3,-3,-3,-2,-2,-3,0,0,-3,-1,-2,-1,-2,-1,-1,-1,-1,0,-1,-1,0,0,-1,0,-2,0,0,-3,0,0,-1,0,-1,-1,-2,0,-1,-1,0,-2,0,-1,-1,-1,-1,-2,-2,-1,-1,-1,0,0,0,0,-1,0,0,-1,0,0,0,0,0,0,0,0,0,1,2,4,4,4,5,5,5,4,4,4,2,4,3,3,0,0,0,0,-1,-1,-3,-3,-3,-2,-4,-3,-4,-2,-3,-3,-4,-3,-3,-3,-2,-2,-4,-4,-4,-2,-2,-2,0,1,5,10,15,16,13,7,0,-9,-14,-16,-15,-12,-10,-8,-6,-2,-3,-2,-2,-2,-3,-3,-2,-3,-2,-2,-2,-2,-3,-3,-2,-2,-2,-2,-3,-2,-2,-2,-2,-2,-3,-2,-2,-2,-2,-3,-2,-2,-2,0,-2,-1,-2,-2,-1,0,-1,0,-1,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,2,0,0,1,0,0,0,1,0,0,0,-1,0,-1,-1,-1,-1,0,0,-1,-1,0,-1,-1,-1,-1,-2,-1,-1,-1,-1,-1,-1,-1,-1,-2,-2,-1,-1,-1,-1,0,-1,-1,-2,-1,-1,-1,-1,-1,0,-1,-1,-2,0,0,0,0,-1,-1,0,-1,-2,0,0,0,0,0,0,0,-1,0,-1,0,-1,-1,-2,0,0,-2,-1,-1,-1,-2,-2,-2,-1,-2,-2,-2,0,-1,-1,0,-1,0,0,0,0,0,0,0,0,0,2,1,2,3,3,4,4,4,4,3,2,2,1,0,0,0,0,-1,-2,-3,-3,-3,-4,-4,-4,-4,-5,-4,-4,-4,-4,-2,-5,-5,-4,-4,-4,-3,-2,-3,-4,-2,-1,0,1,6,8,13,16,13,8,0,-8,-14,-15,-15,-13,-10,-8,-5)

							// QRS 坐标数据 493,0,
							//idxdata = "66,266,0,654,1,928,0,1154,0,1314,1,1582,0,1796,0,1956,1,2212,0,2430,0,2592,0,2856,0,3076,0,3236,0,3504,0,3724,0,3885,1,4158,0,4380,0,4541,1,4818,0,5039,0,5200,1,5478,0,5700,0,5862,1,6140,0,6365,0,6524,1,6801,0,7025,0,7185,1,7461,0,7685,0,7844,1,8117,0,8343,0,8502,1,8783,0,9011,0,9170,1,9456,0,9673,0,9837,1,10107,0,10330,0,10491,1,10766,0,10991,0,11151,1,11427,0,11655,0,11814,1,12097,0,12323,0,12483,1,12763,0,12989,0,13148,1,13431,0,13656,0,13816,1,14096,0,14321,0,14481,1";
							console.log(ecgdata)
							if (ecgdata.length == 0) {
								return
							}
							datas = ecgdata
							g_data_total = ecgdata.length
							//console.log(ecgdata.length)
							//console.log(ecgdata)
							console.log(datas)

							for (var i = 0; i < datas.length; i++) {
								let data = datas[i];
								let item = {}
								item.value = Math.ceil(data)
								//					item.value = data
								item.flag = 0 // 0 1 2就是 N窦性 S房早 V室早  正常     999 画 N 及 心率
								item.idx = i
								dataobjs.push(item)
							}


							console.log(result)
							var arrdatarw = result.qrsInfo.r_w
							var arrtype = result.qrsInfo.type
							if (arrdatarw != undefined) {

								//								g_bottom_min = parseInt(ecgSec / 60)
								//								g_bottom_sec = parseInt(ecgSec % 60)
								g_bottom_total_idx = g_bottom_total_idx - 1
								$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第0个心搏，共有 " + g_bottom_total_idx + " 个心搏")

								arrdatarw.forEach(function (idx, i) {
									let flag = parseInt(arrtype[i])

									// 设置前后34个点
									setarrdataupfile(dataobjs, idx, flag, i, result)
									//setarrdata(dataobjs, idx, flag)
								})
							}

							ecgdraw();
						});

						//						g_basic_index = data.body.data.qrsMesureReq
						//							var result = {qrsMesureReq:{
						//								jYn: 1,
						//								pF: 1,
						//								pH: 1,
						//								pS: 1,
						//								pY: 1,
						//								pjS: 1,
						//								prS: 1,
						//								prY: 1,
						//								qH: 1,
						//								qS: 1,
						//								qrHB: 1,
						//								qrsF: 1,
						//								qrsS: 1,
						//								qt: 1,
						//								qtc: 1,
						//								rH: 1,
						//								stS: 1,
						//								stY: 1,
						//								sttgH: 1,
						//								stydH: 1,
						//								tF: 1,
						//								tH: 1,
						//								tY: 1,
						//								trHB: 1}}   //qrsMesureReq
						Object.keys(result.qrsMesureReq).forEach(function (key) {
							let num = result.qrsMesureReq[key]
							let numstr = '' + num;
							if (numstr.indexOf('.') != -1) {
								num = num.toFixed(2);
							}

							if (g_basic_index.rH != undefined) {

							}

							//			    $("#"+key).text(num)
							setText(key, num)
							$("#" + key).css("modcss");

							//							g_basic_index = result.qrsMesureReq
						});

						//						ecgdraw();

					}

				}).catch(err => {
					console.log(err)
				})
			} else {
				return
			}

		}
	}

	chanceType = function (i) {
		console.log(i)
		console.log(addQRSIndex)
		//		let file = this.files[0];

		if (addQRSIndex != undefined) {
			let url = Url;
			param = {
				method: 'POST',
				body: data = JSON.stringify({
					"reqHead": {
						"functionId": "DWS001002002",
					},
					"body": {
						"anaecgFileid": anaecgFileid,
						"qrsPos": addQRSIndex
					}
				}),
			};
			fetch(url, param).then(function (res) {
				return res.json()
			}).then(data => {
				console.log(data)
				if (data.respHead.respCode == '000') {
					console.log('添加成功！')
					// 采样点数据
					datas = [];
					// qrs info 数据
					idxdata;
					// QRS 中心坐标
					idxdatas = []
					// QRS 之间坐标
					mdxdatas = []
					// 处理后的采样点数据
					dataobjs = []

					$('#m').fadeOut();
					$(".btns-group").removeClass("stop_event");
					console.log(data);
					var result = data.body.data
					// 1. 心电印象
					$('.ecg_impression_body').text(result.ecg_result);
					if (result.ecg_level != undefined && result.ecg_level == -1) {
						ecgdraw();
						return
					}
					// 心率
					setText('heartH', result.hr)
					// 2. 获取原始采样点                                                            // result.rrDats
					getHeartDataByUrl("/get_ecg_voltage?file=" + '/service/data/remote/20190619/20190619165629476.hly' + "&begin=1&end=300&filter=1&reduce_sampling_rate=0", function (ecgdata, startTime, dataLength) {
						if (startTime === null || startTime === undefined) {
							startTime = '16:16:06'
						}

						if (ecgdata.length == 0) {
							return
						}
						datas = ecgdata
						g_data_total = ecgdata.length
						//console.log(ecgdata.length)
						//console.log(ecgdata)
						console.log(datas)

						for (var i = 0; i < datas.length; i++) {
							let data = datas[i];
							let item = {}
							item.value = Math.ceil(data)
							//					item.value = data
							item.flag = 0 // 0 1 2就是 N窦性 S房早 V室早  正常     999 画 N 及 心率
							item.idx = i
							dataobjs.push(item)
						}


						console.log(result)
						var arrdatarw = result.qrsInfo.r_w
						var arrtype = result.qrsInfo.type
						if (arrdatarw != undefined) {

							//								let ecgSec = (ecgSize - 20) / 521
							//								console.log("ecgSec:" + ecgSec)
							//								console.log("arrdatarw:" + arrdatarw.length)
							//								g_bottom_min = parseInt(ecgSec / 60)
							//								g_bottom_sec = parseInt(ecgSec % 60)
							//								g_bottom_total_idx = arrdatarw.length
							g_bottom_total_idx = g_bottom_total_idx + 1
							$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第0个心搏，共有 " + g_bottom_total_idx + " 个心搏")

							arrdatarw.forEach(function (idx, i) {
								let flag = parseInt(arrtype[i])

								// 设置前后34个点
								setarrdataupfile(dataobjs, idx, flag, i, result)
								//setarrdata(dataobjs, idx, flag)
							})
						}

						ecgdraw();
					});


					Object.keys(result.qrsMesureReq).forEach(function (key) {

						let num = result.qrsMesureReq[key]
						let numstr = '' + num;
						if (numstr.indexOf('.') != -1) {
							num = num.toFixed(2);
						}

						if (g_basic_index.rH != undefined) {

						}

						//			    $("#"+key).text(num)
						setText(key, num)
						$("#" + key).css("modcss");

						//							g_basic_index = result.qrsMesureReq
					});
					//						ecgdraw();
				}
			}).catch(err => {
				console.log(err)
			})
		} else {
			let qrsChangePos = [],
				subidx = 0;

			g_clickArea.forEach(function (obj, i) {
				let changeSub = idxdatas[obj.idx].subidx
				qrsChangePos[subidx++] = changeSub;
			})

			let url = Url,
				param = {
					method: 'POST',
					body: data = JSON.stringify({
						"reqHead": {
							"functionId": "DWS001002004",
						},
						"body": {
							"anaecgFileid": anaecgFileid,
							"qrsChangePos": qrsChangePos,
							"style": 1,
							"type": 1
						}
					})
				};
			fetch(url, param).then(res => {
				if (res.ok) {
					return res.json();
				} else {
					console.log(res);
				}
			}).then(data => {
				switch (i) {
					case "N":
						setArrData(0);
						break;
					case "S":
						setArrData(8);
						break;
					case "SE":
						setArrData(34);
						break;
					case "V":
						setArrData(5);
						break;
					case "VE":
						setArrData(10);
						break;
					case "J":
						setArrData(7);
						break;
					case "JE":
						setArrData(11);
						break;
					case "C":
						setArrData(44);
						break;
					case "X":
						setArrData(13);
						break;
					case "P":
						setArrData(51);
						break;
					case "A":
						setArrData(50);
						break;
					case "D":
						setArrData(52);
						break;
					case "R":
						setArrData(45);
						break;
					default:
						console.log("失败");
				}
			}).catch(err => {
				console.log(err);
			})
		}

	}



	navcanvas.onmousedown = canvasClick;
	navcanvas.onmousemove = dragRect;
	navcanvas.onmouseup = canvasout;
	window.onscroll = canvasout

	canvas.onmousedown = canvasWorkClick;
	canvas.onmousemove = canvasWorkMove;
	canvas.onmouseup = canvasWorkUp;
	canvas.addEventListener('dblclick', canvasWorkDoubleClick, false);

	qrscanvas.onmousedown = qrscanvasClick;
	qrscanvas.onmousemove = qrscanvasMove;
	qrscanvas.onmouseup = qrscanvasOut;
	qrscanvas.addEventListener('dblclick', qrscanvasDoubleClick, false);

	navchartcanvas.onmousedown = navcanvasClick;
	navchartcanvas.onmousemove = navcanvasMove;
	navchartcanvas.onmouseup = navcanvasUp;
	navchartcanvas.onmouseout = navcanvasOut;

	document.onkeydown = deleteQRS;

	// key event - use DOM element as object
	// canvas.addEventListener('keydown', doKeyDown, true);
	// canvas.focus();
	// key event - use window as object
	// window.addEventListener('keydown', doKeyDown, true);

	function qrsMoveLeft() {
		if (g_dbclickPos != undefined) {
			let idx = g_dbclickPos.subidx;
			qrsMove(g_dbclickPos, idx - 1);
		}
	}

	function qrsMoveRight() {
		if (g_dbclickPos != undefined) {
			let idx = g_dbclickPos.subidx;
			qrsMove(g_dbclickPos, idx + 1);
		}
	}

	function doKeyDown(e) {
		var keyID = e.keyCode ? e.keyCode : e.which;
		switch (keyID) {
			case 83:
				setArrData(1);
				break;
			case 78:
				setArrData(0);
				break;
			case 86:
				setArrData(2);
				break;
			case 27:
				g_subdatas = [];
				g_qrspos = [];
				$("#showqrs").hide();
				g_dbclickPos = undefined;
				Line.hideline();
				$("#rulerDiv").hide()
				break;
			case 37:
				qrsMoveLeft();
				break;
			case 39:
				qrsMoveRight();
				break;
		}

		// if (keyID === 83) { // S
		// 	setArrData(1)
		// } else if (keyID === 78) { // N
		// 	setArrData(0);
		// } else if (keyID === 86) { // V
		// 	setArrData(2);
		// } else if (keyID == 27) { //隐藏单导 QRS 波
		// 	g_subdatas = [];
		// 	g_qrspos = [];
		// 	$("#showqrs").hide();
		// 	g_dbclickPos = undefined;
		// 	Line.hideline();
		// 	$("#rulerDiv").hide()
		// } else if (keyID == 37) { //单导 QRS 波 向左移动
		// 	qrsMoveLeft();
		// } else if (keyID == 39) { //单导 QRS 波 向右移动
		// 	qrsMoveRight();
		// }

	}


	// 右键菜单
	wrap.oncontextmenu = canvas.oncontextmenu = function (ev) {
		// console.log(ev.clientX);
		// console.log(ev.clientY);
		if (g_right_idx != 0) {
			wrap.style.left = (ev.clientX - g_main_top_xy.x - 50) + "px";
			wrap.style.top = (ev.clientY - g_main_top_xy.y) + "px";
			wrap.style.display = "block";

			$("#nid").attr("onclick", "insertQRS('N'," + ev.clientX + "," + ev.clientY + ");");
			$("#sid").attr("onclick", "insertQRS('S'," + ev.clientX + "," + ev.clientY + ");");
			$("#vid").attr("onclick", "insertQRS('V'," + ev.clientX + "," + ev.clientY + ");");

		}
		ev.preventDefault();
	}
	wrap.onclick = canvas.onclick = function () {
		wrap.style.display = "none";
	}



	function setArrData(flag) {
		if (g_clickArea == undefined || g_clickArea.length == 0) {
			return;
		}
		for (let idx in g_clickArea) {
			setarrdataFlag(dataobjs, parseInt(idx), flag);
		}

		// console.log(ctxq)
		// console.log(g_offx)

		drawEcgEx(ctxq, g_offx);
	}

}




$(document).ready(function () {

	Ruler.init();

	$("#lowgird").attr("onclick", "existsgrid(1);");
	$("#lowpos").attr("onclick", "gridpos();");
	$("#gain5").attr("onclick", "gaingrid(20.0);");
	$("#gain10").attr("onclick", "gaingrid(10.0);");
	$("#gain20").attr("onclick", "gaingrid(5.0);");
	$("#paperHalf").attr("onclick", "paperSpeed(1250)");
	$("#paperDefault").attr("onclick", "paperSpeed(2500)");
	$("#paperDouble").attr("onclick", "paperSpeed(5000)");
	$("#scale").attr("onclick", "showrule();");
	$("#lineBtn").attr("onclick", "showscle();");

});

