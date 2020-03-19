var obj = {};
(() => {
    g_main_top_xy = getDivPosition("maindiv");
    g_navcanvas_xy = getDivPosition('navcanvas');
    g_charcanvas_xy = getDivPosition('chartcanvas');
    g_qrscanvas_xy = getDivPosition('qrs');
    g_doctorId = getLocalInfo("dws_doctorId");
    g_token = getLocalInfo("dws_token");
    
    //获取anaecgFileid值
    g_anaecgFileid = getLocal("anaecgFileid");

    
    let localUrl = window.location.href
 if (g_doctorId == null || g_doctorId == undefined) {
     //alert("登陆失败");
     if (localUrl.split("?").length > 1) {
      	window.location.href = g_admin_ui
      }else{
      	window.location.href = g_domain_ui+"login.html"
      }
 }
 if (g_token == null || g_token == undefined) {
 	//alert("登陆失败");
     if (localUrl.split("?").length > 1) {
      	window.location.href = g_admin_ui
      }else{
      	window.location.href =  g_domain_ui+"login.html"
      }
 }

    if (localUrl.split("?").length > 1) {
        let arr = localUrl.split("?")[1].split("&");
        for (let i of arr) {
            obj[i.split("=")[0]] = i.split("=")[1]; //对数组每项用=分解开，=前为对象属性名，=后为属性值 
        }
        //	    console.log(obj)
        // 判断来源
        if (obj.reportId) {
            g_id = obj.id;
			g_reportId = obj.reportId
            $('#go_back').show()
            $('#open').hide()
            $('.inco_exit').hide()
            get_QRS_data(obj.reportId)
            get_zhibiao(obj.reportId)
            get_ecg_effect(obj.reportId)
            drInfo(obj.doctorId)
            get_user_info(obj.id)
            $(".btns-group,.navs>.item,.sub_userinfo").removeClass("stop_event");
        }
    } else {
        // 非医生工作站登录
        drInfo(g_doctorId);
        
        if(g_anaecgFileid !== undefined && g_anaecgFileid.length > 0){
        	if(confirm('您有未完成任务，是否恢复')){
        		$(".btns-group,.navs>.item,#insert,.ecg_result_body,.sub_userinfo").removeClass("stop_event");
    			get_QRS_data_by_fileid(g_anaecgFileid)
    			let fileName = getLocal("fileName");
    			$('#fileName').text(fileName)
    		}else{
    			delLocal("anaecgFileid")
    			delLocal("fileName")
    		}
    	}
    }
    

})()

