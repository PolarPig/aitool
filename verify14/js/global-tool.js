

function backwork() {
	window.location.href = g_admin_ui;
}

function getEcgFileInfoByUrl(url, callback) {
	//测试环境
	url = g_domain + url
	//开发环境
	//	url = 'http://192.168.9.197:8080' + url
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (callback) callback(this.response);
	};
	xhr.open('GET', url);
	xhr.responseType = 'json';
	xhr.send(null);
}


function getHeartDataByUrl(url, callback) {
	//测试环境
	url = g_domain + url
	//开发环境
	// url = 'http://192.168.9.197:8080' + url

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.onload = function () {
		var startTime = this.getResponseHeader('Begintime');
		var version = this.getResponseHeader('version')
		var dataLength = this.getResponseHeader('Datalength')
		var result = [];
		var float32Array = new Float32Array(this.response);
		$(float32Array).each(function (i) {
			//result.push(float32Array[i] / 2.5 * 150)
			result.push(float32Array[i] * 100)
			//result.push(float32Array[i] )
		})
		// console.log(result)
		if (callback) callback(result, startTime, dataLength);
	};
	xhr.open('GET', url);
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.responseType = 'arraybuffer';
	xhr.send(null);
}

function getDivPosition(id) {
	var x = document.getElementById(id).getBoundingClientRect().left;
	var y = document.getElementById(id).getBoundingClientRect().top + document.documentElement.scrollTop;
	return {
		x: x,
		y: y
	};
}

function getDivScroll(id) {
	var top = document.getElementById(id).scrollTop;
	var left = document.getElementById(id).scrollLeft;
	var height = document.getElementById(id).scrollHeight
	return {
		top: top,
		left: left,
		height: height
	}
}
function setarrdata(arrdata, idx, flag, j) {

	if (prepoint != undefined && prepoint != 0) {
		let midx = parseInt((prepoint + idx) / 2)
		if (midx != NaN) {
			let item = {}
			item.distance = parseInt((idx - prepoint) * 1000 / 250)
			item.heartRate = parseInt(60000 / item.distance)
			item.idx = idx
			mdxdatas[midx] = item
			//		console.log(mdxdatas)
		}
	}
	prepoint = idx

	dataobjs[idx].flag = flag

	let idxitem = {}
	idxitem.flag = flag
	if (flag == 0) {
		idxitem.txtflag = "N"
	} else if (flag == 1) {
		idxitem.txtflag = "S"
	} else if (flag == 2) {
		idxitem.txtflag = "v"
	}
	idxitem.idx = idx
	idxitem.subidx = j

	idxdatas[idx] = idxitem

	// 向前推 34 个点
	for (let i = idx; i > idx - 34; i--) {
		if (dataobjs[i] != undefined) {
			dataobjs[i].flag = flag
		}

	}
	// 向后推 34 个点
	for (let i = idx + 1; i <= idx + 34; i++) {
		if (dataobjs[i] != undefined) {
			dataobjs[i].flag = flag
		}
	}

	// x 轴偏移像素，计算定位线
	//QRS波群信息位置结构体
	// typedef struct _QRSINFOR
	// {
	// 	int P_S_W;   //P波起点位置       R-200ms     -50
	// 	int P_W;     //P波位置              R-160ms  -40
	// 	int P_F_W;   //P波终点位置        R-120ms    -30
	// 	int QRS_S_W; //QRS起点位置     R-40ms        -10
	// 	int Q_W;     //Q波位置                R-35ms -9
	// 	int R_W;     //R波位置                   R
	// 	int S_W;     //S波位置                   R+40ms 10
	// 	int QRS_F_W; //QRS终点位置       R+50ms          12
	// 	int ST_W;    //ST段位置                   R+90ms 22
	// 	int T_S_W;   //T波起点位置              R+200ms  50
	// 	int T_W;     //T波位置                        R+300ms 75
	// 	int T_F_W;   //T波终点位置              R+350ms       87
	// 	char type;   //QRS形态                    0  1  2    0
	// 	bool RT_di;  //RT方向是否一致，一致时为0          1   1
	// 
	// }QRSINFOR;
	let obj = dataobjs[idx - 50]
	if (obj != undefined) {
		obj.qrs = "P1"
		obj.color = "#6968FF"
		obj.isfull = 1 // 1.实线  0.虚线
		obj.isdraw = 1 // 是否画
	}

	obj = dataobjs[idx - 40]
	if (obj != undefined) {
		obj.qrs = "P"
		obj.color = "#6968FF"
		obj.isfull = 0
		obj.isdraw = 1
	}

	obj = dataobjs[idx - 30]
	if (obj != undefined) {
		obj.qrs = "P2"
		obj.color = "#6968FF"
		obj.isfull = 1
		obj.isdraw = 1
	}

	// obj = dataobjs[idx-10]
	// obj.qrs = "QRSS"
	// obj.color = "#C80100"
	// obj.isfull = 1
	// obj.isdraw = 0

	obj = dataobjs[idx - 9]
	if (obj != undefined) {
		obj.qrs = "Q"
		obj.color = "#C80100"
		obj.isfull = 1
		obj.isdraw = 1
	}

	obj = dataobjs[idx]
	if (obj != undefined) {
		obj.qrs = "R"
		obj.color = "#C80100"
		obj.isfull = 0
		obj.isdraw = 1
	}

	obj = dataobjs[idx + 10]
	if (obj != undefined) {
		obj.qrs = "J"
		obj.color = "#C80100"
		obj.isfull = 1
		obj.isdraw = 1
	}

	// obj = dataobjs[idx+12]
	// obj.qrs = "QRSE"
	// obj.color = "#C80100"
	// obj.isfull = 1
	// obj.isdraw = 0

	// obj = dataobjs[idx+22]
	// obj.qrs = "ST"
	// obj.color = "#D2D4D1"
	// obj.isfull = 1
	// obj.isdraw = 0

	obj = dataobjs[idx + 50]
	if (obj != undefined) {
		obj.qrs = "T1"
		obj.color = "#D2D4D1"
		obj.isfull = 0
		obj.isdraw = 1
	}

	obj = dataobjs[idx + 75]
	if (obj != undefined) {
		obj.qrs = "T"
		obj.color = "#D2D4D1"
		obj.isfull = 0
		obj.isdraw = 1
	}

	obj = dataobjs[idx + 87]
	if (obj != undefined) {
		obj.qrs = "T2"
		obj.color = "#D2D4D1"
		obj.isfull = 1
		obj.isdraw = 1
	}

}


