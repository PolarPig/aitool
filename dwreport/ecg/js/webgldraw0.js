var ecgdraw = function(id) {

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

	//定义线段数组
	var vertices = []

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

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		let size = vertices.length / 3
		gl.drawArrays(gl.LINES, 0, size);
	}
	setInterval(drawCanvas, 100);

	var dealData = function() {
		let x = randomNum(-1, 1, 1)
		let y = randomNum(-1, 1, 1)
		vertices.push(Number(x))
		vertices.push(Number(y))
		vertices.push(0)
	}

	setInterval(dealData, 4);

}