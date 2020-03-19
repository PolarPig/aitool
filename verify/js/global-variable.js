// 获取到的数据
var g_result;

// 数据开始时间
var g_startTime = '';
// 数据结束时间
var g_endTime = '';

// 全局变量 集散地
var anaecgFileid = '';
var g_token;
var g_doctorId;
var g_reportId;
var g_id = "";
// 低格线明暗度
var g_globalAlpha = "1";

// 接口
// var g_domain = 'http://192.168.1.74:2160';// 
//var g_domain = 'http://122.225.207.105:2160';// 开发环境
var g_domain = 'http://api-test.995120.cn';// 测试环境
//var g_domain = 'https://api.995120.cn';// 生产环境

// 分析系统
//var g_domain_ui = 'http://api-test.995120.cn/dwans/';//开发环境
//var g_domain_ui = 'http://api-test.995120.cn/dwreport/';//测试环境
//var g_domain_ui = 'https://api.995120.cn/static/hm505/dwreport/';//生产环境

//var g_domain_ui = 'http://api-test.995120.cn/reg1/';//测试环境
var g_domain_ui = 'http://api-test.995120.cn/verify/';//测试环境

// 工作站
//var g_admin_ui  = 'http://api-test.995120.cn/dwhh/';//开发环境
var g_admin_ui = 'http://api-test.995120.cn/dwh/';//测试环境
//var g_admin_ui = 'https://api.995120.cn/static/hm505/dwh/';//生产环境


var g_admin_home_ui = g_admin_ui + "home";

var Url = g_domain + '/dws/'
// 心电波
var g_canvasId = "drawcanvas";
// 导航
var g_navcanvasId = "navcanvas";
// 导航 折线图
var g_chartcanvasId = "chartcanvas";
// 单导 QRS波
var g_qrscanvasId = "qrs";
// 背景图层
const g_bgcanvasId = "bgcanvas";
// 标尺图层
const g_scalecanvasId = "scalecanvas";

// 双击单波选中的单个QRS
var g_check_qrsinfo = undefined

// 采样点数据
var datas = [];

//  采样点总个数
var g_data_total = 0;

// qrs info 数据
var idxdata;
// QRS 中心坐标
var idxdatas = []
// QRS 之间坐标
var mdxdatas = []
// 处理后的采样点数据
var dataobjs = []

// 前一次的：  基本指标  , 从新打开数据，需要初始化
var g_basic_index = {}

// 更改后基本参数变动项
var g_objChanged = {};
// 修改后指标
var g_change_basic_idx = {}

// 主工作区域div xy
var g_main_top_xy;
// 导航div xy
var g_navcanvas_xy;
// 心率div xy
var g_charcanvas_xy;
// 单波QRS div xy
var g_qrscanvas_xy;

// 导航拖拽条位置
var g_leftwidth = 0


var prepoint = 0

// 低格控制标识
var g_flag = 0;

//框选 起点索引,结束索引
var g_preidx = 0;
var g_nexidx = 0;

// 增益
var g_pixPmm = 10.0;
var g_mmPmV = 10.0;

// 走纸速度
var g_mmPs = 2500;

// 左侧标尺 区域
var g_scaleArea = 30;
// 行高
var g_lineHeight = 110;

// 全屏显示心电时长
var g_fullTime = 40;

var g_rects = []; // 导航扩选,拖动按钮
var g_clickArea = []; //点击选中框
var g_clickArea_w = 30;// 点击选中框 宽
var g_clickArea_h = 60;// 点击选中框 高
var g_clickArea_x = 0; // 点击选中框  错位
var g_draw_last_idx = 0;// 一屏最后一个点
var g_draw_first_idx = 0;// 一屏第一个点

var g_modifAreaIdx = undefined; //修改记录列表
var g_clickLine = []; //点击选中线
var g_moveArea = []; //移动选中框
var g_moveLine = []; //移动选中线
var g_navclickLine = [];

var g_clickX = 0
var g_clickY = 0

// 心电图时间（s）
var g_ecgSec = 0

var g_flags = true

// 移动导航框40s原始宽度
var g_coverWidth = 0
// 移动导航框宽度
var g_navrectwidth = 0;
// 是否可以移动
var isDragging = false;
var g_SelectedRect;
var x1 = 0,
    y1;
var right = false;
var widthstart, widthend;
var heightstart, heightend;

var locationX = 0
// 控制ecg 索引位置便宜
var g_offx = 0;

var g_rect = {}

// 单导 QRS 波 
var g_subdatas = [];
// 单导 QRS 波 移动控制
var isDrawLine = false;
// 单导 QRS 波 定位线
var g_qrspos = [];
// 单导 QRS 波 单击选中定位线
var g_clickPos;
// 单导 QRS 波 双击选中定位线
var g_dbclickPos;
var g_qrs_h;
// 是否画低格 19*19
var g_grid_exists = false;

var g_right_idx = 0;

var g_grid_pos_flag = false