function setarrdataupfile(arrdata, idx, flag, i, result) {

	if (prepoint != undefined && prepoint != 0) {
		let midx = parseInt((prepoint + idx) / 2)
		if (midx != NaN) {
			let item = {}
			item.distance = parseInt((idx - prepoint) * 1000 / 250)
			item.heartRate = parseInt(60000 / item.distance)
			item.idx = idx
			mdxdatas[midx] = item
		}
	}
	prepoint = idx

	dataobjs[idx].flag = flag
	let idxitem = {}
	idxitem.flag = flag
	switch (flag) {
		case 0 || 1:
			idxitem.txtflag = "N";
			break;
		case 8:
			idxitem.txtflag = "S";
			break;
		case 34:
			idxitem.txtflag = "SE";
			break;
		case 5:
			idxitem.txtflag = "V";
			break;
		case 10:
			idxitem.txtflag = "VE";
			break;
		case 7:
			idxitem.txtflag = "J";
			break;
		case 11:
			idxitem.txtflag = "JE";
			break;
		case 43:
			idxitem.txtflag = "Af";
			break;
		case 42:
			idxitem.txtflag = "AF";
			break;
		case 44:
			idxitem.txtflag = "C";
			break;
		case 13:
			idxitem.txtflag = "X";
			break;
		case 51:
			idxitem.txtflag = "P";
			break;
		case 50:
			idxitem.txtflag = "A";
			break;
		case 52:
			idxitem.txtflag = "D";
			break;
		case 45 || 99:
			idxitem.txtflag = "R";
			break;
		default:
			idxitem.txtflag = "N";
	}
	idxitem.idx = idx
	idxitem.subidx = i;
	
	//修改记录
	if ( g_modifAreaIdx != undefined && g_modifAreaIdx == idx){
		idxitem.modif = 1
	}

	idxdatas[idx] = idxitem

	// 向前推 34 个点
	for (let i = idx; i > idx - 34; i--) {
		if (dataobjs[i] != undefined) {
			dataobjs[i].flag = flag
		}

	}
	// 向后推 34 个点
	for (let i = idx + 1; i <= idx + 34; i++) {
		if (dataobjs[i] != undefined) {
			dataobjs[i].flag = flag
		}
	}

	// x 轴偏移像素，计算定位线
	//QRS波群信息位置结构体
	// typedef struct _QRSINFOR
	// {
	// 	int P_S_W;   //P波起点位置       R-200ms     -50
	// 	int P_W;     //P波位置              R-160ms  -40
	// 	int P_F_W;   //P波终点位置        R-120ms    -30
	// 	int QRS_S_W; //QRS起点位置     R-40ms        -10
	// 	int Q_W;     //Q波位置                R-35ms -9
	// 	int R_W;     //R波位置                   R
	// 	int S_W;     //S波位置                   R+40ms 10
	// 	int QRS_F_W; //QRS终点位置       R+50ms          12
	// 	int ST_W;    //ST段位置                   R+90ms 22
	// 	int T_S_W;   //T波起点位置              R+200ms  50
	// 	int T_W;     //T波位置                        R+300ms 75
	// 	int T_F_W;   //T波终点位置              R+350ms       87
	// 	char type;   //QRS形态                    0  1  2    0
	// 	bool RT_di;  //RT方向是否一致，一致时为0          1   1
	// 
	// }QRSINFOR;
	let obj = dataobjs[result.qrsInfo.p_s_w[i]]
	if (obj != undefined) {
		obj.qrs = "P1"
		obj.color = "#6968FF"
		obj.isfull = 1 // 1.实线  0.虚线
		obj.isdraw = 1 // 是否画
	}

	obj = dataobjs[result.qrsInfo.p_w[i]]
	if (obj != undefined) {
		obj.qrs = "P"
		obj.color = "#6968FF"
		obj.isfull = 0
		obj.isdraw = 1
	}

	obj = dataobjs[result.qrsInfo.p_f_w[i]]
	if (obj != undefined) {
		obj.qrs = "P2"
		obj.color = "#6968FF"
		obj.isfull = 1
		obj.isdraw = 1
	}

	obj = dataobjs[result.qrsInfo.qrs_s_w[i]]
	if (obj != undefined) {
		obj.qrs = "Q"
		obj.color = "#C80100"
		obj.isfull = 1
		obj.isdraw = 1
	}


	obj = dataobjs[result.qrsInfo.r_w[i]]
	if (obj != undefined) {
		obj.qrs = "R"
		obj.color = "#C80100"
		obj.isfull = 0
		obj.isdraw = 1

		let qrsInfo = {}
		qrsInfo.p_f_w = result.qrsInfo.p_f_w[i]
		qrsInfo.p_s_w = result.qrsInfo.p_s_w[i]
		qrsInfo.p_w = result.qrsInfo.p_w[i]
		qrsInfo.q_w = result.qrsInfo.q_w[i]
		qrsInfo.qrs_s_w = result.qrsInfo.qrs_s_w[i]
		qrsInfo.r_w = result.qrsInfo.r_w[i]
		qrsInfo.qrs_f_w = result.qrsInfo.qrs_f_w[i]
		qrsInfo.rt_di = result.qrsInfo.rt_di[i]
		qrsInfo.s_w = result.qrsInfo.s_w[i]
		qrsInfo.st_w = result.qrsInfo.st_w[i]
		qrsInfo.t_f_w = result.qrsInfo.t_f_w[i]
		qrsInfo.t_s_w = result.qrsInfo.t_s_w[i]
		qrsInfo.t_w = result.qrsInfo.t_w[i]
		qrsInfo.type = result.qrsInfo.type[i]

		obj.qrsInfo = qrsInfo
	}


	obj = dataobjs[result.qrsInfo.qrs_f_w[i]]
	if (obj != undefined) {
		obj.qrs = "J"
		obj.color = "#C80100"
		obj.isfull = 1
		obj.isdraw = 1
	}


	obj = dataobjs[result.qrsInfo.st_w[i]]
	if (obj != undefined) {
		obj.qrs = "ST"
		obj.color = "#D2D4D1"
		obj.isfull = 1
		obj.isdraw = 1
	}

	//	obj = dataobjs[result.qrsInfo.t_s_w[i]]
	//	if (obj != undefined) {
	//		obj.qrs = "T1"
	//		obj.color = "#D2D4D1"
	//		obj.isfull = 0
	//		obj.isdraw = 1
	//	}

	obj = dataobjs[result.qrsInfo.t_w[i]]
	if (obj != undefined) {
		obj.qrs = "T"
		obj.color = "#D2D4D1"
		obj.isfull = 0
		obj.isdraw = 1
	}

	obj = dataobjs[result.qrsInfo.t_f_w[i]]
	if (obj != undefined) {
		obj.qrs = "T2"
		obj.color = "#D2D4D1"
		obj.isfull = 1
		obj.isdraw = 1
	}

}

