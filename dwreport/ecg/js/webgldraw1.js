var ecgdraw = function(id) {

	var drawcfg = {
			canconfig:{
				canvas: "ecg",
				lowgirdvas: 'lowgird',
				timep: "timep"
			},
			drawconfig:[{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		},{
			// 单导 
			ecg:	  	{ datas: datas, idx:  1,color: "#32FF32",speed:  4,canvasid:"ecg"},
			// 单导 v1
			ecgv1:		{ datas: datas3,idx:  2,color: "red",speed:  10,canvasid:"ecgv1"},
			// 单导 v2
			ecgv2:		{datas: datas,	idx:  3,color: "yellow",speed:  11,canvasid:"ecgv2"},
			// 单导 v3
			ecgv3:		{datas: datas3,	idx:  4,color: "#F08080",speed:  4,canvasid:"ecgv3"},
			// 呼吸
			breathe:	{datas: datas,	idx:  5,color: "#7CFC00",speed:  60,canvasid:"breathe"},
			// 血养
			blood:		{datas: datas3,	idx:  6,color: "#FF8C00",speed:  15,canvasid:"blood"},
			// 血养
			blood2:		{datas: datas,	idx:  7,color: "#FFD700",speed:  5,canvasid:"bloodv1"},
			// 血养
			blood3:		{datas: datas3,	idx:  8,color: "#FF8C00",speed:  10,canvasid:"bloodv2"},
		}]
	}
	
	var init = function(gl) {
		
		
		
		//着色器程序
		var vertCode =
			"attribute vec3 coordinates;" +
			"void main() {" +
			"gl_Position = vec4(coordinates,1.0);" + //位置
			"}";
		var fragCode =
			"void main() {" +
			"gl_FragColor = vec4(1, 0.5, 0.0, 1);" + //RBGA值
			"}";

		var vertShader = gl.createShader(gl.VERTEX_SHADER);
		var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(vertShader, vertCode);
		gl.shaderSource(fragShader, fragCode);
		gl.compileShader(vertShader);
		gl.compileShader(fragShader);

		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertShader);
		gl.attachShader(shaderProgram, fragShader);
		gl.linkProgram(shaderProgram);
		gl.useProgram(shaderProgram);

		//关联着色器程序到缓冲对象
		var coord = gl.getAttribLocation(shaderProgram, 'coordinates');
		gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(coord);
	}

	//获取上下文
	var canvas = document.getElementById(id);
	var gl = canvas.getContext('webgl2');

	var DRAWECG =[]			// idx 1
	var DRAWECGV1 = []		// idx 2
	var DRAWECGV2 = []		// idx 3
	var DRAWECGV3 = []		// idx 4
	var DRAWBREATHE = []	// idx 5
	var DRAWBLOOD = []		// idx 6
	var DRAWBLOODV1 = []	// idx 7
	var DRAWBLOODV2 = []	// idx 8

	for(let i=0;i<40;i++){
		DRAWECG[i] = []
		DRAWECGV1[i] = []
		DRAWECGV2[i] = []
		DRAWECGV3[i] = []
		DRAWBREATHE[i] = []
		DRAWBLOOD[i] = []
		DRAWBLOODV1[i] = []
		DRAWBLOODV2[i] = []
	}


	//定义线段数组
	var vertices = []
	for(let i=0;i<40;i++){
		vertices[i] = []
		
	}
	
	var vertex_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	init(gl)

	//画线
	gl.clearColor(0.5, 0.5, 0.5, 0.9);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.viewport(0, 0, canvas.width, canvas.height);

	gl.drawArrays(gl.LINES, 0, 6);

	var drawCanvas = function() {


		drawalrrays(DRAWECG)
		drawalrrays(DRAWECGV1)
		drawalrrays(DRAWECGV2)
		drawalrrays(DRAWECGV3)
		drawalrrays(DRAWBREATHE)
		drawalrrays(DRAWBLOOD)
		drawalrrays(DRAWBLOODV1)
		drawalrrays(DRAWBLOODV2)
		
	}
	
	var drawalrrays = function(datas){
		for (let i = 0; i < datas.length; i++) {
			let dataarr = datas[i]
			if ( dataarr == undefined || dataarr.length == 0){
				continue
			}
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataarr), gl.STATIC_DRAW);
			size = parseInt(dataarr.length / 3) 
			gl.drawArrays(gl.LINE_STRIP, 0, size);
		}
	}
	
	setInterval(drawCanvas, 100);

	var _realData = function(that) {

		let width = 0.5;//that.width 			//宽
		let height = 0.2;//that.height		//高
		let ecgdata = that.ecgdata		//数据
		let idx = that.idx				//第几行
		let speed = that.speed			//速度
		
		let off_w = that.off_w
		let off_h = that.off_h
		
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

		let dataarr = new Array(2255); 
		
		let begin=new Date();
		
		// 1. 处理数据到 buff 中 750 数组
		function dealArrayBuff(){
			let data = getData(ecgdata)
			if(data == undefined) {
				g_data_flag = false
				g_start_stop_flag = 2
				return dataarr
			}
			if ( idx == 1){
				idx
			}
			if ( g_start_stop_flag == 2){
				g_start_stop_flag = 1
			}
			
			g_data_flag = true
			
			if(g_sub_idx > 2250) {
				g_sub_idx = 0
			}
			let x = -1+(g_sub_idx * width) / 2250 + (off_w)*0.6;
			let y = idx*(0.025) - data/ 1000 + (off_h) * 0.2;
//			console.log(off_h)
//			console.log(off_w)
			
			dataarr[g_sub_idx++] = x
			dataarr[g_sub_idx++] = y
			dataarr[g_sub_idx++] = 0
			
			
			// 制造缺口
//			for (let i = g_sub_idx+1; i < g_sub_idx+5; i++) {
//				dataarr[g_sub_idx+i] = 0
//				dataarr[g_sub_idx+i] = 0
//				dataarr[g_sub_idx+i] = 0
//			}
			
			if ( idx == 1){
				DRAWECG[that.i]= dataarr
			}else if ( idx == 2){
				DRAWECGV1[that.i]= dataarr
			}else if ( idx == 3){
				DRAWECGV2[that.i]= dataarr
			}else if ( idx == 4){
				DRAWECGV3[that.i]= dataarr
			}else if ( idx == 5){
				DRAWBREATHE[that.i]= dataarr
			}else if ( idx == 6){
				DRAWBLOOD[that.i]= dataarr
			}else if ( idx == 7){
				DRAWBLOODV1[that.i]= dataarr
			}else if ( idx == 8){
				DRAWBLOODV2[that.i]= dataarr
			}
		}
	
		function getData(ecgdata) {
			let data = ecgdata[g_idx]
			if ( data != undefined){
				g_idx++
			}
			return data
		}
		
	}

	var dealdrawcfg = function(drawcfg,i){
		console.log(drawcfg)
		let off_w = parseInt(i % 4)
		let off_h = parseInt(i / 4)

		let j =0
		for(key in drawcfg){
			let item = drawcfg[key]
			console.log(item)
			var ecgObj = {
				ecgdata:	item.datas, 
				idx:		item.idx,
				color:		item.color,
				speed:		item.speed,
				off_w:		off_w,
				off_h:		off_h,
				i:    		i,
				j:			j
			}
			_realData(ecgObj)
			j++
		}
	}
	
	var drawconfig = drawcfg.drawconfig
	
	for(let i=0;i<drawconfig.length;i++){
		let drawcfg = drawconfig[i]
		dealdrawcfg(drawcfg,i)
	}
	

}