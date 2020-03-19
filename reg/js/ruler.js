
var Ruler = {
	isMoving: false,
	offsetX: 0,
	offsetY: 0,
	init: function() {
		$(window).on('mousemove', Ruler.mousemove);
		$('#rulerDiv').on('mousedown', Ruler.mousedown).on('mouseup', Ruler.mouseup);
		for (var i = 1; i <= 40; i++) {
			var className = 'px';
			if (i % 5 == 0) className = 'scale';
			$('#rulerDiv > .rulerVertical, #rulerDiv > .rulerHorizontal').append('<div class="' + className + '"><div index="' +
				i + '"></div></div>');
		}
		Ruler.resize();
	},
	reset: function() {
		$('#rulerDiv').fadeOut('fast');
		Ruler.resize();
	},
	resize: function() {
		var x = Heart.xsize,
			y = Heart.ysize;
		$('#rulerDiv > .rulerHorizontal > .scale > div').each(function() {
			var index = $(this).attr('index');
			index = index * 4;
			var value = Heart.xsize;
			value = (value < 0 ? index * value * -1 : index / value);
			$(this).html((value / 100).toFixed(1));
		});
		$('#rulerDiv > .rulerVertical > .scale > div').each(function() {
			var index = $(this).attr('index');
			var value = Heart.ysize;
			value = (value < 0 ? index * value * -1 : index / value);
			$(this).html((value / 10).toFixed(1));
		});
	},
	mousemove: function(e) {
		if (!Ruler.isMoving) return;
		var target = $('#rulerDiv');
		target.css('left', (e.clientX + Ruler.offsetX) + 'px');
		target.css('top', (e.clientY + Ruler.offsetY) + 'px');
	},
	mousedown: function(e) {
		var target = $('#rulerDiv'),
			top = parseInt(target.css('top'), 10) || 2,
			left = parseInt(target.css('left'), 10) || 225;
		Ruler.isMoving = true;
		Ruler.offsetX = left - e.clientX;
		Ruler.offsetY = top - e.clientY;
	},
	mouseup: function() {
		if (!Ruler.isMoving) return;
		Ruler.isMoving = false;
	}
};