function setarrdataFlag(arrdata, idx, flag) {

	dataobjs[idx].flag = flag

	let idxitem = idxdatas[idx]
	idxitem.flag = flag
	switch (flag) {
		case 0 || 1:
			idxitem.txtflag = "N";
			break;
		case 8:
			idxitem.txtflag = "S";
			break;
		case 34:
			idxitem.txtflag = "SE";
			break;
		case 5:
			idxitem.txtflag = "V";
			break;
		case 10:
			idxitem.txtflag = "VE";
			break;
		case 7:
			idxitem.txtflag = "J";
			break;
		case 11:
			idxitem.txtflag = "JE";
			break;
		case 43:
			idxitem.txtflag = "Af";
			break;
		case 42:
			idxitem.txtflag = "AF";
			break;
		case 44:
			idxitem.txtflag = "C";
			break;
		case 13:
			idxitem.txtflag = "X";
			break;
		case 51:
			idxitem.txtflag = "P";
			break;
		case 50:
			idxitem.txtflag = "A";
			break;
		case 52:
			idxitem.txtflag = "D";
			break;
		case 45 || 99:
			idxitem.txtflag = "R";
			break;
		default:
			idxitem.txtflag = "N";
	}


	idxdatas[idx] = idxitem

	// 向前推 34 个点
	for (let i = idx; i > idx - 34; i--) {
		dataobjs[i].flag = flag
	}
	// 向后推 34 个点
	for (let i = idx + 1; i <= idx + 34; i++) {
		dataobjs[i].flag = flag
	}

}