function get_QRS_data_by_fileid(anaecgFileid){
	let url = Url;
	param = {
		method: 'POST',
		headers: {
			"doctorId": g_doctorId,
			"token": g_token
		},
		body: data = JSON.stringify({
			"reqHead": {
				"functionId": "DWS001002007",
			},
			"body": {
				"anaecgFileid": anaecgFileid
			}
		}),
	};
	fetch(url, param).then(res => {
		return res.json();
	}).then(data => {
		console.log(data)
		g_result = data.body.data
		if (data.respHead.respCode == '000') {
			console.log('恢复成功！')
			ecgdraw();
			//处理波形数据
			dealDataRecover(data)
		    //恢复用户信息
		    var userInfo = data.body.data.hwMedicalInformationMessage
		    if (userInfo){
    			$('#sub_age').val(userInfo.age);
				$('#sub_emergencyTelephone').val(userInfo.emergencyTelephone);
				$('#sub_height').val(userInfo.height);
				$('#sub_name').val(userInfo.name);
				$('#sub_sex').val(userInfo.sex);
				$('#sub_weight').val(userInfo.weight);
		    }
		    
		}
	}).catch(err => {
		alertx("网络服务中断，请检查网络连接！")
		console.log(err)
	})
	
}
// 返回工作站
function go_backs() {
    window.location.href = g_admin_home_ui
}
let qrs_data
// 查询QRS数据
function get_QRS_data(reportId) {
    let url = g_domain + '/dws/',
        param = {
            method: 'POST',
            headers: {
                "doctorId": g_doctorId,
                "token": g_token
            },
            body: data = JSON.stringify({
                "reqHead": {
                    "functionId": "DWS001005002",
                },
                "body": {
                    reportId
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
        if (data.respHead.respCode === "000") {
            qrs_data = data.body.data

            get_original_data(obj.reportId)

        } else {
            alertx('查询QRS数据失败!')
        }
    }).
        catch(err => {
        	alertx("网络服务中断，请检查网络连接！")
            console.log(err);
        })
}
// 查询原始数据
var get_original_data = function (reportId) {
    let url = g_domain + '/dws/',
        // let url = 'http://192.168.1.213:2160/dws/ecg/analyze',
        param = {
            method: 'POST',
            headers: {
                "doctorId": g_doctorId,
                "token": g_token
            },
            body: data = JSON.stringify({
                "reqHead": {
                    "functionId": "DWS001005001",
                },
                "body": {
                    reportId
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
        if (data.respHead.respCode === "000") {
			console.log(data)
            let fileInfoLength = data.body.data.length
            getHeartDataByUrl(`/pacs/get_ecg_voltage?file=${data.body.data}&begin=1&end=300&filter=1&reduce_sampling_rate=0`, function (data, startTime, dataLength) {
                g_data_total = data.length
                datas = data
                if (startTime === null || startTime === undefined) {
                    startTime = '16:16:06'
                }

                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    let item = {}
                    item.value = Math.ceil(data)
                    item.flag = 0 // 初始化
                    item.idx = i
                    dataobjs.push(item)
                }
                //              console.log(qrs_data.r_w);
                //              console.log(qrs_data.type);
                let result = {}
                result['qrsInfo'] = qrs_data
                //              console.log(result.qrsInfo.r_w);

                let ecgSec = parseInt(g_data_total / 250)
                g_ecgSec = ecgSec
                var arrdatarw = result.qrsInfo.r_w
                var arrtype = result.qrsInfo.type
				
				g_coverWidth = (40 / ecgSec) * 490
                g_navrectwidth = g_coverWidth

                if (arrdatarw != undefined) {
                    g_bottom_min = parseInt(ecgSec / 60)
                    g_bottom_sec = parseInt(ecgSec % 60)
                    g_bottom_total_idx = arrdatarw.length
                    if ( g_bottom_sec <10 ){
						$("#u_length").text(`数据长度：${g_bottom_min}分0${g_bottom_sec}秒`)
					}else{
						$("#u_length").text(`数据长度：${g_bottom_min}分${g_bottom_sec}秒`)
					}	
                    //$('#curselect').text("当前选中时间： " + g_bottom_min + " 分 " + g_bottom_sec + " 秒；当前选中第0个心搏，共有 " + g_bottom_total_idx + " 个心搏")
                    $('#curselect').text(" 当前选中第0个心搏，共有 " + (g_bottom_total_idx-1) + " 个心搏")

                    arrdatarw.forEach(function (idx, i) {
                        let flag = parseInt(arrtype[i])
                        // 设置前后34个点
                        setarrdataupfile(dataobjs, idx, flag, i, result)
                        //setarrdata(dataobjs, idx, flag)
                    })
                }
                ecgdraw();
            });
        } else { }
    }).
        catch(err => {
        	alertx("网络服务中断，请检查网络连接！")
            console.log('error:', err);
        });
}
// 查询心电印象
function get_ecg_effect(reportId) {
    let url = g_domain + '/dws/',
        param = {
            method: 'POST',
            headers: {
                "doctorId": g_doctorId,
                "token": g_token
            },
            body: data = JSON.stringify({
                "reqHead": {
                    "functionId": "DWS001005004",
                },
                "body": {
                    reportId
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
        if (data.respHead.respCode === "000") {
            anaecgFileid = data.body.data.fileId
            $(".ecg_impression_body").text(`${
                data.body.data.ecg_result_tz
                }`)
            setText('heartH', data.body.data.hr)
            $('#heartHidx').html('<span>'+data.body.data.hr+'</span>')
			$('#heartHidxOne').html('<span>'+data.body.data.hr+'</span>')
        } else {
            alertx('查询心电印象失败!')
        }
    }).
        catch(err => {
        	alertx("网络服务中断，请检查网络连接！")
            console.log(err);
        })
}
// 查询用户资料
function get_user_info(id) {
    let url = g_domain + '/dws/',
        param = {
            method: 'POST',
            headers: {
                "doctorId": g_doctorId,
                "token": g_token
            },
            body: data = JSON.stringify({
                "reqHead": {
                    "functionId": "DWS001003007",
                },
                "body": {
                    id
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
        if (data.respHead.respCode === "000") {
            $("#u_name").text(`姓名：${
                data.body.data.hwMedicalInformation.name
                }`)
            $("#u_sex").text(`性别：${
                data.body.data.hwMedicalInformation.sex === 0 ? "男" : "女"
                }`)
            $("#u_age").text(`年龄：${
                data.body.data.hwMedicalInformation.age
                }`)
            $("#u_height").text(`身高：${
                data.body.data.hwMedicalInformation.height
                }`)
            $("#u_weight").text(`体重：${
                data.body.data.hwMedicalInformation.weight
                }`)
            $("#u_tel").text(`电话：${
                data.body.data.hwMedicalInformation.emergencyTelephone
                }`)
        } else {
            alertx('查询用户资料失败!')
        }
    }).
        catch(err => {
        	alertx("网络服务中断，请检查网络连接！")
            console.log(err);
        })
}
// 查询医生信息
function drInfo(id) {
    let url = g_domain + '/dws/',
        param = {
            method: 'POST',
            headers: {
                "doctorId": g_doctorId,
                "token": g_token
            },
            body: data = JSON.stringify({
                "reqHead": {
                    "functionId": "DWS001001002",
                },
                "body": {
                    id
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
        if (data.respHead.respCode == 002) {
            alertx("登陆超时，请重新登陆!");
            let localUrl = window.location.href
            if (localUrl.split("?").length > 1) {
         		window.location.href = g_admin_ui
	        }else{
	         	window.location.href = g_domain_ui+"login.html"
	        }
        }
        $(".doctorName").text(data.body.data.doctorName);
        $(".user_avatar").attr('src', data.body.data.photo);
    }).
        catch(err => {
        	alertx("网络服务中断，请检查网络连接！")
            console.log(err);
        });
};
// 查询指标
function get_zhibiao(reportId) {
    let url = g_domain + '/dws/',
        param = {
            method: 'POST',
            headers: {
                "doctorId": g_doctorId,
                "token": g_token
            },
            body: data = JSON.stringify({
                "reqHead": {
                    "functionId": "DWS001005003",
                },
                "body": {
                    reportId
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
        if (data.respHead.respCode === "000") {
            delete data.body.data.asc
            delete data.body.data.beginTime
            delete data.body.data.createdAt
            delete data.body.data.creator
            delete data.body.data.endTime
            delete data.body.data.id
            delete data.body.data.modifier
            delete data.body.data.offset
            delete data.body.data.order
            delete data.body.data.page
            delete data.body.data.pageSize
            delete data.body.data.reportId
            delete data.body.data.updatedAt

            Object.keys(data.body.data).forEach(function (key) {
                //				console.log(key, data.body.data[key]);


                let num = data.body.data[key]
                let numstr = '' + num;
                if (numstr.indexOf('.') != -1) {
                    num = num.toFixed(2);
                }
                if (g_basic_index.rH != undefined) {

                }
                //			    $("#"+key).text(num)
                setText(key, num)
                //console.log(key)
                $("#" + key).css("modcss");

                g_basic_index = data.body.data
                //console.log(g_basic_index)

            });
        } else {
            alertx('查询指标失败!')
        }
    }).
        catch(err => {
        	alertx("网络服务中断，请检查网络连接！")
            console.log(err);
        })
}

