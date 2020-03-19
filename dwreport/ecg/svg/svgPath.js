function svgGraphic(){
	this.zoom=1;//比例系数svg文档viewBox与width height比值
	this.meDocument=document.embeds["ccjSVG"].getSVGDocument();
	this.myArea=this.meDocument.getElementById("myArea");
	//this.myArea=document.getElementById("myArea");
	this.aX=0;//矩形原点x坐标
	this.aY=0;//矩形原点y坐标
	this.aW=0;//矩形宽度及SVG文档宽度
	this.aH=0;//矩形高度及SVG文档高度
	this.aS="black";//矩形边框颜色
	this.aSw=0;//矩形边框粗细
	this.xSpace=5;//x轴刻度值间隔
	this.ySpace=5;//y轴刻度值间隔
	//this.xSpacevstext=this.xSpacevstext;//x轴文字显示间隔，是xSpace的倍数
	this.ySpacevstext=this.ySpacevstext;//y轴文字显示间隔线与ySpace的倍数（相隔几条x线显示一个y刻度）
	this.xLeft=0;//原点左边空隙
	this.yBottom=0;//原点左边空隙
	this.xtextbegin=0;//x轴坐标值开始值
	this.xtextSpace=5;//x轴坐标值间隔差
	this.xtextUnit=null;//x轴坐标值单位
	this.ytextbegin=0;//y轴坐标值开始值
	this.ytextSpace=5;//y轴坐标值间隔差
	this.ytextUnit=null;//y轴坐标单位
	this.mapTitle="";//坐标系标题
	this.mapendTitle="";//坐标系底部文字
	this.coordinateW=this.aW-2*this.xLeft;//坐标系宽度
	this.coordinateH=this.aH-2*this.yBottom;//坐标系高度
	this.xmaxValue=this.xSpace/this.xtextSpace;//用户x值（刻度）与坐标系坐标比例关系  初始化
	this.ymaxValue=this.ySpace/this.ytextSpace;//用户y值（刻度）与坐标系坐标比例关系  初始化
	this.xlColorarr=new Array();//x轴线变色数组第几条
	this.myG1=null;
	this.myG2=null;
	this.myG3=null;
	this.Load=function (axValue,ayValue,aWidth,aHeight,aStrokeColor,aStrokeWidth,xSpace,ySpace,ySpacevstext,xLeft,yBottom,xtextbegin,xtextSpace,xtextUnit,ytextbegin,ytextSpace,ytextUnit,mapTitle,mapendTitle,xlColorarr){
		this.xmaxValue=xSpace/xtextSpace;//用户x值（刻度）与坐标系坐标比例关系 赋值
		this.ymaxValue=ySpace/ytextSpace;//用户y值（刻度）与坐标系坐标比例关系 赋值
		this.aX=axValue;
		this.aY=ayValue;
		this.aW=aWidth;
		this.aH=aHeight;
		this.aS=aStrokeColor;
		this.aSw=aStrokeWidth;
		this.xSpace=xSpace;
		this.ySpace=ySpace;
		//this.xSpacevstext=xSpacevstext;
		this.ySpacevstext=ySpacevstext;
		this.xLeft=xLeft;
		this.yBottom=yBottom;
		this.xtextbegin=xtextbegin;
		this.xtextSpace=xtextSpace;
		this.xtextUnit=ytextUnit;
		this.ytextbegin=ytextbegin;
		this.ytextSpace=ytextSpace;
		this.ytextUnit=xtextUnit;
		this.mapTitle=mapTitle;
		this.mapendTitle=mapendTitle;
		this.xlColorarr=xlColorarr;

		//begin---------------------创建g1 g2 g3 mySvg---------------------------
		//g1:静态曲线图区域
		var myg1=this.meDocument.createElement("g");
			myg1.setAttribute("id","g1");
		this.myArea.appendChild(myg1);

		this.myG1=this.meDocument.getElementById("g1");
		//mySvg:滚动曲线左右区域svg
		var mysvg=this.meDocument.createElement("svg");
			mysvg.setAttribute("id","mySvg");
			mysvg.setAttribute("x",this.aX+this.xLeft);
			mysvg.setAttribute("y",this.aY+this.yBottom);
			mysvg.setAttribute("width",this.aW-2*this.xLeft);
			mysvg.setAttribute("height",this.aH-2*this.yBottom);
		this.myArea.appendChild(mysvg);
		//mySvgxt:滚动x坐标左右区域svg
		var mysvgxt=this.meDocument.createElement("svg");
			mysvgxt.setAttribute("id","mySvgxt");
			mysvgxt.setAttribute("x",this.aX+this.xLeft);
			mysvgxt.setAttribute("y",this.aH-this.yBottom);
			mysvgxt.setAttribute("width",this.aW-2*this.xLeft);
			mysvgxt.setAttribute("height",this.yBottom);
		this.myArea.appendChild(mysvgxt);
		//g2:动态曲线图展示区域
		var myg2=this.meDocument.createElement("g");
			myg2.setAttribute("id","g2");
		this.meDocument.getElementById("mySvg").appendChild(myg2);

		this.myG2=this.meDocument.getElementById("g2");
		//g3:x轴科度文字区域  在mySvgxt中
		var myg3=this.meDocument.createElement("g");
			myg3.setAttribute("id","g3");
		this.meDocument.getElementById("mySvgxt").appendChild(myg3);

		this.myG3=this.meDocument.getElementById("g3");

		//end---------------------创建g1 mySvg---------------------------

		//begin---------------------创建矩形---------------------------
		var myRect=this.meDocument.createElement("rect");
			myRect.setAttribute("id","myrect1");
			myRect.setAttribute("x",this.aX);
			myRect.setAttribute("y",this.aY);
			myRect.setAttribute("width",this.aW);
			myRect.setAttribute("height",this.aH);
			myRect.setAttribute("stroke",this.aS);
			myRect.setAttribute("stroke-width",this.aSw);
			myRect.setAttribute("fill","none");
		this.myG1.appendChild(myRect);
		//end---------------------创建矩形---------------------------

		//begin---------------------创建坐标轴---------------------------
		//创建x轴
		this.createLine(this.myG1,"X",this.xLeft,this.aH-this.yBottom,this.aW-this.xLeft,this.aH-this.yBottom,2,"black");
		this.meDocument.getElementById("X").setAttribute("marker-end","url(#mkxy)");
		//创建y轴
		this.createLine(this.myG1,"Y",this.xLeft,this.aH-this.yBottom,this.xLeft,this.yBottom,2,"black");
		this.meDocument.getElementById("Y").setAttribute("marker-end","url(#mkxy)");
		//end---------------------创建坐标轴---------------------------

		//x轴线
		var icolor=0;
		for(var i=(this.aH-this.yBottom);i>=this.yBottom;i-=this.ySpace){
			if(this.xlColorarr.length>0){
				for (var iarr=this.xlColorarr.length-1;iarr>=0;iarr--){
					if(this.xlColorarr[iarr][0]==icolor){
						this.createLine(this.myG1,"x",this.xLeft,i,this.aW-this.xLeft,i,'',this.xlColorarr[iarr][1]);
						iarr-=1;
						this.xlColorarr=this.xlColorarr.splice(this.xlColorarr.length-2,1);
						break;
					}
					else{
						this.createLine(this.myG1,"x",this.xLeft,i,this.aW-this.xLeft,i,'',"");
						break;
					}
				}
			}
			else{
				this.createLine(this.myG1,"x",this.xLeft,i,this.aW-this.xLeft,i,'',"");
			}
			icolor++;
		}
		//y轴线文字
		for(var i=(this.aH-this.yBottom);i>=this.yBottom;i-=(this.ySpacevstext*this.ySpace)){
			this.createText(this.myG1,"t",this.xLeft/3,i,"red",this.ytextbegin+this.xtextUnit,"12px");
			this.ytextbegin+=this.ytextSpace;
		}
		//y轴线
		//得到y轴线x坐标范围与x间隔倍数;Math.floor((this.aW-2*this.xLeft)/this.xSpace)
		for(var j=((Math.floor((this.aW-2*this.xLeft)/this.xSpace))*this.xSpace+this.xLeft);j>this.xLeft;j-=this.xSpace){
			this.createLine(this.myG1,"y",j,this.aH-this.yBottom,j,this.yBottom,'','');
		}
		//x轴线文字
		this.xtextbegin=this.xtextbegin+(Math.floor((this.aW-2*this.xLeft)/this.xSpace)*this.xtextSpace);
		for(var j=((Math.floor((this.aW-2*this.xLeft)/this.xSpace))*this.xSpace);j>=0;j-=this.xSpace){
			this.createText(this.myG3,"tx"+j,j,this.yBottom-30,"red",this.xtextbegin+this.ytextUnit,"12px");
			this.xtextbegin-=this.xtextSpace;
		}
		//创建坐标系标题
		this.createText(this.myG1,"tTitle",360,15,"black",this.mapTitle,"14px");
		//创建坐标系底部文字
		this.createText(this.myG1,"tTitle",280,this.aH-10,"black",this.mapendTitle,"14px");
	}
	//画线方法---Begin--------------------------------------------
	this.createLine=function(areaName,lid,lx1,ly1,lx2,ly2,lsw,ls){
		var L=this.meDocument.createElement("line");
			L.setAttribute("id",lid);
			L.setAttribute("x1",lx1);
			L.setAttribute("y1",ly1);
			L.setAttribute("x2",lx2);
			L.setAttribute("y2",ly2);
			L.setAttribute("stroke-width",lsw);
			L.setAttribute("stroke",ls);
		areaName.appendChild(L);
	}
	//画线方法---End--------------------------------------------
	//标数文字方法---Begin--------------------------------------------
	this.createText=function(areaName,tid,tx,ty,tcolor,txt,tsize){
		var T=this.meDocument.createElement("text");
			T.setAttribute("id",tid);
			T.setAttribute("x",tx);
			T.setAttribute("y",ty);
			T.setAttribute("fill",tcolor);
			T.setAttribute("font-size",tsize);
			T.appendChild(this.meDocument.createTextNode(txt));
		areaName.appendChild(T);
	}
	//标数文字方法---End--------------------------------------------
	//把点描成小圆圈
	this.createDot=function(areaName,did,dx,dy,dr,dcolor){
		var D=this.meDocument.createElement("circle");
			D.setAttribute("id",did);
			D.setAttribute("cx",dx);
			D.setAttribute("cy",dy);
			D.setAttribute("r",dr);
			D.setAttribute("fill",dcolor);
		areaName.appendChild(D);
	}
	//描点画线---Begin--------首次加载------------------------------------
	this.createPath=function(areaName,pid,pfillcolor,ps,psc,ltext,lx,ly,lfontsize){
		var dpx=1*this.xmaxValue;
		var dpy=this.aH-2*this.yBottom-1*this.ymaxValue;
		var P=this.meDocument.createElement("path");
			P.setAttribute("id",pid);
			P.setAttribute("fill",pfillcolor);
			P.setAttribute("stroke-width",ps);
			P.setAttribute("stroke",psc);
			P.setAttribute("d","");
		areaName.appendChild(P);

		this.createDot(this.myG2,"did",dpx,dpy,10,psc);

		//线代表样品及颜色
		this.createText(this.myG1,"fs",lx,ly,ps,ltext,lfontsize);
	}
	//描点画线---End--------首次加载------------------------------------
	//Path画线---Begin--------------------------------------------
	this.createPaths=function(areaName,pid,pfillcolor,ps,psc,dstr){
		var P=this.meDocument.createElement("path");
			P.setAttribute("id",pid);
			P.setAttribute("fill",pfillcolor);
			P.setAttribute("stroke-width",ps);
			P.setAttribute("stroke",psc);
			P.setAttribute("d",dstr);
		areaName.appendChild(P);
	}
	//Path画线---End--------------------------------------------
	//坐标系内坐标转换---Begin--------------------------------------------
	this.getX=function(x){
		return x*this.xmaxValue;
	}
	this.getY=function(y){
		return (this.aH-2*this.yBottom-y*this.ymaxValue)
	}
	//坐标系内坐标转换---End--------------------------------------------
	//移动曲线---Begin--------------------------------------------
	this.moveBy=function(value){
		this.meDocument.getElementById("g2").setAttribute("transform","translate("+(value*this.xmaxValue)+",0)");
	}
	this.moveByxt=function(value){
		this.meDocument.getElementById("g3").setAttribute("transform","translate("+(value*this.xmaxValue)+",0)");
	}
	//移动曲线---End--------------------------------------------
}