function getRealIdx(idx) {
	// 向前找34个索引位置
	for (let i = idx; i > (idx - 34); i--) {
		if (idxdatas[i] != undefined) {
			return i
		}
	}
	// 向后找34个索引位置
	for (let i = idx; i < (idx + 34); i++) {
		if (idxdatas[i] != undefined) {
			return i
		}
	}
}

function getRealIdxs(idx) {
	// 向前找34个索引位置
	//	console.log(idx)
	//	console.log(idxdatas)
	//	console.log(idxdatas[idx])
	return idx
}

function getRealIdxNearby(idx) {

	let pidx = 0;
	let nidx = 0;
	// 向前找2500个索引位置
	for (let i = idx; i > (idx + 2500); i--) {
		if (idxdatas[i] != undefined) {
			pidx = i;
			break
		}
	}
	// 向后找2500个索引位置
	for (let i = idx; i < (idx + 2500); i++) {
		if (idxdatas[i] != undefined) {
			nidx = i;
			break
		}
	}

	if (pidx > nidx) {
		return pidx
	} else {
		return nidx
	}

}

function getRealIdxNearMin(idx) {

	let pidx = 0;
	// 向前找2500个索引位置
	for (let i = idx; i > 0 && i > (idx - 2500); i--) {
		if (idxdatas[i] != undefined) {
			pidx = i;
			break
		}
	}
	if (pidx == 0) {
		for (let idx in idxdatas) {
			pidx = idx;
			break
		}
		if (pidx == 0) {
			// 向后找2500个索引位置
			for (let i = idx; i < (idx + 2500); i++) {
				if (idxdatas[i] != undefined) {
					pidx = i;
					break
				}
			}
		}
	}
	return pidx
}

function getRealIdxNearMax(idx) {

	let nidx = 0;
	// 向后找2500个索引位置
	for (let i = idx; i < (idx + 2500); i++) {
		if (idxdatas[i] != undefined) {
			nidx = i;
			break
		}
	}
	if (nidx == 0) {
		let tmp = idxdatas.pop()
		if (tmp == undefined) {
			return nidx
		}
		nidx = tmp.idx
		idxdatas[nidx] = tmp

	}
	return nidx
}





//控制低格
function existsgrid(flag) {
	g_flag = flag;
	ecgdraw();
	g_grid_exists == true ? $("#lowgird").addClass('active') : $("#lowgird").removeClass('active');
}

function gridpos() {
	g_grid_pos_flag = !g_grid_pos_flag
	ecgdraw();
	g_grid_pos_flag == true ? $("#lowpos").addClass('active') : $("#lowpos").removeClass('active');
}


//控制增益
function gaingrid(pmv) {
	g_mmPmV = pmv;
	$('#rulerDiv > .rulerVertical > .scale > div').each(function () {
		let index = $(this).attr('index'); // 5 10 15 20 25 30 35 40
		let value = pmv;
		value = index * value * 0.01;
		$(this).html(value);
	});

	switch (pmv) {
		case 2.5:
			$("#gain").text("增益程度 40");
			break;
		case 5:
			$("#gain").text("增益程度 20");
			break;
		case 10:
			$("#gain").text("增益程度 10");
			break;
		case 20:
			$("#gain").text("增益程度 5");
			break;
		default:
			$("#gain").text("增益程度");
	}
	
	updateClickAreaWH();
	
	ecgdraw();
}

