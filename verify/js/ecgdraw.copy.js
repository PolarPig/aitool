
var ecgdraw = function () {


	g_main_top_xy = getDivPosition("maindiv");
	g_navcanvas_xy = getDivPosition('navcanvas');
	g_charcanvas_xy = getDivPosition('chartcanvas');
	g_qrscanvas_xy = getDivPosition('qrs');


	// 心电波
	var canvas = document.getElementById(g_canvasId);
	// 导航
	var navcanvas = document.getElementById(g_navcanvasId);
	//  导航 折线图
	var navchartcanvas = document.getElementById(g_chartcanvasId);
	//	var navchartcanvas = '';


	// 单导 QRS波
	var qrscanvas = document.getElementById(g_qrscanvasId);
	// QRS 波 画笔
	var qrsctx = qrscanvas.getContext('2d');
	// 单导 QRS波 虚拟canvas
	let qrscanvasBuffer = document.createElement("canvas");
	qrscanvasBuffer.width = qrscanvas.width;
	qrscanvasBuffer.height = qrscanvas.height;
	// QRS 波 画笔
	let qrsctxbuf = qrscanvasBuffer.getContext("2d");
	// QRS 波 低格画笔
	var qrsgridctxbuf = qrscanvasBuffer.getContext('2d');
	// / QRS 波 定位线 画笔 缓存画笔
	let qrsbufctx = qrscanvasBuffer.getContext("2d");
	// QRS 波 定位线 文本 画笔 缓存画笔
	var qrsbuftxtctx = qrscanvasBuffer.getContext('2d');





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
	//drawEcg(ctxq);
	drawEcgEx(ctxq, g_offx);

	// 3.画标尺
	drawScale(ctxsc);

	// 4.画缩略图
	drawNav(navctx);

	// 5.画缩略图-矩形框
	drawNavRect(navrectctx);

	// 6.画缩略图 - 折线图
	setTimeout(function () {
		drawChartNav(navchartctx);
	}, 1)

	// 7.画缩略图- 标记线
	drawClickLine()





	// 画标尺
	function drawScale(ctxsc) {
		ctxsc.beginPath();
		ctxsc.lineWidth = "1";
		ctxsc.strokeStyle = "red";
		for (let i = 0; i < 4; i++) {
			ctxsc.moveTo(0, g_lineHeight * (i + 1) - 40);
			ctxsc.lineTo(5, g_lineHeight * (i + 1) - 40);
			ctxsc.lineTo(5, g_lineHeight * (i + 1) - 78);
			ctxsc.lineTo(15, g_lineHeight * (i + 1) - 78);
			ctxsc.lineTo(15, g_lineHeight * (i + 1) - 40);
			ctxsc.lineTo(20, g_lineHeight * (i + 1) - 40);
		}
		ctxsc.stroke();
	}

	function drawEcg(ctxq) {
		ctxq.beginPath();
		ctxq.lineWidth = "1";
		ctxq.strokeStyle = "#32FF32";
		//		ctxq.strokeStyle = "red";

		let firstflagred = 0;
		let firstflaggreen = 0;
		let firstflagye = 0;

		let defaultFlag = 0;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < g_mmPs; j++) {
				let idx = i * g_mmPs + j + g_offx;

				if (i == 0) {
					g_draw_first_idx = idx;// 一屏第一个点
				}
				g_draw_last_idx = idx;// 一屏最后一个点

				let itemobj = dataobjs[idx];
				if (!itemobj) {
					ctxq.stroke();
					return;
				}
				let data = itemobj.value;
				let x = g_scaleArea + (j * width) / g_mmPs;
				let y = g_lineHeight * (i + 1) - ((data) / (g_pixPmm * g_mmPmV)) * 38 - 40;
				if (itemobj.flag == 1) {
					firstflagred = firstflagred + 1;
					firstflaggreen = 0;
					firstflagye = 0;
					defaultFlag = 0;

				} else if (itemobj.flag == 2) {
					firstflagye = firstflagye + 1;
					firstflaggreen = 0;
					firstflagred = 0;
					defaultFlag = 0;
				} else if (itemobj.flag == 0) {
					firstflaggreen = firstflaggreen + 1;
					firstflagred = 0;
					firstflagye = 0;
					defaultFlag = 0;
				} else {
					defaultFlag = defaultFlag + 1
					firstflaggreen = 0;
					firstflagred = 0;
					firstflagye = 0;
				}

				let flag = 0;
				if (idxdatas[idx] != undefined) {
					let txtflag = idxdatas[idx].txtflag;
					ctxtext.font = "20px Courier New";

					flag = idxdatas[idx].flag;
					if (flag == 0 || flag == 99 || flag == 45) {
						ctxtext.fillStyle = colorArr[1];
					} else {
						ctxtext.fillStyle = colorArr[flag];
					}
					idxdatas[idx].x = x;
					idxdatas[idx].y = y;
					if (data < 0) {
						y = Math.ceil(g_lineHeight * (i + 1) - ((data / 3) * 38) / (g_pixPmm * g_mmPmV) - 40)
					}
					ctxtext.fillText(txtflag, x - 6, y - 10);
					ctxtext.stroke();

					// 有被修改的记录
					let modif = idxdatas[idx].modif;
					if (modif != undefined && modif == 1) {
						ctxtext.beginPath();
						ctxtext.lineWidth = "1";
						ctxtext.strokeStyle = "yellow";
						ctxtext.strokeRect(x - 9, y - 26, 20, 20);
						ctxtext.stroke();

						if (firstflagred > 1) {
							firstflagred = 1
						}
						if (firstflaggreen > 1) {
							firstflaggreen = 1
						}
						if (firstflagye > 1) {
							firstflagye = 1
						}
						if (defaultFlag > 1) {
							defaultFlag = 1
						}
					}

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
					dataobjs[idx].x = x;
					dataobjs[idx].y = y;
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

				if (defaultFlag == 1) {
					ctxq.stroke();
					ctxq.beginPath();
					ctxq.strokeStyle = "#32FF32";
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
		// 低格明暗度
		ctx.strokeStyle = "rgba(48,54,65," + g_globalAlpha + ")";  //#5D4332"
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
		var ydata = [];

		var timeSlot = g_ecgSec * 1000 / 5
		for (let i = 0; i < 6; i++) {
			if (g_startTime == undefined) {
				g_startTime = new Date().getTime()
			}
			var timePoint = g_startTime + timeSlot * i
			var date = new Date(timePoint)
			var h = date.getHours()
			var m = date.getMinutes()
			var s = date.getSeconds()
			var time = ((h > 9) ? h : ('0' + h)) +
				':' + ((m > 9) ? m : ('0' + m)) +
				':' + ((s > 9) ? s : ('0' + s))
			ydata.push(time)
		}
		if (g_paramFlag == false) {
			navchartctx.beginPath();
			navchartctx.lineWidth = "3";
			navchartctx.strokeStyle = "#242833";
			return
		}

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

			let x = 25;
			let y = 80;
			let n = 70
			//绘制纵坐标
			for (let i in data) {
				navchartctx.fillText(data[i], x - 20, n);
				y -= (navchartcanvas.height - 20) / data.length;
				n = n - 12
			}

			x = 40;
			y = 80;
			//绘制横坐标
			for (let i in ydata) {
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
			let x = (i * navchartcanvas.width) / mdxdatas.length + 25;
			//			let y = 80 - (data.heartRate * 37) / (g_pixPmm * g_mmPmV);
			let y = 75-(data.heartRate * 37) / 100;// 心率趋势图不与增益相关联
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

	// 点击缩略折线图
	function navcanvasClick(e) {
		if (g_paramFlag == false) {
			return
		}
		if (Line.on == true) {
			return;
		}
		//		g_navclickLine = []

		//drawEcgEx(ctxq, g_offx);
		// 取得画布上被单击的点
		let clickX = e.pageX - g_charcanvas_xy.x;
		let clickY = e.pageY - g_charcanvas_xy.y;

		//drawChartNav(navchartctx)
		if (clickX > 25) {

			g_clickX = clickX
			g_clickY = clickY
			drawChartNav(navchartctx)

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
				let x = (25 / 490) * g_ecgSec * 250

				let data = mdxdatas[i];
				let idx = data.idx
				if ((data.x - clickX) < 26 && (data.x - clickX) > 20) {
					if (clickX < 30) {
						g_offx = 0
						g_x = 0
					} else {
						g_offx = parseInt(data.idx - 34 - x)
						g_x = (g_offx / 250) / g_ecgSec * 490         //  g_ecgSec
					}

					//					let offx = parseInt(g_offx - x)
					//					console.log(offx)

					drawEcgEx(ctxq, g_offx);


					if (g_x < 0) {
						g_x = 0
					}
					scrollout(g_x)
					break;
				}
			}


		}


	}

	// 缩略折线图内移动
	function navcanvasMove(e) {
		if (g_paramFlag == false) {
			return
		}
		if (Line.on == true) {
			return;
		}
		// console.log("e.pageX:"+e.pageX+",e.pageY:"+e.pageY)
		// console.log("g_charcanvas_xy.x:"+g_charcanvas_xy.x+",g_charcanvas_xy.y:"+g_charcanvas_xy.y)
		//drawEcgEx(ctxq, g_offx);
		// 取得画布上被单击的点
		let clickX = e.pageX - g_charcanvas_xy.x;
		let clickY = e.pageY - g_charcanvas_xy.y;
		// console.log("clickX:" + clickX + ",clickY:" + clickY)

		//drawChartNav(navchartctx)
		if (clickX > 25) {
			drawChartNav(navchartctx)
			navchartctx.beginPath();
			navchartctx.lineWidth = "1";
			navchartctx.strokeStyle = "aquamarine";

			navchartctx.moveTo(clickX, 10);
			navchartctx.lineTo(clickX, 70);
			navchartctx.stroke();
			drawClickLine()

		}
		//drawClickLine()

		//				for (let i in mdxdatas) {
		//					let x = (26 / 490) * g_ecgSec * 250
		//					let data = mdxdatas[i];
		//					let idx = data.idx
		//					let clickX = g_clickX || 0
		//					
		//					if ((data.x - clickX) < 25 && (data.x - clickX) > 20) {
		//						g_offx = data.idx - 34
		//						console.log(g_offx)
		//						let offx = parseInt(g_offx - x)
		//						if (offx < 0) {
		//							offx = 0
		//						}
		//						console.log(offx)
		//						drawEcgEx(ctxq, offx);
		//		
		//						break;
		//					}
		//				}


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
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.isSelected = false;
	}

	function drawNavRect(navrectctx) {
		g_leftwidth = 0
		//		g_clickX = 0
		navrectctx.beginPath();
		navrectctx.fillStyle = "rgba(211,213,216,0.5)";
		navrectctx.lineWidth = "4";
		navrectctx.strokeStyle = "white";
		navrectctx.fillRect(g_leftwidth, 0, g_navrectwidth, 80);

		var rect = new rectar(g_leftwidth, 0, g_navrectwidth, 80);
		g_rect = rect
		g_rects.push(rect);
		g_SelectedRect = rect;
		navrectctx.stroke();
	}

	function canvasWorkMove(e) {
		if (Line.on == true) {
			return;
		}

		let scroobj = getDivScroll("maindiv")
		// console.log(scroobj)
		let clickX = e.pageX - canvas.offsetLeft - g_main_top_xy.x;
		if (clickX < 30) {
			return
		}
		let clickY = e.pageY - canvas.offsetTop - g_main_top_xy.y + scroobj.top;
		g_right_idx = 0;
		// console.log("clickX="+clickX+",clickY="+clickY)

		// 计数索引
		let yhang = parseInt(clickY / g_lineHeight);
		let yidx = yhang * g_mmPs;
		let xidx = parseInt((g_mmPs / (width)) * (clickX - g_scaleArea));

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
				let obj = dataobjs[realIdx];


				if (obj != undefined && obj.value < 0) {
					ctxrect.strokeRect(dataobj.x + g_clickArea_x - 15, dataobj.y - 40, g_clickArea_w, g_clickArea_h);
				} else {
					ctxrect.strokeRect(dataobj.x + g_clickArea_x - 15, dataobj.y - 10, g_clickArea_w, g_clickArea_h);
				}

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
				//				console.log(idx)
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

		// 点击工作区，隐藏弹出的单波QRS
		g_subdatas = [];
		g_qrspos = [];
		g_qrsidx = undefined;
		g_dbclickPos = undefined;
		$(".mask.qrs").hide()

		if (g_clickArea != undefined && g_clickArea.length > 0) {
			//$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第0个心搏，共有 " + (g_bottom_total_idx - 1) + " 个心搏")
			$('#curselect').text("当前选中第0个心搏，共有 " + (g_bottom_total_idx) + " 个心搏")
		}

		g_clickArea = [];
		g_clickLine = [];
		drawEcgEx(ctxq, g_offx);
		// 取得画布上被单击的点
		let clickX = e.pageX - canvas.offsetLeft - g_main_top_xy.x;
		let clickY = e.pageY - canvas.offsetTop - g_main_top_xy.y + scroobj.top;
		// 计数索引
		let yhang = parseInt(clickY / g_lineHeight);
		let yidx = yhang * g_mmPs;
		let xidx = parseInt((g_mmPs / width) * (clickX - g_scaleArea));
		let idx = (yidx + xidx + g_offx);
		g_preidx = idx;
		//获取附近 真正索引
		// console.log(idx)
		let realIdx = getRealIdx(idx);
		deleteQRSIndex = realIdx
		// console.log(realIdx)
		if (realIdx != undefined) {
			addQRSIndex = undefined
			let rect = {};

			let dataobj = idxdatas[realIdx];
			if (clickY >= (dataobj.y - 30)) {
				ctxrect.beginPath();
				ctxrect.lineWidth = "1";
				ctxrect.strokeStyle = "red";
				let obj = dataobjs[realIdx];


				if (obj != undefined && obj.value < 0) {
					ctxrect.strokeRect(dataobj.x + g_clickArea_x - 15, dataobj.y - 40, g_clickArea_w, g_clickArea_h);
				} else {
					ctxrect.strokeRect(dataobj.x + g_clickArea_x - 15, dataobj.y - 10, g_clickArea_w, g_clickArea_h);
				}
				ctxrect.stroke();

				rect.w = g_clickArea_w;
				rect.h = g_clickArea_h;
				rect.idx = realIdx;
				rect.flag = dataobj.flag;
				g_clickArea[realIdx] = rect;
				g_bottom_idx = dataobj.subidx;

				let cout = 0;
				for (let idx in g_clickArea) {
					cout++
				}

				if (cout > 1) {
					//$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中" + (cout) + "个心搏，共有 " + g_bottom_total_idx + " 个心搏")
					$('#curselect').text("当前选中" + (cout) + "个心搏，共有 " + (g_bottom_total_idx) + " 个心搏")
				} else {
					//$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第" + (g_bottom_idx + 1) + "个心搏，共有 " + g_bottom_total_idx + " 个心搏")
					$('#curselect').text("当前选中第" + (g_bottom_idx + 1) + "个心搏，共有 " + (g_bottom_total_idx) + " 个心搏")
				}
				//				$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第" + (g_bottom_idx + 1) + "个心搏，共有 " + g_bottom_total_idx + " 个心搏")
			}
		} else {
			addQRSIndex = idx + 25
			let rect = {};
			let dataobj = dataobjs[idx];

			if (dataobj == undefined || dataobj.x == undefined) {
				return
			}
			
			if (addQRSIndex > dataobjs.length-25){
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

			if (g_clickArea != undefined && g_clickArea.length > 0) {
				//$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第0个心搏，共有 " + (g_bottom_total_idx - 1) + " 个心搏")
				$('#curselect').text("当前选中第0个心搏，共有 " + (g_bottom_total_idx) + " 个心搏")
			}

		}
	}

	function canvasWorkUp(e) {
		if (Line.on == true) {
			return;
		}

		let scroobj = getDivScroll("maindiv")
		//console.log(scroobj)

		// g_clickX = e.pageX - g_charcanvas_xy.x;
		//console.log(g_clickX)

		// 取得画布上被单击的点
		let clickX = e.pageX - canvas.offsetLeft - g_main_top_xy.x;
		let clickY = e.pageY - canvas.offsetTop - g_main_top_xy.y + scroobj.top;
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

		if (g_clickArea != undefined && g_clickArea.length > 0) {
			let cout = 0;
			for (let idx in g_clickArea) {
				cout++
			}
			if (cout > 1) {
				//$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中" + (cout) + "个心搏，共有 " + g_bottom_total_idx + " 个心搏")
				$('#curselect').text("当前选中" + (cout) + "个心搏，共有 " + (g_bottom_total_idx) + " 个心搏")
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
		//		console.log(scroobj)

		g_subdatas = [];
		g_qrspos = [];
		g_qrsidx = undefined;
		g_dbclickPos = undefined;
		// 取得画布上被单击的点
		let clickX = e.pageX - canvas.offsetLeft - g_main_top_xy.x;
		let clickY = e.pageY - canvas.offsetTop - g_main_top_xy.y + scroobj.top;
		// 计数索引
		let yhang = parseInt(clickY / g_lineHeight);
		let yidx = yhang * g_mmPs;
		let xidx = parseInt((g_mmPs / width) * (clickX - g_scaleArea));
		let idx = (yidx + xidx + g_offx);
		//获取附近 真正索引
		let realIdx = getRealIdx(idx);
		
		
		if (realIdx != undefined && g_grid_pos_flag) {
			g_qrsidx = realIdx;

			g_check_qrsinfo = dataobjs[realIdx]
			
			$('.ecg-num').text(g_bottom_idx + 1)
			$(".mask.qrs").show();
			// 填充背景颜色
			qrsctxbuf.fillStyle = "#242833";
			qrsctxbuf.fillRect(0, 0, qrscanvas.width, qrscanvas.height);

			// 单导 低格线
			gridQRSLow(qrsgridctxbuf, qrscanvas);

			//初始化 g_subdatas
			initGsubdatas(realIdx)
			// 单导 心电波
			gridQRSHeat(qrsctxbuf, realIdx);

		}
	}

	function initGsubdatas(realIdx) {
		g_subdatas = [];
		let jidx = 0;
		for (let i = realIdx - 75; i < realIdx; i++) {
			var obj = deepCopy(dataobjs[i]);
			if (obj == undefined) {
				continue;
			}
			obj.subidx = jidx;
			let x = (jidx * qrscanvas.width) / 200;
			let y = 350 - (obj.value * 400) / (g_pixPmm * g_mmPmV);
			obj.x = x
			obj.y = y

			g_subdatas[jidx] = obj;
			jidx++;
		}
		for (let i = realIdx; i < realIdx + 125; i++) {
			var obj = deepCopy(dataobjs[i]);
			if (obj == undefined) {
				continue;
			}
			obj.subidx = jidx;
			let x = (jidx * qrscanvas.width) / 200;
			let y = 350 - (obj.value * 400) / (g_pixPmm * g_mmPmV);
			obj.x = x
			obj.y = y

			if (g_check_qrsinfo == undefined) {
				g_check_qrsinfo = obj
			}

			g_subdatas[jidx] = obj;
			jidx++;
		}

	}

	// 单导 心电波
	function gridQRSHeat(qrsctxbuf, realIdx) {

		qrsctxbuf.beginPath();
		qrsctxbuf.lineWidth = "1";
		qrsctxbuf.strokeStyle = "#32FF32";

		for (let idx in g_subdatas) {
			let data = g_subdatas[idx];
			let x = (idx * qrscanvas.width) / g_subdatas.length;
			let y = 350 - (data.value * 400) / (g_pixPmm * g_mmPmV);
			if (idx == 0) {
				qrsctxbuf.moveTo(x, y);
			}
			qrsctxbuf.lineTo(x, y);
			
			if (data.qrs != undefined && g_check_qrsinfo != undefined && g_check_qrsinfo.qrsInfo != undefined) {
				if (g_check_qrsinfo.qrsInfo.type == 13) {
					$('.effective').hide()
					$('.invalid').show()
					
					$('.on-btn').hide()
					$('.off-btn').show()
				}else{
					$('.effective').show()
					$('.invalid').hide()
					
					$('.on-btn').show()
					$('.off-btn').hide()
				}
				if (data.qrs == "P1") {
					g_check_qrsinfo.qrsInfo.p_s_w = data.idx
				} else if (data.qrs == "P") {
					g_check_qrsinfo.qrsInfo.p_w = data.idx
				} else if (data.qrs == "P2") {
					g_check_qrsinfo.qrsInfo.p_f_w = data.idx
				} else if (data.qrs == "Q") {
					g_check_qrsinfo.qrsInfo.q_w = data.idx
				} else if (data.qrs == "R") {
					g_check_qrsinfo.qrsInfo.r_w = data.idx
				} else if (data.qrs == "J") {
					g_check_qrsinfo.qrsInfo.qrs_f_w = data.idx
				} else if (data.qrs == "ST") {
					g_check_qrsinfo.qrsInfo.st_w = data.idx
				} else if (data.qrs == "T") {
					g_check_qrsinfo.qrsInfo.t_w = data.idx
				} else if (data.qrs == "T2") {
					g_check_qrsinfo.qrsInfo.t_f_w = data.idx
				}
			}
		}

		qrsctxbuf.stroke();

		// 画定位线
		gridQRSPos(g_subdatas);


		// 实时处理计算
		realTimeCalculate(g_check_qrsinfo);

	}

	function realTimeCalculate(qrsinfo){
	
		let index_info = g_basic_index
		if ( g_change_basic_idx.pH != undefined){
			index_info = g_change_basic_idx
		}
		//P波振幅
		if (datas[qrsinfo.qrsInfo.p_w] != undefined && datas[qrsinfo.qrsInfo.p_s_w] != undefined){
			let v = datas[qrsinfo.qrsInfo.p_w] - datas[qrsinfo.qrsInfo.p_s_w]
			v = v/100;
			v = v.toFixed(2);
			if (v > index_info.pH){
				v = '<span style="color: red;">'+v+'    ↑</span>'
			}else if (v < index_info.pH){
				v = '<span style="color: red;">'+v+'    ↓</span>'
			}else{
				v = '<span>'+v+'</span>'
			}
			$('#pHidxOne').html(v)	
		}
		if (index_info.pH != undefined){
			let v = index_info.pH
			v = v.toFixed(2);
			$('#pHidx').html(v)	
		}
		
		//P波时限 parseInt((idx - prepoint) * 1000 / 250)
		if (datas[qrsinfo.qrsInfo.p_s_w] != undefined && datas[qrsinfo.qrsInfo.p_f_w] != undefined){
			let v = qrsinfo.qrsInfo.p_f_w - qrsinfo.qrsInfo.p_s_w
			v = v*1000/250
			v = v.toFixed(0);
			if (v > index_info.pS){
				v = '<span style="color: red;">'+v+'    ↑</span>'
			}else if (v < index_info.pS){
				v = '<span style="color: red;">'+v+'    ↓</span>'
			}else{
				v = '<span>'+v+'</span>'
			}
			$('#pSidxOne').html(v)	
		}
		if (index_info.pS != undefined){
			let v = index_info.pS
			$('#pSidx').html(v)	
		}
		//PR间期
		if (datas[qrsinfo.qrsInfo.p_s_w] != undefined && datas[qrsinfo.qrsInfo.q_w] != undefined){
			let v = qrsinfo.qrsInfo.q_w - qrsinfo.qrsInfo.p_s_w
			v = v*1000/250
			v = v.toFixed(0);
			if (v > index_info.prS){
				v = '<span style="color: red;">'+v+'    ↑</span>'
			}else if (v < index_info.prS){
				v = '<span style="color: red;">'+v+'    ↓</span>'
			}else{
				v = '<span>'+v+'</span>'
			}
			$('#prSidxOne').html(v)	
		}
		if (index_info.prS != undefined){
			let v = index_info.prS
			$('#prSidx').html(v)	
		}
		//Q波振幅
		if (datas[qrsinfo.qrsInfo.r_w] != undefined && datas[qrsinfo.qrsInfo.q_w] != undefined){
			let v = 0;
			if (datas[qrsinfo.qrsInfo.r_w] > datas[qrsinfo.qrsInfo.q_w]){
				let min = datas[qrsinfo.qrsInfo.q_w+1]
				for(let i=qrsinfo.qrsInfo.q_w+2;i<qrsinfo.qrsInfo.r_w;i++){
					let temp = datas[i]
					if ( temp < min){
						min = temp
					}
				}
				if ( Math.abs(datas[qrsinfo.qrsInfo.q_w] - min )/100 > 0.05  ){
					v = Math.abs(min - datas[qrsinfo.qrsInfo.q_w])/100 
				}else{
					v = 0
				}
			}else{
				let max = datas[qrsinfo.qrsInfo.q_w+1]
				for(let i=qrsinfo.qrsInfo.q_w+2;i<qrsinfo.qrsInfo.r_w;i++){
					let temp = datas[i]
					if ( temp > max){
						max = temp
					}
				}
				if ( Math.abs(max - datas[qrsinfo.qrsInfo.q_w])/100 < 0.03  ){
					v = Math.abs(max - datas[qrsinfo.qrsInfo.q_w])/100 
				}else{
					v = 0
				}
			}
			v = v.toFixed(2);
			if (v > index_info.qH){
				v = '<span style="color: red;">'+v+'    ↑</span>'
			}else if (v < index_info.qH){
				v = '<span style="color: red;">'+v+'    ↓</span>'
			}else{
				v = '<span>'+v+'</span>'
			}
			$('#qHidxOne').html(v)	
		}
		if (index_info.qH != undefined){
			let v = index_info.qH
			v = v.toFixed(2);
			$('#qHidx').html(v)	
		}
		//R波振幅
		if (datas[qrsinfo.qrsInfo.r_w] != undefined && datas[qrsinfo.qrsInfo.q_w] != undefined){
			let v = 0
			let max = datas[qrsinfo.qrsInfo.q_w+1]
			for(let i=qrsinfo.qrsInfo.q_w+2;i<qrsinfo.qrsInfo.r_w;i++){
				let temp = datas[i]
				if ( temp > max){
					max = temp
				}
			}
			v = Math.abs(max - datas[qrsinfo.qrsInfo.q_w])/100 ;
			v = v.toFixed(2);
			if (v > index_info.rH){
				v = '<span style="color: red;">'+v+'    ↑</span>'
			}else if (v < index_info.rH){
				v = '<span style="color: red;">'+v+'    ↓</span>'
			}else{
				v = '<span>'+v+'</span>'
			}
			$('#rHidxOne').html(v)	
		}
		if (index_info.rH != undefined){
			let v = index_info.rH
			v = v.toFixed(2);
			$('#rHidx').html(v)	
		}
		//QRS波振幅
		if (datas[qrsinfo.qrsInfo.qrs_f_w] != undefined && datas[qrsinfo.qrsInfo.q_w] != undefined){
			let v = 0
			let max = datas[qrsinfo.qrsInfo.q_w]
			let min = datas[qrsinfo.qrsInfo.q_w]
			for(let i=qrsinfo.qrsInfo.q_w+1;i<qrsinfo.qrsInfo.qrs_f_w;i++){
				let temp = datas[i]
				if ( temp > max){
					max = temp
				}
				
				if ( temp < min){
					min = temp
				}
				
			}
			v = Math.abs(max - min)/100 ;
			g_qrs_h = v
			v = v.toFixed(2);
			if (v > index_info.qrsH){
				v = '<span style="color: red;">'+v+'    ↑</span>'
			}else if (v < index_info.qrsH){
				v = '<span style="color: red;">'+v+'    ↓</span>'
			}else{
				v = '<span>'+v+'</span>'
			}
			$('#qrsHidxOne').html(v)	
		}
		if (index_info.qrsH != undefined && index_info.qrsH.length > 0){
			let v = index_info.qrsH
			v = v.toFixed(2);
			$('#qrsHidx').html(v)
		}
		//QRS波时限
		if (datas[qrsinfo.qrsInfo.qrs_f_w] != undefined && datas[qrsinfo.qrsInfo.q_w] != undefined){
			let v = qrsinfo.qrsInfo.qrs_f_w - qrsinfo.qrsInfo.q_w
			v = v*1000/250
			v = v.toFixed(0);
			if (v > index_info.qrsS){
				v = '<span style="color: red;">'+v+'    ↑</span>'
			}else if (v < index_info.qrsS){
				v = '<span style="color: red;">'+v+'    ↓</span>'
			}else{
				v = '<span>'+v+'</span>'
			}
			$('#qrsSidxOne').html(v)	
		}
		if (index_info.qrsS != undefined){
			let v = index_info.qrsS
			$('#qrsSidx').html(v)	
		}
		//ST段振幅
		if (datas[qrsinfo.qrsInfo.st_w] != undefined && datas[qrsinfo.qrsInfo.q_w] != undefined){
			let v = datas[qrsinfo.qrsInfo.st_w] - datas[qrsinfo.qrsInfo.q_w]
			v = v/100
			v = v.toFixed(2);
			if (v > index_info.sttgH){
				v = '<span style="color: red;">'+v+'    ↑</span>'
			}else if (v < index_info.sttgH){
				v = '<span style="color: red;">'+v+'    ↓</span>'
			}else{
				v = '<span>'+v+'</span>'
			}
			$('#sttgHidxOne').html(v)	
		}
		if (index_info.sttgH != undefined){
			let v = index_info.sttgH
			v = v.toFixed(2);
			$('#sttgHidx').html(v)	
		}
		//T波振幅
		if (datas[qrsinfo.qrsInfo.t_w] != undefined && datas[qrsinfo.qrsInfo.q_w] != undefined){
			let v = datas[qrsinfo.qrsInfo.t_w] - datas[qrsinfo.qrsInfo.q_w]
			v = v/100
			v = v.toFixed(2);
			if (v > index_info.tH){
				v = '<span style="color: red;">'+v+'    ↑</span>'
			}else if (v < index_info.tH){
				v = '<span style="color: red;">'+v+'    ↓</span>'
			}else{
				v = '<span>'+v+'</span>'
			}
			$('#tHidxOne').html(v)	
		}
		if (index_info.tH != undefined){
			let v = index_info.tH
			v = v.toFixed(2);
			$('#tHidx').html(v)	
		}
		//QT间期
		if (datas[qrsinfo.qrsInfo.t_f_w] != undefined && datas[qrsinfo.qrsInfo.q_w] != undefined){
			let v = qrsinfo.qrsInfo.t_f_w - qrsinfo.qrsInfo.q_w
			v = v*1000/250
			v = v.toFixed(0);
			if (v > index_info.qt){
				v = '<span style="color: red;">'+v+'    ↑</span>'
			}else if (v < index_info.qt){
				v = '<span style="color: red;">'+v+'    ↓</span>'
			}else{
				v = '<span>'+v+'</span>'
			}
			$('#qtidxOne').html(v)	
		}
		if (index_info.qt != undefined){
			let v = index_info.qt
			$('#qtidx').html(v)	
		}
		
	}

	// 画定位线
	function gridQRSPos(g_subdatas) {

		let p1flag = 0;
		let pflag = 0;
		let p2flag = 0;
		let rflag = 0;
		let qflag = 0;
		let jflag = 0;
		for (let idx in g_subdatas) {
			let itemobj = g_subdatas[idx];
			// 画定位线
			if (itemobj.qrs != undefined && itemobj.isdraw != undefined && itemobj.isdraw == 1) {

				if (itemobj.qrs == "P1" && p1flag == 1) {
					continue
				}

				if (itemobj.qrs == "P1") {
					p1flag = 1;
				}

				if (itemobj.qrs == "P" && pflag == 1) {
					continue
				}

				if (itemobj.qrs == "P") {
					pflag = 1;
				}

				if (itemobj.qrs == "P2" && p2flag == 1) {
					continue
				}

				if (itemobj.qrs == "P2") {
					p2flag = 1;
				}


				if (itemobj.qrs == "Q" && qflag == 1) {
					continue
				}

				if (itemobj.qrs == "Q") {
					qflag = 1;
				}

				if (itemobj.qrs == "R" && rflag == 1) {
					continue
				}

				if (itemobj.qrs == "R") {
					rflag = 1;
				}

				if (itemobj.qrs == "J" && jflag == 1) {
					continue
				}

				if (itemobj.qrs == "J") {
					jflag = 1;
				}

				if (itemobj.qrs == "ST" && rflag == 0) {
					continue
				}
				if (itemobj.qrs == "T" && rflag == 0) {
					continue
				}
				if (itemobj.qrs == "T2" && rflag == 0) {
					continue
				}

				let x = (idx * qrscanvas.width) / g_subdatas.length;
				let y = 350 - (itemobj.value * 400) / (g_pixPmm * g_mmPmV);

				// / QRS 波 定位线 画笔 缓存画笔
				//	let qrsbufctx = canvasBuffer.getContext("2d");
				// QRS 波 定位线 文本 画笔 缓存画笔
				//	var qrsbuftxtctx = qrscanvas.getContext('2d');

				qrsbufctx.beginPath();
				qrsbufctx.strokeStyle = itemobj.color;


				if (itemobj.isfull == 1) {
					//实线
					qrsbufctx.setLineDash([]);
					if (g_dbclickPos != undefined && g_dbclickPos.subidx == itemobj.subidx) {
						qrsbufctx.lineWidth = "4";
					} else {
						qrsbufctx.lineWidth = "2";
					}

					qrsbufctx.moveTo(x, y - 100.5);
					qrsbufctx.lineTo(x, y + 100.5);
					qrsbufctx.stroke();

					qrsbuftxtctx.font = "20px Courier New";
					qrsbuftxtctx.fillStyle = itemobj.color;
					qrsbuftxtctx.fillText(itemobj.qrs, x - 10, y - 110.5);
					qrsbuftxtctx.stroke();

				} else {
					// 虚线
					qrsbufctx.setLineDash([5]);
					if (g_dbclickPos != undefined && g_dbclickPos.subidx == itemobj.subidx) {
						qrsbufctx.lineWidth = "2";
					} else {
						qrsbufctx.lineWidth = "1";
					}

					qrsbufctx.moveTo(x, y - 50.5);
					qrsbufctx.lineTo(x, y + 50.5);

					qrsbufctx.stroke();

					qrsbuftxtctx.font = "20px Courier New";
					qrsbuftxtctx.fillStyle = itemobj.color;
					qrsbuftxtctx.fillText(itemobj.qrs, x - 10, y - 55.5);
					qrsbuftxtctx.stroke();

				}
				//				console.log("init:itemobj.x:"+itemobj.x+"   itemobj.qrs:"+itemobj.qrs)

			}
		}

		qrsctx.clearRect(0, 0, width, height)
		qrsctx.drawImage(qrscanvasBuffer, 0, 0, width, height, 0, 0, width, height);
		qrsbufctx.clearRect(0, 0, width, height)
	}

	// 单导 低格线
	function gridQRSLow(qrsgridctxbuf, qrscanvas) {
		let qrswidth = qrscanvas.width;
		let qrsheight = qrscanvas.height;
		// 绿色矩形
		qrsgridctxbuf.beginPath();
		//线的粗细
		qrsgridctxbuf.lineWidth = "1";
		qrsgridctxbuf.strokeStyle = "#686C00";
		qrsgridctxbuf.moveTo(0, 0);
		qrsgridctxbuf.lineTo(0.5, qrsheight);
		qrsgridctxbuf.moveTo(0.5, qrsheight);
		qrsgridctxbuf.lineTo(qrswidth, qrsheight);
		qrsgridctxbuf.moveTo(qrswidth, qrsheight);
		qrsgridctxbuf.lineTo(qrswidth, 0.5);
		qrsgridctxbuf.moveTo(qrswidth, 0.5);
		qrsgridctxbuf.lineTo(0.5, 0.5);

		let ifulline = 0;
		for (let i = 40; i < (qrswidth); i = i + 40) {

			ifulline++;
			if (ifulline % 5 == 0) {
				qrsgridctxbuf.setLineDash([]);
				qrsgridctxbuf.beginPath();
			} else {
				qrsgridctxbuf.setLineDash([5]);
				qrsgridctxbuf.beginPath();
			}
			qrsgridctxbuf.moveTo(0.5, i - 0.5);
			qrsgridctxbuf.lineTo(qrswidth, i - 0.5);

			qrsgridctxbuf.stroke();

		}
		ifulline = 0;
		for (let i = 40; i < (qrswidth); i = i + 40) {
			ifulline++;
			if (ifulline % 5 == 0) {
				qrsgridctxbuf.setLineDash([]);
				qrsgridctxbuf.beginPath();
			} else {
				qrsgridctxbuf.setLineDash([5]);
				qrsgridctxbuf.beginPath();
			}

			qrsgridctxbuf.moveTo(i - 0.5, 0.5);
			qrsgridctxbuf.lineTo(i - 0.5, qrswidth);

			qrsgridctxbuf.stroke();

		}
		qrsgridctxbuf.setLineDash([]);
		qrsgridctxbuf.stroke();
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
			let stopx = rect.x;
			g_offx = (stopx * datas.length) / width;
			g_offx = parseInt(g_offx);
			drawEcgEx(ctxq, g_offx);
			return;
		}

		// 查找被单击的矩形框
		//		for (let i = g_rects.length - 1; i >= 0; i--) {
		let rect = g_rects[g_rects.length - 1];
		//			if (rect == undefined) {
		//				continue;
		//			}
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
		//		}
	}

	function drawRect(navrectctx, rect) {
		g_leftwidth = rect.x
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
		if (g_SelectedRect.width >= 490) {
			return
		}
		// 判断矩形是否开始拖拽
		if (isDragging == true) {

			// 判断拖拽对象是否存在
			if (g_SelectedRect != null) {
				// 取得鼠标位置
				// console.log(e.pageX)
				// console.log(g_navcanvas_xy.x)
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

	canvasout = function () {

		if (g_clickArea != undefined && g_clickArea.length > 0) {
			//$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第0个心搏，共有 " + (g_bottom_total_idx - 1) + " 个心搏")
			$('#curselect').text("当前选中第0个心搏，共有 " + (g_bottom_total_idx) + " 个心搏")
		}

		//g_clickArea = [];
		// 移出,不准移动方框
		isDragging = false;
		let rect = g_rects[0];
		//		let stopx = rect.x;
		//		let stopx = locationX;
		g_x = g_SelectedRect.x
		let stopx = g_SelectedRect.x * 2;
		g_clickX = g_SelectedRect.x + 25
		//console.log(g_clickX)
		g_offx = (stopx * datas.length) / width;
		g_offx = parseInt(g_offx);

		drawEcgEx(ctxq, g_offx);
		drawChartNav(navchartctx)
		drawClickLine()
		return;
	}



	scrollout = function (dis) {
		g_leftwidth = dis
		g_SelectedRect.x = g_x
		navrectctx.clearRect(0, 0, g_navrectwidth, 80);
		drawNav(navctx)
		navrectctx.beginPath();
		navrectctx.fillStyle = "rgba(211,213,216,0.5)";
		navrectctx.lineWidth = "4";
		navrectctx.strokeStyle = "white";
		navrectctx.fillRect(dis, 0, g_navrectwidth, 80);
	}

	function drawClickRect() {
		if (g_clickArea != undefined && g_clickArea.length > 0) {
			ctxrect.beginPath();
			ctxrect.lineWidth = "1";
			ctxrect.strokeStyle = "red";
			for (let idx in g_clickArea) {
				let tmp = g_draw_first_idx - 2500;
				if (tmp < 0) {
					tmp = 0;
				}
				if (idx > g_draw_last_idx || idx < tmp) {
					continue
				}
				let rect = g_clickArea[idx];
				let dataobj = idxdatas[idx];
				if (dataobj == undefined) {
					return
				} else {

					let obj = dataobjs[idx];

					if (obj != undefined && obj.value < 0) {
						ctxrect.strokeRect(dataobj.x + g_clickArea_x - 15, dataobj.y - 40, g_clickArea_w, g_clickArea_h);
					} else {
						ctxrect.strokeRect(dataobj.x + g_clickArea_x - 15, dataobj.y - 10, g_clickArea_w, g_clickArea_h);
					}
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
		if (clickX == 25) {
			clickX = 26
		}
		if (g_paramFlag == true) {
			navlinectx.clearRect(clickX, 10, 1, 60)
			navlinectx.beginPath();
			navlinectx.lineWidth = "1";
			navlinectx.strokeStyle = "red";
			navlinectx.moveTo(clickX, 10);
			navlinectx.lineTo(clickX, 70);
			navlinectx.stroke();
		} else {
			navlinectx.clearRect(clickX, 10, 1, 60)
			navlinectx.beginPath();
			navlinectx.lineWidth = "3";
			navlinectx.strokeStyle = "#242833";
			navlinectx.moveTo(clickX, 10);
			navlinectx.lineTo(clickX, 70);
			navlinectx.stroke();
			return
		}

	}
	// todo 颜色
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



		ctxq.beginPath();
		ctxq.lineWidth = "1";
		ctxq.strokeStyle = "#32FF32";

		let firstflagred = 0;
		let firstflaggreen = 0;
		let firstflagye = 0;

		let defaultFlag = 0;

		let colorFlagarr = []

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < g_mmPs; j++) {

				let idx = i * g_mmPs + j + offx;
				//				console.log(idx)
				let itemobj = dataobjs[idx];
				if (!itemobj) {
					continue
				}

				if (i == 0) {
					g_draw_first_idx = offx;// 一屏第一个点
				}
				g_draw_last_idx = idx;// 一屏最后一个点

				let data = itemobj.value;

				let tflagNum = colorFlagarr[itemobj.flag];
				if (tflagNum == undefined) {
					tflagNum = 1
					colorFlagarr[itemobj.flag] = tflagNum
				}
				let x = g_scaleArea + (j * width) / g_mmPs;
				let y = g_lineHeight * (i + 1) - (data * 38) / (g_pixPmm * g_mmPmV) - 40;

				x = Math.ceil(x)
				y = Math.ceil(y)
//				console.log(idxdatas)
				if (idxdatas[idx] != undefined) {
//										console.log(idxdatas[idx])
					let txtflag = idxdatas[idx].txtflag;
					let txtNum = idxdatas[idx].subidx + 1
					ctxtext.font = "20px Courier New";

					let flag = idxdatas[idx].flag;
					if (flag == 1) {
						ctxtext.fillStyle = colorArr[1];
					} else if (flag == 99) {
						ctxtext.fillStyle = colorArr[45];
					} else {
						ctxtext.fillStyle = colorArr[flag];
					}

					idxdatas[idx].x = x;
					idxdatas[idx].y = y;
					if (data < 0) {
						y = Math.ceil(g_lineHeight * (i + 1) - ((data / 3) * 38) / (g_pixPmm * g_mmPmV) - 40)
					}
					if (g_paramFlag == true) {
						ctxtext.fillText(txtflag, x - 6, y - 10);
					} else {
						if (txtNum < 10) {
							ctxtext.fillText(txtNum, x - 6, y - 10);
						} else if (txtNum > 9 && txtNum < 100) {
							ctxtext.fillText(txtNum, x - 12, y - 10);
						} else if (txtNum > 99 && txtNum < 1000) {
							ctxtext.fillText(txtNum, x - 18, y - 10);
						}
					}

					ctxtext.stroke();

					// 有被修改的记录
					let modif = idxdatas[idx].modif;
					if (modif != undefined && modif == 1) {
						ctxtext.beginPath();
						ctxtext.lineWidth = "1";
						ctxtext.strokeStyle = "yellow";
						ctxtext.strokeRect(x - 9, y - 26, 20, 20);
						ctxtext.stroke();

						if (tflagNum > 1) {
							tflagNum = 1
							colorFlagarr[itemobj.flag] = 1
						}

					}
				}
				if (g_paramFlag == true) {
					if (mdxdatas[idx] != undefined) {
						ctxtext.font = "10px Courier New";
						ctxtext.fillStyle = "white";
						let distance = mdxdatas[idx].distance;
						let heartRate = mdxdatas[idx].heartRate;
						ctxtext.fillText(distance, x - 5, y - 30);
						ctxtext.fillText(heartRate, x - 5, y - 20);
						ctxtext.stroke();
					}
				} else {
					if (mdxdatas[idx] != undefined) {
						ctxtext.font = "10px Courier New";
						ctxtext.fillStyle = "white";
						ctxtext.fillText('', x - 5, y - 30);
						ctxtext.stroke();
					}
				}


				if (dataobjs[idx] != undefined) {
					dataobjs[idx].x = x;
					dataobjs[idx].y = y;
				}

				for (let tflag in colorFlagarr) {
					if (tflag != itemobj.flag) {
						colorFlagarr[tflag] = 0;
					} else if (colorFlagarr[tflag] == 1) {
						ctxq.stroke();
						ctxq.beginPath();
						ctxq.strokeStyle = colorArr[tflag]
					}
				}

				colorFlagarr[itemobj.flag] = tflagNum + 1

				if (j == 0) {
					ctxq.moveTo(g_scaleArea, y);
				}
				ctxq.lineTo(x, y);

			}
		}

		ctxq.stroke();


		// 3. 画选中 QRS波 方框
		drawClickRect();

		drawClickLine();


	}

	function qrscanvasDoubleClick(e) {

	}


	let qrsstartx = 0

	function qrscanvasClick(e) {

		g_qrscanvas_xy = getDivPosition('qrs')
		g_dbclickPos = undefined;
		// 取得画布上被单击的点
		let clickX = e.pageX - g_qrscanvas_xy.x;
		let clickY = e.pageY - g_qrscanvas_xy.y;
		//		console.log("click x="+clickX+",y="+clickY)


		qrsstartx = clickX

		let endpos = g_subdatas.pop();
		if (endpos == undefined) {
			return;
		}
		let minx = endpos.x;
		let min = minx;
		g_subdatas.push(endpos);

		for (let idx in g_subdatas) {
			let pos = g_subdatas[idx];
			if (pos == undefined) {
				continue;
			}
			if (Math.abs(clickX - pos.x) < min && ((clickX - pos.x) > -25 && (clickX - pos.x) < 25) && (pos.qrs != undefined)) {
				//				console.log("posx="+pos.x+",posy="+pos.y+",qrs="+pos.subidx)
				min = Math.abs(clickX - pos.x);
				minx = pos.x;
				g_dbclickPos = pos;
				g_dbclickPos.subidx = parseInt(idx);
				//				console.log(g_dbclickPos)
				break;
			}
		}

	}

	function qrscanvasMove(e) {



		g_qrscanvas_xy = getDivPosition('qrs')
		// 取得画布上被单击的点
		let clickX = e.pageX - g_qrscanvas_xy.x;
		let clickY = e.pageY - g_qrscanvas_xy.y;

		if (g_dbclickPos != undefined) {
			let movewidth = clickX - qrsstartx


			if (movewidth > 0) {
				qrsstartx = clickX
				qrsMoveRight();
			} else if (movewidth < 0) {
				qrsstartx = clickX
				qrsMoveLeft()
			}
		}


	}

	function qrscanvasOut(e) {

		g_dbclickPos = undefined

		// 填充背景颜色
		qrsctxbuf.fillStyle = "#242833";
		qrsctxbuf.fillRect(0, 0, qrscanvas.width, qrscanvas.height);

		// 单导 低格线
		gridQRSLow(qrsgridctxbuf, qrscanvas);

		// 单导 心电波
		gridQRSHeat(qrsctxbuf, g_qrsidx);
	}

	// 移动
	function qrsMove(checkPos, idx) {

		let subdata = g_subdatas[idx];
		if (subdata == undefined) {
			return;
		}

		let pidx = checkPos.subidx;
		let nidx = subdata.subidx;
		if (pidx > nidx) {
			for (let i = pidx - 1; i >= nidx; i--) {
				let tmpdata = g_subdatas[i];
				if (tmpdata != undefined && tmpdata.qrs != undefined && tmpdata.isdraw != undefined && tmpdata.isdraw == 1) {
					subdata = g_subdatas[i + 1];
					break;
				}
			}
		} else {
			for (let i = pidx + 1; i <= nidx; i++) {
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
		g_subdatas[idx].color = checkPos.color;
		g_subdatas[idx].flag = checkPos.flag;
		g_subdatas[idx].isdraw = checkPos.isdraw;
		g_subdatas[idx].isfull = checkPos.isfull;
		g_subdatas[idx].qrs = checkPos.qrs;
		checkPos.qrs = undefined;


		g_dbclickPos = subdata;

		// 填充背景颜色
		qrsctxbuf.fillStyle = "#242833";
		qrsctxbuf.fillRect(0, 0, qrscanvas.width, qrscanvas.height);

		// 单导 低格线
		gridQRSLow(qrsgridctxbuf, qrscanvas);

		// 单导 心电波
		gridQRSHeat(qrsctxbuf, g_qrsidx);
	}

	function deepCopy(obj) {
		var result = Array.isArray(obj) ? [] : {};
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (typeof obj[key] === 'object' && obj[key] !== null) {
					result[key] = deepCopy(obj[key]);   //递归复制
				} else {
					result[key] = obj[key];
				}
			}
		}
		return result;
	}

	// delete键删除qrs波
	function deleteQRS(e) {
		if (g_paramFlag == false) {
			return false
		}
		// console.log(e)
		var e = window.event || e
		var code = e.which || e.keyCode

		switch (code) {
			case 46:
				if (deleteQRSIndex != undefined) {
					let temp = deleteQRSIndex
					deleteQRSIndex = undefined
					//					console.log(deleteQRSIndex)
					let url = Url;
					param = {
						method: 'POST',
						headers: {
							"doctorId": g_doctorId,
							"token": g_token
						},
						body: data = JSON.stringify({
							"reqHead": {
								"functionId": "DWS001002003",
							},
							"body": {
								"anaecgFileid": anaecgFileid,
								"qrsPos": temp,
								"reportIdStr": g_reportId
							}
						}),
					};
					fetch(url, param).then(res => {
						return res.json();
					}).then(data => {
						//						console.log(data)
						if (data.respHead.respCode == '000') {
							console.log('删除成功！')
							g_bottom_total_idx = g_bottom_total_idx - 1
							//处理波形数据
							dealData(data)
							g_change_basic_idx = data.body.data.qrsMesureReq
							alertx("删除类型成功")
						}
						if (data.respHead.respCode == '001') {
							console.log(data.respHead.respMsg);
							alertx("删除类型异常")
						}

					}).catch(err => {
						alertx("网络服务中断，请检查网络连接！")
						console.log(err)
					})
				} else {
					return
				}
				break;
			case 37:
				qrsMoveLeft();
				break;
			case 39:
				qrsMoveRight();
				break;
			case 27: //隐藏单导 QRS 波
				g_subdatas = [];
				g_qrspos = [];
				$(".mask.qrs").hide();
				g_dbclickPos = undefined;
				break;
			default:
			//				console.log("foo");
		}
	}

	submitUser = function () {

		let sub_age = $('#sub_age').val();
		let sub_emergencyTelephone = $('#sub_emergencyTelephone').val();
		let sub_height = $('#sub_height').val();
		let sub_name = $('#sub_name').val();
		let sub_sex = $('#sub_sex').val();
		let sub_weight = $('#sub_weight').val();
		let reg = new RegExp("^[0-9]*$");
		if (!reg.test(sub_weight)) {
			$('#sub_weight').val('');
			alertx("请填写正确的数字")
			return
		}
		if (!reg.test(sub_height)) {
			$('#sub_height').val('');
			alertx("请填写正确的数字")
			return
		}
		if (!reg.test(sub_age)) {
			$('#sub_age').val('');
			alertx("请填写正确的数字")
			return
		}


		let url = Url;
		param = {
			method: 'POST',
			headers: {
				"doctorId": g_doctorId,
				"token": g_token
			},
			body: data = JSON.stringify({
				"reqHead": {
					"functionId": "DWS001006001",
				},
				"body": {
					"anaecgFileid": anaecgFileid,
					"age": sub_age,
					"emergencyTelephone": sub_emergencyTelephone,
					"height": sub_height,
					"name": sub_name,
					"sex": sub_sex,
					"weight": sub_weight
				}
			}),
		};
		fetch(url, param).then(res => {
			return res.json();
		}).then(data => {
			if (data.respHead.respCode == '000') {

				alertx("提交用户信息成功")
			}
			if (data.respHead.respCode == '001') {
				console.log(data.respHead.respMsg);
				alertx("提交用户信息异常")
			}

		}).catch(err => {
			alertx("网络服务中断，请检查网络连接！")
			console.log(err)
		})

	}

	chanceType = function (type) {
		if (g_paramFlag == false) {
			return false
		}
		if (addQRSIndex != undefined && (g_clickArea == undefined || g_clickArea.length == 0)) {
			let temp = addQRSIndex
			addQRSIndex = undefined
			let url = Url;
			param = {
				method: 'POST',
				headers: {
					"doctorId": g_doctorId,
					"token": g_token
				},
				body: data = JSON.stringify({
					"reqHead": {
						"functionId": "DWS001002002",
					},
					"body": {
						"anaecgFileid": anaecgFileid,
						"qrsPos": temp,
						"reportIdStr": g_reportId,
						"type": type
					}
				}),
			};
			fetch(url, param).then(function (res) {
				return res.json()
			}).then(data => {
				//				console.log(data)
				if (data.respHead.respCode == '000') {
					//处理波形数据
					g_bottom_total_idx = g_bottom_total_idx + 1
					dealData(data)
					g_change_basic_idx = data.body.data.qrsMesureReq
					alertx("插入心搏成功")
					console.log('添加成功！')
				}
				if (data.respHead.respCode == '001') {
					console.log(data.respHead.respMsg);
					alertx("插入心搏异常")
				}
			}).catch(err => {
				alertx("网络服务中断，请检查网络连接！")
				console.log(err)
			})
		} else {
			let qrsChangePos = [],
				subidx = 0;

			g_clickArea.forEach(function (obj, i) {
				let changeSub = idxdatas[obj.idx].subidx
				qrsChangePos[subidx++] = changeSub;
			})
			if (qrsChangePos.length == 0) {
				return
			}
			let url = Url,
				param = {
					method: 'POST',
					headers: {
						"doctorId": g_doctorId,
						"token": g_token
					},
					body: data = JSON.stringify({
						"reqHead": {
							"functionId": "DWS001002004",
						},
						"body": {
							"anaecgFileid": anaecgFileid,
							"qrsChangePos": qrsChangePos,
							"style": 1,
							"type": type,
							"reportIdStr": g_reportId
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
				console.log(data.respHead)
				if (data.respHead.respCode == '000') {
					//处理波形数据
					dealData(data);
					g_change_basic_idx = data.body.data.qrsMesureReq
					alertx("修改类型成功")
					$(".navs .item.tip").removeClass("active");
				}
				if (data.respHead.respCode == '001') {
					console.log(data.respHead.respMsg);
					alertx("修改类型异常")
					$(".navs .item.tip").removeClass("active");
				}
			}).catch(err => {
				alertx("网络服务中断，请检查网络连接！")
				$(".navs .item.tip").removeClass("active");
				console.log(err);
			})
		}

	}

	dealData = function (data) {
		if (g_paramFlag == false) {
			return false
		}
		$('#m').fadeOut();
		$(".btns-group,.sub_userinfo").removeClass("stop_event");
		var result = data.body.data
		// 1. 心电印象
		if (g_paramFlag) {
			$('.ecg_impression_body').text(result.ecg_result_tz);
		}
		
		if (result.ecg_level != undefined && result.ecg_level == -1) {
			ecgdraw();
			return
		}
		// 心率
		setText('heartH', result.hr)
		$('#heartHidx').html('<span>'+result.hr+'</span>')
		$('#heartHidxOne').html('<span>'+result.hr+'</span>')
		// 2. 获取 QRS INFO                                                       
		var arrdatarw = result.qrsInfo.r_w
		var arrtype = result.qrsInfo.type
		if (arrdatarw != undefined) {
			//$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第0个心搏，共有 " + (g_bottom_total_idx - 1) + " 个心搏")
			$('#curselect').text(" 当前选中第0个心搏，共有 " + (g_bottom_total_idx) + " 个心搏")

			idxdatas = []
			mdxdatas = []
			prepoint = 0
			for (let i = 0; i < datas.length; i++) {
				let data = datas[i];
				let item = {}
				item.value = Math.ceil(data)
				item.flag = 0 // 初始化
				item.idx = i
				dataobjs[i] = item
			}

			arrdatarw.forEach(function (idx, i) {
				let flag = parseInt(arrtype[i])

				// 设置前后34个点
				setarrdataupfile(dataobjs, idx, flag, i, result)
				//setarrdata(dataobjs, idx, flag)
			})
		}

		ecgdraw();

		Object.keys(result.qrsMesureReq).forEach(function (key) {

			let num = result.qrsMesureReq[key]
			let numstr = '' + num;
			if (numstr.indexOf('.') != -1) {
				num = num.toFixed(2);
			}

			setText(key, num)
		});
	}

	dealDataRecover = function (data) {
		$('#m').fadeOut();
		$(".btns-group,.sub_userinfo").removeClass("stop_event");
		var result = data.body.data
		// 1. 心电印象
		if (g_paramFlag) {
			$('.ecg_impression_body').text(result.ecg_result_tz);
		}
		
		if (result.ecg_level != undefined && result.ecg_level == -1) {
			ecgdraw();
			return
		}
		// 心率
		setText('heartH', result.hr)
		$('#heartHidx').html('<span>'+result.hr+'</span>')
		$('#heartHidxOne').html('<span>'+result.hr+'</span>')

		// 2. 获取原始采样点
		getHeartDataByUrl("/pacs/get_ecg_voltage?file=" + result.rrDats + "&begin=1&end=300&filter=0&reduce_sampling_rate=0", function (ecgdata, startTime, dataLength) {
			if (startTime === null || startTime === undefined) {
				startTime = '16:16:06'
			}

			if (ecgdata.length == 0) {
				return
			}
			datas = ecgdata
			g_data_total = ecgdata.length
			for (let i = 0; i < datas.length; i++) {
				let data = datas[i];
				let item = {}
				item.value = Math.ceil(data)
				item.flag = 0 // 初始化
				item.idx = i
				item.qrsInfo = {}
				dataobjs.push(item)
			}

			g_reportId = result.reportIdStr;
			anaecgFileid = result.anaecgFileid;
			var arrdatarw = result.qrsInfo.r_w
			var arrtype = result.qrsInfo.type
			if (arrdatarw != undefined) {
				var ecgSec = result.length
				g_endTime = g_startTime + ecgSec * 1000

				g_ecgSec = ecgSec

				g_bottom_min = parseInt(ecgSec / 60)
				g_bottom_sec = parseInt(ecgSec % 60)
				g_bottom_total_idx = arrdatarw.length

				g_coverWidth = (40 / ecgSec) * 490
				if (g_fullTime == 20) {
					g_navrectwidth = g_coverWidth / 2
				} else if (g_fullTime == 40) {
					g_navrectwidth = g_coverWidth
				} else if (g_fullTime == 80) {
					g_navrectwidth = g_coverWidth * 2
				}

				if (g_bottom_sec < 10) {
					$("#u_length").text(`数据长度：${g_bottom_min}分0${g_bottom_sec}秒`)
				} else {
					$("#u_length").text(`数据长度：${g_bottom_min}分${g_bottom_sec}秒`)
				}
				//$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第0个心搏，共有 " + g_bottom_total_idx + " 个心搏")
				$('#curselect').text("当前选中第0个心搏，共有 " + (g_bottom_total_idx) + " 个心搏")

				arrdatarw.forEach(function (idx, i) {
					let flag = parseInt(arrtype[i])

					// 设置前后34个点
					setarrdataupfile(dataobjs, idx, flag, i, result)
					//setarrdata(dataobjs, idx, flag)
				})
			}

			ecgdraw();
		});

		// 3. 获取指标
		Object.keys(result.qrsMesure).forEach(function (key) {

			let num = result.qrsMesure[key]
			let numstr = '' + num;
			if (numstr.indexOf('.') != -1) {
				num = num.toFixed(2);
			}

			setText(key, num);

			$("#" + key).parent().attr("style", "");

			g_basic_index = result.qrsMesure;
		});

		// 4. 获取 QRS INFO                                                       
		var arrdatarw = result.qrsInfo.r_w
		var arrtype = result.qrsInfo.type
		if (arrdatarw != undefined) {
			g_bottom_total_idx = g_bottom_total_idx + 1
			//$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第0个心搏，共有 " + (g_bottom_total_idx - 1) + " 个心搏")
			$('#curselect').text("当前选中第0个心搏，共有 " + (g_bottom_total_idx) + " 个心搏")

		}

	}

	navcanvas.onmousedown = canvasClick;
	navcanvas.onmousemove = dragRect;
	navcanvas.onmouseup = canvasout;
	// $('.main_top').onscroll = canvasout
	//	$('#maindiv').bind('mousewheel', canvasout)

	canvas.onmousedown = canvasWorkClick;
	canvas.onmousemove = canvasWorkMove;
	canvas.onmouseup = canvasWorkUp;
	canvas.addEventListener('dblclick', canvasWorkDoubleClick, false);

	qrscanvas.onmousedown = qrscanvasClick;
	qrscanvas.onmousemove = qrscanvasMove;
	qrscanvas.onmouseup = qrscanvasOut;
	qrscanvas.onmouseout = qrscanvasOut;
	qrscanvas.addEventListener('dblclick', qrscanvasDoubleClick, false);

	if (g_paramFlag) {
		navchartcanvas.onmousedown = navcanvasClick;
		navchartcanvas.onmousemove = navcanvasMove;
		navchartcanvas.onmouseup = navcanvasUp;
		navchartcanvas.onmouseout = navcanvasOut;
	}


	document.onkeydown = deleteQRS;

	// key event - use DOM element as object
	// canvas.addEventListener('keydown', doKeyDown, true);
	// canvas.focus();
	// key event - use window as object
	// window.addEventListener('keydown', doKeyDown, true);

	function qrsMoveLeft() {
		//		console.log('left')
		if (g_dbclickPos != undefined) {
			let subidx = g_dbclickPos.subidx;
			qrsMove(g_dbclickPos, subidx - 1);
		}
	}

	function qrsMoveRight() {
		//		console.log('right')
		if (g_dbclickPos != undefined) {
			let subidx = g_dbclickPos.subidx;
			qrsMove(g_dbclickPos, subidx + 1);
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
			case 27: //隐藏单导 QRS 波
				g_subdatas = [];
				g_qrspos = [];
				$("#showqrs").hide();
				g_dbclickPos = undefined;
				break;
		}
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
	$("#gain40").attr("onclick", "gaingrid(2.5);");
	$("#paperHalf").attr("onclick", "paperSpeed(1250)");
	$("#paperDefault").attr("onclick", "paperSpeed(2500)");
	$("#paperDouble").attr("onclick", "paperSpeed(5000)");
	$("#scale").attr("onclick", "showrule();");
	$("#lineBtn").attr("onclick", "showscle();");
	
	paramJudge()

});

// 控制有无参数
function paramJudge(){
//	let arr = ['heartH', 'pH', "pS", "pF", "pY", "prS", "prY", "qH", "qS", "rH", "qrHB", "qrsS", "qrsF", "jYn", "pjS", "sttgH", "stydH", "stS", "stY", "tH", "trHB", "tF", "tY", "qt", "qtc"]
	let arr = ['heartH', 'pH', "pS", "prS", "qH", "rH", "qrHB", "qrsS", "sttgH", "tH", "qt"]
	if (g_paramFlag == true) {
		g_grid_pos_flag = true
		g_grid_exists = true
		g_paramFlag = false
		$('#rulerDiv').css("display","block")
		$('.param-btn').attr('src', 'img/btn_off.png')
		$("#insert").attr("disabled", true);
		$('.ecg_result_body').attr('disabled', true)
		$('.ecg_impression_body').text('');
		$('.forbid').css('display', 'block')
		$('.message-forbid').css('display', 'block')
		for (var i = 0; i < arr.length; i++) {
			setText(arr[i], '--')
		}
		if (!g_situaFlag) {
			$('.icon_preview').addClass("btnDisable");
			$('.icon_upload').addClass("btnDisable");
			$('.icon_export').addClass("btnDisable");
			$('.icon_print').addClass("btnDisable");
			$('.ecg_result_body').addClass("btnDisable");
			$('#insert').addClass("btnDisable");
		}
		gridpos()
		existsgrid(1)
		showrule()
	} else {
		g_paramFlag = true
		$('.param-btn').attr('src', 'img/btn_on.png')
		$("#insert").attr("disabled", false);
		$('.ecg_result_body').attr('disabled', false)
		$('.ecg_impression_body').text(g_result.ecg_result_tz);
		ecgdraw()
		let mesure = g_result.qrsMesure
		if (mesure == undefined) {
			mesure = ''
		}
		Object.keys(mesure).forEach(function (key) {

			let num = mesure[key]
			let numstr = '' + num;
			setText('heartH', g_result.hr)
			$('#heartHidx').html('<span>'+g_result.hr+'</span>')
			$('#heartHidxOne').html('<span>'+g_result.hr+'</span>')
			if (numstr.indexOf('.') != -1) {
				num = num.toFixed(2);
				setText(key, num);
			} else {
				g_paramFlag = true
				$('.param-btn').attr('src', 'img/btn_on.png')
//				console.log(key)
				setText(key, num);
				$("#" + key).parent().attr("style", "");
				g_basic_index = mesure;
			}
		});

		$('.icon_preview').removeClass("btnDisable");
		$('.icon_upload').removeClass("btnDisable");
		$('.icon_export').removeClass("btnDisable");
		$('.icon_print').removeClass("btnDisable");
		$('.ecg_result_body').removeClass("btnDisable");
		$('#insert').removeClass("btnDisable");
		$('.forbid').css('display', 'none')
		$('.message-forbid').css('display', 'none')
	}
}
$('.param-btn').click(function () {
	paramJudge()
})


//	全局留图控制 九宫格
$('.situa-btn').click(function () {
	if (g_situaFlag == true) {
		g_situaFlag = false
		$('.situa-btn').attr('src', 'img/icon_qj_nor.png')
		if (!g_paramFlag) {
			$('.icon_preview').addClass("btnDisable");
			$('.icon_upload').addClass("btnDisable");
			$('.icon_export').addClass("btnDisable");
			$('.icon_print').addClass("btnDisable");
		}

	} else {
		g_situaFlag = true
		$('.situa-btn').attr('src', 'img/icon_qj_pre.png')

		$('.icon_preview').removeClass("btnDisable");
		$('.icon_upload').removeClass("btnDisable");
		$('.icon_export').removeClass("btnDisable");
		$('.icon_print').removeClass("btnDisable");
		$('.ecg_result_body').removeClass("btnDisable");
		$('#insert').removeClass("btnDisable");
	}

})