//底部文字变量
//分
var g_bottom_min = 0
//秒
var g_bottom_sec = 0
// 第几个心波
var g_bottom_idx = 0
// 总心波数
var g_bottom_total_idx = 0

var Heart = {
    xsize: 1,//x轴放大倍数
    ysize: 1,//y轴放大倍数
}

// 删除波位置
var deleteQRSIndex = ''
// 添加波位置
var addQRSIndex = ''

var fileDatas = ''

var chanceType = function () { }

var submitUser = function () { }

var scrollout = function () { }

var canvasout = function () { }

var g_x = 0


var g_index_data = new Map();
g_index_data.set("heartH", { "min": 60, "max": 100 })
g_index_data.set("pH", { "min": 0.05, "max": 0.25 })
g_index_data.set("pS", { "min": 60, "max": 110 })
g_index_data.set("pF", { "min": undefined, "max": undefined })
g_index_data.set("pY", { "min": undefined, "max": undefined })
g_index_data.set("prS", { "min": 120, "max": 210 })
g_index_data.set("prY", { "min": undefined, "max": undefined })
g_index_data.set("qH", { "min": -0.5, "max": 0 })
g_index_data.set("qS", { "min": 0, "max": 30 })
g_index_data.set("rH", { "min": undefined, "max": 1.50001 })
g_index_data.set("qrHB", { "min": 0.5, "max": undefined })
g_index_data.set("qrsH", { "min": 0.5, "max": undefined })
g_index_data.set("qrsS", { "min": 60, "max": 110 })
g_index_data.set("qrsF", { "min": undefined, "max": undefined })
g_index_data.set("jYn", { "min": undefined, "max": undefined })
g_index_data.set("pjS", { "min": undefined, "max": 260.0001 })
g_index_data.set("sttgH", { "min": -0.05, "max": 0.1 })
g_index_data.set("stydH", { "min": undefined, "max": 0.05 })
g_index_data.set("stS", { "min": 50, "max": 150 })
g_index_data.set("stY", { "min": undefined, "max": undefined })
g_index_data.set("tH", { "min": 0.1, "max": 1 })
g_index_data.set("trHB", { "min": 0.1, "max": undefined })
g_index_data.set("tF", { "min": undefined, "max": undefined })
g_index_data.set("tY", { "min": undefined, "max": undefined })
g_index_data.set("qt", { "min": 320, "max": 480 })
g_index_data.set("qtc", { "min": 320, "max": 480 })

var setText = function () {}
var dealData = function (){}
var dealDataRecover = function(){}

/**
 * @description 快捷键及后台参数对应名称	
 * n : normalInfo (窦性心律)	
 * s : apbInfo (房性早博)	
 * se :aebInfo (房性逸博)	
 * v : rontInfo (室早、R-on-T)	
 * ve : vebInfo (室性逸博 )	
 * j : bpbInfo (交界性早搏)	
 * je : jebInfo (交界性逸博)	
 * c : aberrantConductionInfo (差异传导)	
 * x : artifactInfo (伪差)	
 * p : vviInfo (心室起搏)	
 * a : aaiInfo (心房起搏)	
 * d : dddInfo (房式顺序起搏)	
 * R : suspicious (可疑)	
 * AF : atrialFlutter (房扑)	
 * Af : atrialFibrillation (房颤)	
 * 
 */

const key = ["del", "n", "s", "Ctrl+s", "v", "Ctrl+v", "j", "Ctrl+j", "c", "x", "p", "a", "d","f","Ctrl+f"];

/**
 * @description 一般类型标识符 [类型编号]
 * 
 * colorArr[1] = normalInfo; n  (窦性心律)	g_clickArea: 0
 * colorArr[8] = apbInfo; s (房性早搏)	
 * colorArr[34] = aebInfo; se (房性逸搏)	
 * colorArr[5] = rontInfo; v (室早、R-on-T)	
 * colorArr[10] = vebInfo; ve  (室性逸搏)	
 * colorArr[7] = bpbInfo; j (交界性早搏)	
 * colorArr[11] = jebInfo; je (交界性逸搏)	
 * colorArr[44] = aberrantConductionInfo; c (差异传导)	
 * colorArr[13] = artifactInfo; x (伪差)	
 * colorArr[51] = vviInfo; p (心室起搏)	
 * colorArr[50] = aaiInfo; a (心房起搏)	
 * colorArr[52] = dddInfo; d (房式顺序起搏)	
 * colorArr[45] = suspicious; R (可疑)	g_clickArea: 99
 * colorArr[42] = atrialFlutter; AF (房扑)	
 * colorArr[43] = atrialFibrillation; Af (房颤)	
 * 
 */

let colorArr = [];

var g_situaFlag = false
var g_paramFlag = true



// 1 p1  p_s_w
// 2 p   p_w
// 3 p2  p_f_w
// 4 q   q_w
// 5 r   r_w
// 6 j   qrs_f_w
// 7 st  s_w
// 8 t   t_w
// 9 t2  t_f_w
