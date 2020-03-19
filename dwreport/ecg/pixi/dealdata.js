var _realData = function(that) {

	var width = 375; //that.width 			//宽
	var height = 220; //that.height		//高
	var ecgdata = that.ecgdata //数据
	var idx = that.idx //第几行
	var speed = that.speed //速度

	var off_w = that.off_w
	var off_h = that.off_h

	// 全局 数据下标
	var g_idx = 0
	// 每画完一组3秒数据 750个点,重新计算
	var g_sub_idx = 0
	var g_sub_x = 0
	var g_sub_width = (width / 750) * 10

	// 数据是否取完标识
	var g_data_flag = true

	// 开启与暂停标识
	var g_start_stop_flag = 0

	// 1.一级buff缓冲： 处理数据进入到 循环数组 750个元素
	var bufidx = setInterval(dealArrayBuff, speed);

	var dataarr = new Array(755);

	var begin = new Date();

	// 1. 处理数据到 buff 中 750 数组
	function dealArrayBuff() {
		var data = getData(ecgdata)
		if(data == undefined) {
			g_data_flag = false
			g_start_stop_flag = 2
			return dataarr
		}
		if(idx == 1) {
			idx
		}
		if(g_start_stop_flag == 2) {
			g_start_stop_flag = 1
		}

		g_data_flag = true

		if(g_sub_idx > 750) {

			g_sub_idx = 0
		}
		var x = (g_sub_idx * width) / 750 + off_w * 390;
		var y = idx * 25 - (data * 78) / 150 + off_h * 220;

		var item = dataarr[g_sub_idx]
		if(item == undefined) {
			item = {}
		}
		item.x = x
		item.y = y
		dataarr[g_sub_idx] = item
		g_sub_x = x

		// 制造缺口
		for(var i = g_sub_idx + 1; i < g_sub_idx + 5; i++) {
			var next = dataarr[i]
			if(next == undefined) {
				next = {}
			}
			next.y = 0
			dataarr[i] = next
		}

		if(idx == 1) {
			DRAWECG[that.i].dataarr = dataarr
		} else if(idx == 2) {
			DRAWECGV1[that.i].dataarr = dataarr
		} else if(idx == 3) {
			DRAWECGV2[that.i].dataarr = dataarr
		} else if(idx == 4) {
			DRAWECGV3[that.i].dataarr = dataarr
		} else if(idx == 5) {
			DRAWBREATHE[that.i].dataarr = dataarr
		} else if(idx == 6) {
			DRAWBLOOD[that.i].dataarr = dataarr
		} else if(idx == 7) {
			DRAWBLOODV1[that.i].dataarr = dataarr
		} else if(idx == 8) {
			DRAWBLOODV2[that.i].dataarr = dataarr
		}
		g_sub_idx++
	}

	function getData(ecgdata) {
		var data = ecgdata[g_idx]
		if(data != undefined) {
			g_idx++
		}
		return data
	}

}

var drawToMem = function(app) {
	
	
	for(let i = 0; i < DRAWECG.length; i++) {
		var dataarr = DRAWECG[i].dataarr
		var line = DRAWECG[i].line;
		
		if(dataarr.length == 0) {
			continue
		}

		let flag = true
		for(let j = 0; j < dataarr.length; j++) {
			let item = dataarr[j]
			if(item != undefined && item.y != undefined) {
				if(item.y == 0) {
					flag = true
				} else if(item.y != 0) {
					if(flag) {
						line.moveTo(item.x, item.y);
						flag = false
					}
					line.lineTo(item.x, item.y);
				}
			}
		}
		
	}
	renderer.render(app.stage);
}