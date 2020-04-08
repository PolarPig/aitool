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
        	g_loginFlag = true;
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
        
        g_loginFlag = false;
        
        if(g_anaecgFileid !== undefined && g_anaecgFileid.length > 0){
        	if(confirm('您有未完成任务，是否恢复')){
        		$(".btns-group,.navs>.item,#insert,.ecg_result_body,.sub_userinfo").removeClass("stop_event");
    			get_QRS_data_by_fileid(g_anaecgFileid)
    		}else{
    			delLocal("anaecgFileid")
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
			//console.log(data)
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
                prepoint = 0;
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
                    $('#curselect').text(" 当前选中第0个心搏，共有 " + (g_bottom_total_idx-1) + " 个心搏")

                    arrdatarw.forEach(function (idx, i) {
                        let flag = parseInt(arrtype[i])
                        if ( flag != undefined){
                        	// 设置前后34个点
	                        setarrdataupfile(dataobjs, idx, flag, i, result)
	                        //setarrdata(dataobjs, idx, flag)
                        }
                       
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
                data.body.data.ecgResult
                }`)
            setText('heartH', data.body.data.hr)
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
			
//			console.log(data)
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
                g_qrs_h = data.body.data.qrsH;
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

// 基本数据测量值
// $(".tipup").hide();
// $(".down").hide();
// $("#heartH").bind("click",function(){
   
//     if( $(this).html() > 100){
//         // alert(555555)
//         $(".color").css("color","red")
//         $(".tipup").show();
//     }
//     if( $(this).html() < 60){
//         $(".color").css("color","red")
//         $(".down").show();
//     }
// })
// $('#heartH').trigger("click");

// $(".tipup1").hide();
// $(".down1").hide();

// $("#pH").bind("click",function(){
//     if($(this).html() > 0.25){
//         $(".colors").css("color","red")
//         $(".tipup1").show();
//     }
//     if( $(this).html() < 0.05){
//         $(".colors").css("color","red")
//         $(".down1").show();
//     }
// })
// $('#pH').trigger("click");

// $(".tipup2").hide();
// $(".down2").hide();
// $("#pS").bind("click",function(){
//     if($(this).html() > 110){
//         $(".shixian").css("color","red")
//         $(".tipup2").show();
//     }
//     if( $(this).html() < 60){
//         $(".shixian").css("color","red")
//         $(".down2").show();
//     }
// })
// $('#pS').trigger("click");


// $(".tipup13").hide();
// $(".down13").hide();
// $("#prS").bind("click",function(){
//     if($(this).html() > 210){
//         $(".jianqi").css("color","red")
//         $(".tipup13").show();
//     }
//     if( $(this).html() < 120){
//         $(".jianqi").css("color","red")
//         $(".down13").show();
//     }
// })
// $('#prS').trigger("click");
// $(".tipup3").hide();
// $(".down3").hide();
// $("#qH").bind("click",function(){
//     if($(this).html() > 0.5){
//         $(".zhenfu").css("color","red")
//         $(".tipup3").show();
//     }
//     if( $(this).html() < 0){
//         $(".zhenfu").css("color","red")
//         $(".down3").show();
//     }
// })
// $('#qH').trigger("click");

// $(".tipup4").hide();
// $(".down4").hide();
// $("#qS").bind("click",function(){
//     if($(this).html() > 30){
//         $(".qbo").css("color","red")
//         $(".tipup4").show();
//     }
//     if( $(this).html() < 0){
//         $(".qbo").css("color","red")
//         $(".down4").show();
//     }
// })
// $('#qS').trigger("click");
// $(".down5").hide();
// $("#rH").bind("click",function(){
//     if($(this).html() <= 1.5){
//         $(".rbo").css("color","red")
//         $(".down5").show();
//     }
//     // if( $(this).html() < 0){
//     //     $(".rbo").css("color","red")
//     // }
// })
// $('#rH').trigger("click");

// // $(".tipup6").hide();
// $(".down6").hide();
// $("#qrHB").bind("click",function(){
//     // if($(this).html() >=0.25){
//     //     $(".qr").css("color","red")
//     //     $(".tipup6").show();
//     // }

//     if($(this).html() < 0.25){
//         $(".qr").css("color","red")
//         $(".down6").show();
//     }
//     // if( $(this).html() < 0){
//     //     $(".rbo").css("color","red")
//     // }
// })
// $('#qrHB').trigger("click");
// $(".tipup7").hide();
// $(".down7").hide();
// $("#qrsS").bind("click",function(){
//     if($(this).html() > 110){
//         $(".qrsbo").css("color","red")
//         $(".tipup7").show();
//     }
//     if( $(this).html() < 60){
//         $(".qrsbo").css("color","red")
//         $(".down7").show();
//     }
// })
// $('#qrsS').trigger("click");

// $(".down8").hide();
// $("#pjS").bind("click",function(){
//     // if($(this).html() > 110){
//     //     $(".qrsbo").css("color","red")
//     // }
//     if( $(this).html() <= 260){
//         $(".pga").css("color","red")
//         $(".down8").show();
//     }
// })
// $('#pjS').trigger("click");


// $(".down9").hide();
// $("#sttgH").bind("click",function(){
//     // if($(this).html() > 110){
//     //     $(".qrsbo").css("color","red")
//     // }
//     if( $(this).html() < 0.10){
//         $(".stpaa").css("color","red")
//         $(".down9").show();
//     }
// })
// $('#sttgH').trigger("click");
// $(".tipup10").hide();
// $(".down10").hide();
// $("#stydH").bind("click",function(){
//     // if($(this).html() > 110){
//     //     $(".qrsbo").css("color","red")
//     // }
//     if( $(this).html() < -0.05){
//         $(".stdiya").css("color","red")
//         $(".tipup10").show();
//     }
//     if( $(this).html() = -0.05 ){
//         $(".stdiya").css("color","red")
//     }
//     if( $(this).html() > -0.05){
//         $(".stdiya").css("color","red")
//         $(".down10").show();
//     }
// })
// $('#stydH').trigger("click");

// $(".tipup11").hide();
// $(".down11").hide();
// $("#stS").bind("click",function(){
//     if($(this).html() > 150){
//         $(".stxingao").css("color","red")
//         $(".tipup11").show();
//     }
//     if( $(this).html() < 50){
//         $(".stxingao").css("color","red")
//         $(".down11").show();
//     }
// })
// $('#stS').trigger("click");

// $(".tipup12").hide();
// $(".down12").hide();
// $("#tH").bind("click",function(){
//     if($(this).html() > 1.0){
//         $(".tzhentu").css("color","red")
//         $(".tipup12").show();
//     }
//     if( $(this).html() < 0.1){
//         $(".tzhentu").css("color","red")
//         $(".down12").show();
//     }
// })
// $('#tH').trigger("click");
// $(".tipup18").hide();
// $("#trHB").bind("click",function(){
//     if($(this).html() > 0.1){
//         $(".trzhenfua").css("color","red")
//         $(".tipup18").show();
//     }
//     // if( $(this).html() < 0.1){
//     //     $(".trzhenfua").css("color","red")
//     // }
// })
// $('#trHB').trigger("click");

// $(".tipup14").hide();
// $(".down14").hide();
// $("#qt").bind("click",function(){
//     if($(this).html() > 480){
//         $(".qtsa").css("color","red")
//         $(".tipup14").show();
//     }
//     if( $(this).html() < 320){
//         $(".qtsa").css("color","red")
//         $(".down14").show();
//     }
// })
// $('#qt').trigger("click");
// $(".tipup15").hide();
// $(".down15").hide();
// $("#qtc").bind("click",function(){
//     if($(this).html() > 480){
//         $(".qtcss").css("color","red")
//         $(".tipup15").show();
//     }
//     if( $(this).html() < 320){
//         $(".qtcss").css("color","red")
//         $(".down15").show()
    
//     }
// })
// $('#qtc').trigger("click");
