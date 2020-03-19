$(function () {

	g_main_top_xy = getDivPosition("maindiv");
	g_navcanvas_xy = getDivPosition('navcanvas');
	g_charcanvas_xy = getDivPosition('chartcanvas');
	g_qrscanvas_xy = getDivPosition('qrs')

	// 初始化颜色设置插件
	$('.bgcolor').colorPicker({
		opacity: false,
		forceAlpha: false,
		buildCallback: function ($elm) {
			$('.cp-xy-slider,.cp-z-slider').on('click', function () {
				$elm.hide();
			});
		}
	});
	// 打开设置
	$('.inco_set').on('click', () => {
		$('.mask.set').fadeIn();
	});
	$('.set_title').on('click',function(){
		$('.set_body').css('display','block')
		$('.about_body').css('display','none')
		$('.set_show').css('display','flex')
		$('.about_show').css('display','none')
		$('.set_title').css('color','#238AFF')
		$('.about_title').css('color','#ffffff')
	})
	$('.about_title').on('click',function(){
		$('.set_body').css('display','none')
		$('.about_body').css('display','block') 
		$('.about_show').css('display','block')
		$('.set_show').css('display','none')
		$('.set_title').css('color','#ffffff')
		$('.about_title').css('color','#238AFF')
	})
	
	
	
	
	// 低格线亮度调整
	$('.inco_set_window .foot #brightness').on('change', function () {
		if (this.value == 1) {
			g_globalAlpha = ".1";
			ecgdraw();
		}
		if (this.value == 3) {
			g_globalAlpha = ".3";
			ecgdraw();
		}
		if (this.value == 6) {
			g_globalAlpha = ".6";
			ecgdraw();
		}
		if (this.value == 9) {
			g_globalAlpha = ".9";
			ecgdraw();
		}
	});
	// 保存设置信息
	$('.inco_set_window>.foot>span>.btn.confirm').on('click', () => {
		getColor();
		let url = g_domain + '/dws/',
			param = {
				method: 'POST',
				headers: {
					"doctorId": g_doctorId,
					"token": g_token
				},
				body: data = JSON.stringify({
					"reqHead": {
						"functionId": "DWS001004002",
					},
					"body": {
						"doctorId": g_doctorId,
						"normalInfo": colorArr[1], // 窦性心律
						"apbInfo": colorArr[8], // 房性早博
						"aebInfo": colorArr[34], // 房性逸博
						"rontInfo": colorArr[5], // 室早、R - on - T
						"vebInfo": colorArr[10], // 室性逸博
						"bpbInfo": colorArr[7], // 交界性早搏
						"jebInfo": colorArr[11], // 交界性逸博
						"atrialFibrillation": colorArr[43], // 房颤
						"atrialFlutter": colorArr[42], // 房扑
						"aberrantConductionInfo": colorArr[44], // 差异传导
						"artifactInfo": colorArr[13], // 伪差
						"vviInfo": colorArr[51], // 心室起搏
						"aaiInfo": colorArr[50], // 心房起搏
						"dddInfo": colorArr[52] // 房式顺序起搏
					}
				}),
			};
		fetch(url, param).then(res => {
			if (res.ok) {
				return res.json();
			} else {
				console.log(res);
			}
		}).then(data => {
			if (data.respHead != undefined && data.respHead.respCode == 002) {
				alertx("登陆超时，请重新登陆!");
				let localUrl = window.location.href
				if (localUrl.split("?").length > 1) {
					window.location.href = g_admin_ui
				} else {
					window.location.href = g_domain_ui + "login.html"
				}
			}
			setColor(colorArr[1], colorArr[8], colorArr[34], colorArr[5], colorArr[10], colorArr[7], colorArr[11], colorArr[43], colorArr[42],colorArr[44],colorArr[13], colorArr[51], colorArr[50], colorArr[52]);
			$('.mask.set').fadeOut();
		}).catch(err => {
			console.log(err);
		})
	});
	// 关闭设置
	$('.inco_set_window>.foot>span>.btn.cancel').on('click', () => {
		setColor(colorArr[1], colorArr[8], colorArr[34], colorArr[5], colorArr[10], colorArr[7], colorArr[11], colorArr[43],colorArr[42],colorArr[44], colorArr[13], colorArr[51], colorArr[50], colorArr[52]);
		$('.mask.set').fadeOut();
	});
	// 退出按钮
	$('.inco_exit').on('click', function () {
		localStorage.clear();
		sessionStorage.clear();
		window.location.href = window.location.href + "login.html"
	});
	// 保存编辑框内容
	$('.showqrs>.foot>span>.btn.confirm').on('click', () => {
		g_isSelected = 0;
		if (g_check_qrsinfo == undefined) {
			$('.mask.qrs').fadeOut();
			return
		}
		let qrsChangePos = [], subidx = 0;
		
		g_modifAreaIdx = g_check_qrsinfo.idx
		let changeSub = g_check_qrsinfo.subidx
		qrsChangePos[0] = changeSub;

		qrsinfo = g_check_qrsinfo.qrsInfo;
		let url = g_domain + '/dws/',
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
						"qrsInfo": qrsinfo,
						"style": 0,
						"reportIdStr":g_reportId,
						"qrsH":g_qrs_h
					}
				}),
			};
		fetch(url, param).then(res => {
			if (res.ok) {
				return res.json();
			} else {
				console.log(res);
			}
		}).then(data => {
			if (data.respHead != undefined && data.respHead.respCode == 002) {
				alertx("登陆超时，请重新登陆!");
				let localUrl = window.location.href
				if (localUrl.split("?").length > 1) {
					window.location.href = g_admin_ui
				} else {
					window.location.href = g_domain_ui + "login.html"
				}
			}
			if (data.respHead.respCode == "001") {
				alertx(data.respHead.respMsg);
				return;
			}

			let qrsChanged = data.body.data.qrsMesureReq;

			$('.mask.qrs').fadeOut();
			
			for(let obj  in g_subdatas){
				if ( obj.idx == g_check_qrsinfo.idx){
					
				}
			}
			
			g_check_qrsinfo.idx = g_check_qrsinfo.qrsInfo.r_w;

			objCompare(qrsChanged, g_basic_index);

			Object.keys(g_objChanged).forEach(function (key) {

				let num = g_objChanged[key]
				let numstr = '' + num;
				if (numstr.indexOf('.') != -1) {
					num = num.toFixed(2);
				}

				setText(key, num);

				$("#" + key).parent().css("background", "rgba(218, 83, 83, 0.35)");

			});

			//处理波形数据
			dealData(data)
//			console.log(data)
			alertx("定位修改成功！");
		}).catch(err => {
			console.log(err);
		})
	});
	// 关闭编辑框
	$('.showqrs>.foot>span>.btn.cancel').on('click', () => {
		$('.mask.qrs').fadeOut();
	});
	// 打开数据
	$('#open').on('click', function () {
		$('#upload').click();
	});
	// 上传ECG文件
	$('#upload').on('change', function () {
		if ( datas != undefined && datas.length > 0 ){
			if(!confirm('本次分析结果会被覆盖，是否继续？')){
				return;
			}
		}
		$('#m').fadeIn();
		

		let formData = new FormData();
		let file = this.files[0];
		if (file == undefined) {
			$('#m').fadeOut();
			return;
		}
		let fileName = /\.(ecg|ECG|hecg|HECG|Hecg)$/.test(file.name);
		if (!fileName) {
			alertx("请选择ecg、hecg文件");
			$('#m').fadeOut();
			return;
		}
		formData.append('file', file);
		formData.append('fileName', file.name);
		var ecgSize = file.size;
		let ecgSec = (ecgSize - 20) / 521;

		if (ecgSec < 30 || ecgSec > 300) {
			alertx("数据时长有误");
			$('#m').fadeOut();
			return;
		}
		let url = g_domain + '/dws/ecg/analyze',
			// let url = 'http://192.168.1.213:2160/dws/ecg/analyze',
			param = {
				method: 'POST',
				headers: {
					"doctorId": g_doctorId,
					"token": g_token
				},
				body: formData,
			};
		fetch(url, param).then(res => {
			if (res.ok) {
				return res.json();
			} else {
				console.log(res);
			}
		}).then(data => {
			if (data.respHead != undefined && data.respHead.respCode == 002) {
				alertx("登陆超时，请重新登陆!");
				let localUrl = window.location.href
				if (localUrl.split("?").length > 1) {
					window.location.href = g_admin_ui
				} else {
					window.location.href = g_domain_ui + "login.html"
				}
			}
			if (data.respHead != undefined && data.respHead.respCode == "001") {
				alertx(data.respHead.respMsg);
				$("#upload").val("");
				$('#m').fadeOut();
				return;
			}
			
			$('#sub_age').val("");
			$('#sub_emergencyTelephone').val("");
			$('#sub_height').val("");
			$('#sub_name').val("");
			$('#sub_sex').val("2");
			$('#sub_weight').val("");
		
			if (data.ecg_level < 0) {
				alertx(data.ecg_result);
				location.reload();
				return;
			} else {
				g_startTime = data.takeTime
				g_offx = 0;
				// 采样点数据
				datas = [];
				// qrs info 数据
				idxdata;
				
				// QRS 中心坐标
				idxdatas = []
				
				// QRS 之间坐标
				mdxdatas = []
				
				g_clickX = 0
				prepoint = 0;
				
				// 处理后的采样点数据
				dataobjs = []
				
				// 滚动距离重置
				g_x = 0
				
				g_reportId = data.reportIdStr;
				insert();

				$('#m').fadeOut();
				$(".btns-group,.navs>.item,#insert,.ecg_result_body,.sub_userinfo").removeClass("stop_event");
				$(".ecg_result_body").val("");
				$("#upload").val("");
				let result = data;
				anaecgFileid = data.anaecgFileid
				
				// 把anaecgFileid放入到cookie
				setLocal("anaecgFileid",anaecgFileid)

				// 1. 心电印象
				$('.ecg_impression_body').text(data.ecg_result_tz);
				if (result.ecg_level != undefined && result.ecg_level == -1) {
					ecgdraw();
					return
				}

				// 心率
				setText('heartH', result.hr)
				// 2. 获取原始采样点
				getHeartDataByUrl("/pacs/get_ecg_voltage?file=" + data.rrDats + "&begin=1&end=300&filter=0&reduce_sampling_rate=0", function (ecgdata, startTime, dataLength) {
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

					var arrdatarw = result.qrsInfo.r_w
					var arrtype = result.qrsInfo.type
					if (arrdatarw != undefined) {

						g_endTime = g_startTime + ecgSec * 1000

						g_ecgSec = ecgSec

						g_bottom_min = parseInt(ecgSec / 60)
						g_bottom_sec = parseInt(ecgSec % 60)
						g_bottom_total_idx = arrdatarw.length

						g_coverWidth = (40 / ecgSec) * 490
						if(g_fullTime == 20){
							g_navrectwidth = g_coverWidth / 2
						}else if(g_fullTime == 40){
							g_navrectwidth = g_coverWidth
						}else if(g_fullTime == 80){
							g_navrectwidth = g_coverWidth * 2
						}

						if ( g_bottom_sec <10 ){
							$("#u_length").text(`数据长度：${g_bottom_min}分0${g_bottom_sec}秒`)
						}else{
							$("#u_length").text(`数据长度：${g_bottom_min}分${g_bottom_sec}秒`)
						}
								
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
					g_qrs_h = result.qrsMesure.qrsH;
				});
			}

		}).catch(err => {
			$('#m').fadeOut();
			console.log(err);
		});

	});

	setText = function (id, value) {
		
		min = g_index_data.get(id).min
		max = g_index_data.get(id).max
		mineq = g_index_data.get(id).min
		maxeq = g_index_data.get(id).max
		if (min == undefined && max == undefined) {
			$('#' + id).text(value)
			switch (id) {
				case "qrsF":
				case "pF":
				case "tF":
					$('#' + id).css("color", "");
					$('#' + id).text(`${value === 0 ? "向上" : "向下"}`)
					if($('#' + id).text()!="向上") {
						$('#' + id).css("color", "red");
					}
					break
				case "pY":
					let py_arr = ["直立圆钝", "切迹", "双峰", "正负双向", "负正双向"]
					$('#' + id).text(`${py_arr[value]}`)
					break
				case "prY":
				case "stY":
					let prY_arr = ["水平型", "上斜型", "下斜型"]
					if (prY_arr[value] != $('#' + id + '~span').text()) {
						$('#' + id).text(`${prY_arr[value]}`)
						$('#' + id).css("color", "red")
					} else {
						$('#' + id).css("color", "")
						$('#' + id).text(`${prY_arr[value]}`)
					}
					break
				case "jYn":
					$('#' + id).text(`${value === 0 ? "无" : "是"}`)
					break
				case "tY":
					let obj = {
						0: "直立圆钝",
						1: "高耸",
						2: "平坦",
						3: "倒置",
						4: "切迹",
						5: "双峰",
						6: "正负双向",
						7: "负正双向"
					}
					$('#' + id).text(`${obj[value]}`)
					break
				default:
					return ''
			}
		} else if (min == undefined && max != undefined) {
			if (value > max) {
				$('#' + id).text(value + "  ↑")
				$('#' + id).css("color", "red")
			} else {
				$('#' + id).css("color", "");
				$('#' + id).text(value)
			}
		} else if (min != undefined && max == undefined) {
			if (value < min) {
				$('#' + id).text(value + "  ↓")
				$('#' + id).css("color", "red")
			} else {
				$('#' + id).css("color", "");
				$('#' + id).text(value)
			}
		} else {
			if (value < min) {
				$('#' + id).text(value + "  ↓")
				$('#' + id).css("color", "red")
			} else if (value > max) {
				$('#' + id).text(value + "  ↑")
				$('#' + id).css("color", "red")
			} else {
				$('#' + id).css("color", "");
				$('#' + id).text(value)
			}
		}
		
		if(g_index_data.get(id).mineq){
			mineq = g_index_data.get(id).mineq
			if (mineq != undefined && maxeq == undefined) {
				if (value <= mineq) {
					$('#' + id).text(value + "  ↓")
					$('#' + id).css("color", "red")
				} else {
					$('#' + id).css("color", "");
					$('#' + id).text(value)
				}
			}
		}
		
		if(g_index_data.get(id).maxeq){
			maxeq = g_index_data.get(id).maxeq
			if (mineq == undefined && maxeq != undefined) {
				if (value >= maxeq) {
					$('#' + id).text(value + "  ↑")
					$('#' + id).css("color", "red")
				} else {
					$('#' + id).css("color", "");
					$('#' + id).text(value)
				}
			}
		}
		//大于10000
		if(g_index_data.get(id).maxeqd){
			maxeqda = g_index_data.get(id).maxeq.maxeqd
			if(mineqd ==undefined &&  maxeqda != undefined){
				if(value >= 10000){
					$('#' + id).text("  --")
					$('#' + id).css("color", "")
				}
			}
		}
		
		
	//   if(mineq !=undefined && max == undefined){
	//   if(value == mineq ){
	//	$('#' + id).text(value + "  ↓")
	//		$('#' + id).css("color", "red")
	//	   }else {
	//		$('#' + id).css("color", "");
	//		$('#' + id).text(value)  
	//	   }
	//   }
	//   if(mineq !=undefined && max == undefined){
	//	   if(value >=mineq  ){
	//		$('#' + id).text(value + "  ↑" )
	//		$('#' + id).css("color", "red")
	//	   }else if( value  <= mineq ){
	//		$('#' + id).text(value +"  ↓")
	//		$('#' + id).css("color", "red")
	//	   }else {
	//		$('#' + id).css("color", "");
	//		$('#' + id).text(value)
	//	   }
	//   }
	}
	// 报告预览
	$('.icon_preview,.show').on('click', function () {
		$('#m').fadeIn();
		$('#open').addClass("stop_event");
		if ($(this).hasClass('btns-group-active')) {
			$(this).removeClass("btns-group-active");
			$('.icon_preview span').text("报告预览");
			$('#m').fadeOut();
			$('#re_pre').fadeOut();
			$('#open,.sub_userinfo').removeClass("stop_event");
		} else {
			let interResult = $(".ecg_result_body").val();
			if (interResult == "") {
				alertx("请填写心电图结论");
				$('#open,.sub_userinfo').removeClass("stop_event");
				$('#m').fadeOut();
				return;
			};
			let url = g_domain + '/dws/',
				param = {
					method: 'POST',
					headers: {
						"doctorId": g_doctorId,
						"token": g_token
					},
					body: data = JSON.stringify({
						"reqHead": {
							"functionId": "DWS001003010",
						},
						"body": {
							"id": g_id,
							"ecgBeginIndex": g_offx,
							"interpretationResults": $(".ecg_result_body").val(),
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
				if (data.respHead != undefined && data.respHead.respCode == 002) {
					alertx("登陆超时，请重新登陆!");
					let localUrl = window.location.href
					if (localUrl.split("?").length > 1) {
						window.location.href = g_admin_ui
					} else {
						window.location.href = g_domain_ui + "login.html"
					}
				}
				$('#m').fadeOut();
				$(this).addClass("btns-group-active");
				$('.icon_preview span').text("返回分析");
				// 预览报告
				$('#re_pre img').attr("src", data.body.data);
				$('#re_pre').fadeIn();
			}).catch(e => {
				$('#m').fadeOut();
				alertx("网络服务中断，请检查网络连接！")
				console.log(e);
			});
		};

	})
	// 上传报告
	$('.icon_upload').on('click', function () {
		if(g_loginFlag){
			$('#m').fadeIn();
			let interResult = $(".ecg_result_body").val();
			if (interResult == "") {
				alertx("请填写心电图结论");
				$('#m').fadeOut();
				return;
			};
			let data = {
				"reqHead": {
					"functionId": "DWS001003002",
				},
				"body": {
					"id": g_id,
					"ecgBeginIndex": g_offx,
					"interpretationResults": interResult,
					"reportIdStr": g_reportId,
					"doctorId": g_doctorId,
				}
			},
				dataX = JSON.stringify(data),
				url = g_domain + '/dws/',
				param = {
					method: 'POST',
					headers: {
						"doctorId": g_doctorId,
						"token": g_token
					},
					body: dataX
				};
			fetch(url, param).then(res => {
				if (res.ok) {
					return res.json();
				} else {
					console.log(res);
				}
			}).then(data => {
				if (data.respHead != undefined && data.respHead.respCode == 002) {
					alertx("登陆超时，请重新登陆!");
					let localUrl = window.location.href
					if (localUrl.split("?").length > 1) {
						window.location.href = g_admin_ui
					} else {
						window.location.href = g_domain_ui + "login.html"
					}
				}
				alertx(data.respHead.respMsg);
				if (data.respHead.respCode == '000') {
					let localUrl = window.location.href
					if (localUrl.split("?").length > 1) {
						go_backs();
					} else {
						location.reload();
					}
				};
				$("#m").fadeOut();
			}).catch(err => {
				console.log(err);
			});
		}else{
			return
		}
	});
	// 导出报告
	$('.icon_export').on('click', function () {
		$('#m').fadeIn();
		let interResult = $(".ecg_result_body").val();
		if (interResult == "") {
			alertx("请填写心电图结论");
			$('#m').fadeOut();
			return;
		};
		let data = {
			"reqHead": {
				"functionId": "DWS001003011",
			},
			"body": {
				"id": g_id,
				"ecgBeginIndex": g_offx,
				"interpretationResults": $(".ecg_result_body").val(),
				"reportIdStr": g_reportId
			}
		},
			dataX = JSON.stringify(data),
			url = g_domain + '/dws/',
			param = {
				method: 'POST',
				headers: {
					"doctorId": g_doctorId,
					"token": g_token
				},
				body: dataX
			};
		fetch(url, param).then(res => {
			if (res.ok) {
				return res.json();
			} else {
				console.log(res);
			}
		}).then(data => {
			if (data.respHead != undefined && data.respHead.respCode == 002) {
				alertx("登陆超时，请重新登陆!");
				let localUrl = window.location.href
				if (localUrl.split("?").length > 1) {
					window.location.href = g_admin_ui
				} else {
					window.location.href = g_domain_ui + "login.html"
				}
			}
			$('#m').fadeOut();
			let content = data.body.data,
				fileName = content.match(/[^/]*(?=\.pdf)/);
			window.open(content);
//				xlink = document.createElement('a');
//
//			xlink.download = fileName;
//			xlink.href = content;
//			document.body.appendChild(xlink);
//			xlink.click();
//			document.body.removeChild(xlink);

		}).catch(err => {
			console.log(err);
		});
	});
	// 打印报告
	$('.icon_print').on('click', function () {
		$('#m').fadeIn();
		let interResult = $(".ecg_result_body").val();
		if (interResult == "") {
			alertx("请填写心电图结论");
			$('#m').fadeOut();
			return;
		};
		let url = g_domain + '/dws/',
			param = {
				method: 'POST',
				headers: {
					"doctorId": g_doctorId,
					"token": g_token
				},
				body: data = JSON.stringify({
					"reqHead": {
						"functionId": "DWS001003010",
					},
					"body": {
						"id": g_id,
						"ecgBeginIndex": g_offx,
						"interpretationResults": $(".ecg_result_body").val(),
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
			if (data.respHead != undefined && data.respHead.respCode == 002) {
				alertx("登陆超时，请重新登陆!");
				let localUrl = window.location.href
				if (localUrl.split("?").length > 1) {
					window.location.href = g_admin_ui
				} else {
					window.location.href = g_domain_ui + "login.html"
				}
			}
			$('#m').fadeOut();
			$("#print_img").attr("src", data.body.data);
			$("#print_img").show();
			Print("#print_img");
			$("#print_img").hide();
		}).catch(e => {
			$('#m').fadeOut();
			alertx("网络服务中断，请检查网络连接！")
			console.log(e);
		});

	});
	// 插入选中项操作
	$('#insert').on('change', () => {
		let ax = $(this).val();
		let ex = $('#insert option:selected').text();
		if ( ex === '请选择需要插入到心电结论'){
			return;
		}
		console.log(ax, ex);

		if ($(this).val() != 'none') {
			$('.ecg_result_body').val($('.ecg_result_body').val() + ex + '，');
		} else {
			return;
		}
	});

	$('#maindiv').bind('mousewheel', function (event) {
		var realScrollHeight = event.currentTarget.clientHeight + event.currentTarget.scrollTop;
		let pointNum;
		switch (g_fullTime) {
			case 20:
				pointNum = 5000;
				break;
			case 40:
				pointNum = 10000;
				break;
			case 80:
				pointNum = 20000;
				break;
		}
		if (event.originalEvent.wheelDelta > 0) {
			g_isSelected = 0;
			//向上滚动
			if ((g_offx - pointNum) >= 0) { // 10000 40秒的数据
				//g_clickArea = [];
				g_clickLine = [];
				g_offx -= pointNum // 10000 40秒的数据
				ecgdraw();
				g_x -= (pointNum / 250) / g_ecgSec * 490
				if (g_x < 0) {
					g_x = 0
				}
				scrollout(g_x)
				canvasout()
			} else if (g_offx > 0) {
				g_offx = 0
				ecgdraw();
				g_x -= (pointNum / 250) / g_ecgSec * 490
				if (g_x < 0) {
					g_x = 0
				}
				scrollout(g_x)
				canvasout()
			}

			return true;
		}
		if (event.originalEvent.wheelDelta < 0) {
			g_isSelected = 0;
			//向下滚动
			if ((g_offx + pointNum) < g_data_total) { // 10000 40秒的数据
				//g_clickArea = [];
				g_clickLine = [];
				g_offx += pointNum // 10000 40秒的数据
				ecgdraw();
				g_x += (pointNum / 250) / g_ecgSec * 490
				scrollout(g_x)
				canvasout()
			}

			return true;
		}

		return true;
	});

	// 心电图结论区热键绑定及解绑
	$(".ecg_result_body").on("focus", function () {
		$.each(key, function (i, e) {
			let item = (/[\+]+/.test(key[i])) ? key[i].replace("+", "_") : key[i];
			let _this = $('.item.' + item);

			$(document).unbind('keydown', key[i]);
		});
	});

	$(".ecg_result_body").on("blur", function () {
		hotkey();
	});
	
	// 用户输入热键绑定及解绑
	$(".input_hot_key").on("focus", function () {
		$.each(key, function (i, e) {
			let item = (/[\+]+/.test(key[i])) ? key[i].replace("+", "_") : key[i];
			let _this = $('.item.' + item);

			$(document).unbind('keydown', key[i]);
		});
	});

	$(".input_hot_key").on("blur", function () {
		hotkey();
	});
	
	insert();
	keyColor();
	hotkey();

	// 加载待插入数据
	function insert() {
		$('#insert').empty();
		let url = g_domain + '/dws/',
			param = {
				method: 'POST',
				headers: {
					"doctorId": g_doctorId,
					"token": g_token
				},
				body: data = JSON.stringify({
					"reqHead": {
						"functionId": "DWS001002006",
					},
					"body": ""
				}),
			};
		fetch(url, param).then(res => {
			if (res.ok) {
				return res.json();
			} else {
				console.log(res);
			}
		}).then(data => {
			let json = data.body.data;
			$('#insert').append("<option value='none'>请选择需要插入到心电结论</option>");
			$.each(json, (index, item) => {
				$('#insert').append("<option value='" + index + "'>" + item + "</option>")
			});
		}).catch(e => {
			alertx("网络服务中断，请检查网络连接！")
			console.log("err", e);
			$('#insert').append("<option value='none'>服务器连接失败</option>");
		});
	};
	// 查询设置颜色
	function keyColor() {
		let url = g_domain + '/dws/',
			param = {
				method: 'POST',
				headers: {
					"doctorId": g_doctorId,
					"token": g_token
				},
				body: data = JSON.stringify({
					"reqHead": {
						"functionId": "DWS001004001",
					},
					"body": {
						"doctorId": g_doctorId
					}
				}),
			};
		fetch(url, param).then(res => {
			if (res.ok) {
				return res.json();
			} else {
				console.log(res);
			}
		}).then(data => {
			// 初次进入时查询默认颜色是否设置
			let color = data.body.data;
			
			colorArr[1] = color.normalInfo;
			colorArr[8] = color.apbInfo;
			colorArr[34] = color.aebInfo;
			colorArr[5] = color.rontInfo;
			colorArr[10] = color.vebInfo;
			colorArr[7] = color.bpbInfo;
			colorArr[11] = color.jebInfo;
			colorArr[43] = color.atrialFibrillation;
			colorArr[42] = color.atrialFlutter;
			colorArr[44] = color.aberrantConductionInfo;
			colorArr[13] = color.artifactInfo;
			colorArr[51] = color.vviInfo;
			colorArr[50] = color.aaiInfo;
			colorArr[52] = color.dddInfo;
			
			colorArr[0] = "#32FF32";
			colorArr[45] = color.normalInfo;
			colorArr[99] = color.normalInfo;

			for (let e in colorArr) {
				if (colorArr[e] == "") {
					getColor();
				} else {
					setColor(colorArr[1], colorArr[8], colorArr[34], colorArr[5], colorArr[10], colorArr[7], colorArr[11], colorArr[43], colorArr[42],colorArr[44],colorArr[13], colorArr[51], colorArr[50], colorArr[52]);
					return;
				}
			}

		}).catch(err => {
			console.log(err);
		})
	}
	// 设置热键
	function hotkey() {
		$.each(key, function (i, e) {
			let item = (/[\+]+/.test(key[i])) ? key[i].replace("+", "_") : key[i];
			let _this = $('.item.' + item);
			let kflag = 0;

			// 绑定按键
			$(document).bind('keydown', key[i], function(event) {
				if(kflag > 0){
					return false;
				}
				if (_this.hasClass("active")) {
					_this.removeClass("active");
				} else {
					$(".navs .item.tip").removeClass("active");
					_this.addClass("active");
					if ( key[i] == 's'){
						chanceType(8)
					}else if ( key[i] == 'n'){
						chanceType(1)
					}else
					if ( key[i] == 'Ctrl+s'){
						chanceType(34)
					}else
					if ( key[i] == 'v'){
						chanceType(5)
					}else
					if ( key[i] == 'Ctrl+v'){
						chanceType(10)
					}else
					if ( key[i] == 'j'){
						chanceType(7)
					}else
					if ( key[i] == 'Ctrl+j'){
						chanceType(11)
					}else
					if ( key[i] == 'c'){
						chanceType(44)
					}else
					if ( key[i] == 'x'){
						chanceType(13)
					}else
					if ( key[i] == 'p'){
						chanceType(51)
					}else
					if ( key[i] == 'a'){
						chanceType(50)
					}else
					if ( key[i] == 'd'){
						chanceType(52)
					}else
					if ( key[i] == 'f'){
						chanceType(43)
					}else
					if ( key[i] == 'Ctrl+f'){
						chanceType(42)
					}
				}
				kflag++
				return false;
			});

			// 绑定按键
			$(document).bind('keyup', key[i], function(event) {
				kflag = 0;
				return false;
			});
			
			// 	绑定点击事件
			_this.on('click', function () {
				if (_this.hasClass("active")) {
					_this.removeClass("active");
				} else {
					$(".navs .item.tip").removeClass("active");
					_this.addClass("active");
				}
				return false;
			});
		});
	};
	// 获取设置窗口内背景色并从RGB转为HEX
	function getColor() {

		colorArr[1] = $('.bgcolor.n').css('background-color')
		colorArr[8] = $('.bgcolor.s').css('background-color')
		colorArr[34] = $('.bgcolor.se').css('background-color')
		colorArr[5] = $('.bgcolor.v').css('background-color')
		colorArr[10] = $('.bgcolor.ve').css('background-color')
		colorArr[7] = $('.bgcolor.j').css('background-color')
		colorArr[11] = $('.bgcolor.je').css('background-color')
		colorArr[43] = $('.bgcolor.Af').css('background-color')
		colorArr[42] = $('.bgcolor.AF').css('background-color')
		colorArr[44] = $('.bgcolor.c').css('background-color')
		colorArr[13] = $('.bgcolor.x').css('background-color')
		colorArr[51] = $('.bgcolor.p').css('background-color')
		colorArr[50] = $('.bgcolor.a').css('background-color')
		colorArr[52] = $('.bgcolor.d').css('background-color')

	};
	// 设置颜色
	function setColor(n, s, cs, v, cv, j, cj,Af,AF, c, x, p, a, d) {
		// 快捷键文字颜色
		$('.item.n span').css('color', n);
		$('.item.s span').css('color', s);
		$('.item.Ctrl_s span').css('color', cs);
		$('.item.v span').css('color', v);
		$('.item.Ctrl_v span').css('color', cv);
		$('.item.j span').css('color', j);
		$('.item.Ctrl_j span').css('color', cj);
		$('.item.Af span').css('color', Af);
		$('.item.AF span').css('color', AF);
		$('.item.c span').css('color', c);
		$('.item.x span').css('color', x);
		$('.item.p span').css('color', p);
		$('.item.a span').css('color', a);
		$('.item.d span').css('color', d);
		// 设置窗口内背景色
		$('.bgcolor.n').css('background-color', n);
		$('.bgcolor.s').css('background-color', s);
		$('.bgcolor.se').css('background-color', cs);
		$('.bgcolor.v').css('background-color', v);
		$('.bgcolor.ve').css('background-color', cv);
		$('.bgcolor.j').css('background-color', j);
		$('.bgcolor.je').css('background-color', cj);
		$('.bgcolor.Af').css('background-color', Af);
		$('.bgcolor.AF').css('background-color', AF);
		$('.bgcolor.c').css('background-color', c);
		$('.bgcolor.x').css('background-color', x);
		$('.bgcolor.p').css('background-color', p);
		$('.bgcolor.a').css('background-color', a);
		$('.bgcolor.d').css('background-color', d);

		colorArr[0] = "#32FF32";
		colorArr[45] = n;
		colorArr[99] = n;
		// 改变颜色 重绘
		ecgdraw();
	};
	// 对比基本参数数据
	function objCompare(a, b) {
		var aProps = Object.getOwnPropertyNames(a);
		var bProps = Object.getOwnPropertyNames(b);
		for (var i = 0; i < aProps.length; i++) {
			var propName = aProps[i]

			var propA = a[propName]
			var propB = b[propName]
			if (propA !== propB) {
				if ((typeof (propA) === 'object')) {
					if (this.objCompare(propA, propB)) {
						return true
					} else {
						return false
					}
				} else {
					g_objChanged[aProps[i]] = propA;
				}
			}
		}
		return g_objChanged;
	}
});