// 控制走纸速度
function paperSpeed(ps) {
	g_mmPs = ps;
	$('#rulerDiv > .rulerHorizontal > .scale > div').each(function () {
		let index = $(this).attr('index');
		let value = ps;
		value = (index * 0.04) * (value * 0.02) * 0.02;
		$(this).html(value.toFixed(1));
	});
	switch (ps) {
		case 1250:
			$("#paper").text("走纸速度 50");
			g_fullTime = 20;
			g_navrectwidth = g_coverWidth / 2
			break;
		case 2500:
			$("#paper").text("走纸速度 25");
			g_fullTime = 40
			g_navrectwidth = g_coverWidth
			break;
		case 5000:
			$("#paper").text("走纸速度 12.5");
			g_fullTime = 80
			g_navrectwidth = g_coverWidth * 2
			break;
		default:
			$("#paper").text("走纸速度");
	}
	
	updateClickAreaWH();
	
	ecgdraw();
	
}

function updateClickAreaWH(){
	
	// 调整 框选中的框宽和高
	if(g_mmPmV == 20){
		g_clickArea_h = 30
	}else if(g_mmPmV == 5){
		g_clickArea_h = 80
	}else if(g_mmPmV == 2.5){
		g_clickArea_h = 100
	}else {
		g_clickArea_h = 60
	}
	
	if ( g_mmPs == 1250){
		g_clickArea_w = 50
		g_clickArea_x = -10
	}else if( g_mmPs == 5000){
		g_clickArea_w = 10
		g_clickArea_x = 10
	}else{
		g_clickArea_w = 30
		g_clickArea_x = 0
	}
	
	
}



function insertQRS(nsv, x, y) {
	// console.log(nsv)
	// console.log(x)
	// console.log(y)
	// console.log("idx:"+g_right_idx)

	let flag = 0;
	if (nsv == 'N') {
		flag = 0;
	} else if (nsv == 'S') {
		flag = 1;
	} else if (nsv == 'V') {
		flag = 2;
	}
	// 找到前一个 
	let pitem = undefined;
	for (let i = g_right_idx; i > 0; i--) {
		let obj = idxdatas[i];
		if (obj != undefined) {
			pitem = obj;
			break;
		}
	}
	if (pitem == undefined) {
		pitem = dataobjs[0];
	}

	// 找到后一个 idx
	let nitem = undefined;
	for (let i = g_right_idx; i < dataobjs.length; i++) {
		let obj = idxdatas[i];
		if (obj != undefined) {
			nitem = obj;
			break;
		}
	}
	if (nitem == undefined) {
		nitem = dataobjs[dataobjs.length - 1];
	}

	if (pitem != undefined && nitem != undefined) {
		let midx = parseInt((pitem.idx + nitem.idx) / 2);

		mdxdatas[midx] = undefined;

		prepoint = pitem.idx;
		setarrdata(dataobjs, parseInt(g_right_idx), flag);

		if (nitem != undefined && nitem.txtflag != undefined) {
			prepoint = g_right_idx;
			setarrdata(dataobjs, parseInt(nitem.idx), nitem.flag);
		}

		ecgdraw();
	}
}



function showscle() {
	if (Line.on == true) {
		Line.unbind();
	} else {
		Line.bind();
	}
}
function showrule() {
	$('#rulerDiv').toggle();

	let show = $('#rulerDiv').css("display") == "block";

	if (show) {
		$("#scale").addClass("active");
	} else {
		$("#scale").removeClass("active");
	}
}


function fakeClick(obj) {
	var ev = document.createEvent("MouseEvents");
	ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	obj.dispatchEvent(ev);
}

function exportRaw(name, data) {
	var urlObject = window.URL || window.webkitURL || window;
	var export_blob = new Blob([data]);
	var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
	save_link.href = urlObject.createObjectURL(export_blob);
	save_link.download = name;
	fakeClick(save_link);
}



// 获取localstorage医生id信息
function getLocalInfo(k) {
    let x = localStorage.getItem(k);
    if (x == null || x == undefined) {
        return;
    }
    return x;
}


// 获取localstorage
function getLocal(k) {
    let x = localStorage.getItem(k);
    if (x == null || x == undefined) {
        return;
    }
    return x;
}

// 设置localstorage
function setLocal(k,v) {
    localStorage.setItem(k,v);
}

// 删除localstorage
function delLocal(k) {
    localStorage.removeItem(k);
}

function alertx(msg){
	jqueryAlert({
    	'style':'pc',
		'content' : msg,
		'closeTime' : 2000
	}).show()
}
