
var anaecgFileid = '';
var Url = 'http://122.225.207.105:2160/dws/'
// 心电波
var g_canvasId = "drawcanvas";
// 导航
var g_navcanvasId = "navcanvas";
// 导航 折线图
var g_chartcanvasId = "chartcanvas";
// 单导 QRS波
var g_qrscanvasId = "qrs";

// 采样点数据
var datas = [];

//  采样点总个数
var g_data_total = 0;

// qrs info 数据
var idxdata;
// QRS 中心坐标
var idxdatas = []
// // QRS 中心坐标
var idxldatas = []
// QRS 之间坐标
var mdxdatas = []
// 处理后的采样点数据
var dataobjs = []

// 前一次的：  基本指标  , 从新打开数据，需要初始化
var g_basic_index = {}

// 主工作区域div xy
var g_main_top_xy;
// 导航div xy
var g_navcanvas_xy;
// 心率div xy
var g_charcanvas_xy;



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
var g_scaleArea = 40;
// 行高
var g_lineHeight = 110;

var g_rects = []; // 导航扩选,拖动按钮
var g_clickArea = []; //点击选中框
var g_clickLine = []; //点击选中线
var g_moveArea = []; //移动选中框
var g_moveLine = []; //移动选中线
var g_navclickLine = [];

var g_clickX = 0
var g_clickY = 0

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

var scrollout = function (){}

var g_x = 0


var g_index_data = new Map();
g_index_data.set("heartH", { "min": 60, "max": 100 })
g_index_data.set("pH", { "min": 0.05, "max": 0.25 })
g_index_data.set("pS", { "min": 60, "max": 110 })
g_index_data.set("pF", { "min": undefined, "max": undefined })
g_index_data.set("pY", { "min": undefined, "max": undefined })
g_index_data.set("prS", { "min": 120, "max": 210 })
g_index_data.set("prY", { "min": undefined, "max": undefined })
g_index_data.set("qH", { "min": 0, "max": 0.5 })
g_index_data.set("qS", { "min": 0, "max": 30 })
g_index_data.set("rH", { "min": undefined, "max": 1.50001 })
g_index_data.set("qrHB", { "min": undefined, "max": 0.25 })
g_index_data.set("qrsS", { "min": 60, "max": 110 })
g_index_data.set("qrsF", { "min": undefined, "max": undefined })
g_index_data.set("jYn", { "min": undefined, "max": undefined })
g_index_data.set("pjS", { "min": undefined, "max": 260.0001 })
g_index_data.set("sttgH", { "min": undefined, "max": 0.1 })
g_index_data.set("stydH", { "min": undefined, "max": 0.05 })
g_index_data.set("stS", { "min": 50, "max": 150 })
g_index_data.set("stY", { "min": undefined, "max": undefined })
g_index_data.set("tH", { "min": 0.1, "max": 1 })
g_index_data.set("trHB", { "min": 0.1, "max": undefined })
g_index_data.set("tF", { "min": undefined, "max": undefined })
g_index_data.set("tY", { "min": undefined, "max": undefined })
g_index_data.set("qt", { "min": 320, "max": 480 })
g_index_data.set("qtc", { "min": 320, "max": 480 })

var setText = function () { }


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

const key = ["del", "n", "s", "Ctrl+s", "v", "Ctrl+v", "j", "Ctrl+j", "c", "x", "p", "a", "d"];

/**
 * @description 一般类型标识符 [类型编号]
 * 
 * colorArr[1] = normalInfo; n  (窦性心律)	g_clickArea: 0
 * colorArr[8] = apbInfo; s (房性早博)	
 * colorArr[34] = aebInfo; se (房性逸博)	
 * colorArr[5] = rontInfo; v (室早、R-on-T)	
 * colorArr[10] = vebInfo; ve  (室性逸博 )	
 * colorArr[7] = bpbInfo; j (交界性早搏)	
 * colorArr[11] = jebInfo; je (交界性逸博)	
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