

var Line = {
    on: false,//是否启用
    isDraw: false,
    mouseX: 0,
    mouseY: 0,
    isMoving: false,
    offsetX: 0,
    offsetY: 0,
    bind: function() {
        $('#lineBtn').addClass('btn-success');
        $('#canvasDiv').on('mousemove', Line.drawmove).on('mousedown', Line.drawdown).on('mouseup', Line.drawup);
        Line.on = true;
    },
    unbind: function() {
        $('#lineBtn').removeClass('btn-success');
        $('#canvasDiv').off('mousemove', Line.drawmove).off('mousedown', Line.drawdown).off('mouseup', Line.drawup);
        $('.line').remove();
        Line.on = false;
    },
	hideline:function(){
		 $('.line').remove();
	},
    drawdown: function(e) {
        Line.isDraw = true;
        Line.mouseX = e.clientX - $(this).offset().left + $(window).scrollLeft() + 10;//父容器padding:10px
        Line.mouseY = e.clientY - $(this).offset().top + $(window).scrollTop() + 30;//父容器padding:10px
    },
    drawmove: function(e) {
        if (!Line.isDraw) return;
        var x = e.clientX - $(this).offset().left + $(window).scrollLeft() + 10,//父容器padding:10px
            y = e.clientY - $(this).offset().top + $(window).scrollTop() + 30,//父容器padding:10px
            width = x - Line.mouseX,
            height = y - Line.mouseY,
            left = Line.mouseX,
            top = Line.mouseY;
        if(width < 0) {
            width = width * -1;
            left = left - width + 1;
        }
        if(height < 0) {
            height = height * -1;
            top = top - height + 1;
        }
        $('#tempLine').remove();
        var widthValue = ((width - 2) / 6) * 0.04,
            heightValue = ((height - 2) / 6) * 0.1,
            xValue = (Heart.xsize < 0 ? widthValue * Heart.xsize * -1 : widthValue / Heart.xsize).toFixed(3),
            yValue = (Heart.ysize < 0 ? heightValue * Heart.ysize * -1 : heightValue / Heart.ysize).toFixed(3);
        var text = '<div id="tempLine" class="line" style="left: ' + left + 'px; top: ' + top + 'px; width: ' + width +'px; height: ' + height + 'px;"><div class="x_text">' + xValue + '(s)</div><div class="y_text" style="margin-top: ' + (height / 2 - 10) + 'px;">' + yValue + '(mv)</div></div>';
        $('#canvasDiv').append(text);
    },
    drawup: function(e) {
        if (!Line.isDraw) return;
        Line.isDraw = false;
        $('#tempLine').removeAttr('id');//.on('mousemove', Line.mousemove).on('mousedown', Line.mousedown).on('mouseup', Line.mouseup)
    },
    mousemove: function (e) {
        var target = $(this);
        console.log(target.css('width'), target.css('height'), e.clientX, e.clientY)
        if (!Line.isMoving) return;
        target.css('left', (e.clientX + Line.offsetX) + 'px');
        target.css('top', (e.clientY + Line.offsetY) + 'px');
    },
    mousedown: function (e) {
        var target = $(this),
            top = parseInt(target.css('top'), 10) || 0,
            left = parseInt(target.css('left'), 10) || 0;
        Line.isMoving = true;
        Line.offsetX = left - e.clientX;
        Line.offsetY = top - e.clientY;
    },
    mouseup: function () {
        Line.isMoving = false;
    }
};
