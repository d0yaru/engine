//------------------------------------------------------------------------------
vsSource = `
		attribute vec4 a_position;
		attribute vec2 a_texcoord;
		uniform mat4 u_matrix;
		varying vec2 v_texcoord;

		void main() {
			gl_Position = u_matrix * a_position;
			v_texcoord = a_texcoord;
		}
	`;
//------------------------------------------------------------------------------
fsSource = `
		precision mediump float;

		// Passed in from the vertex shader.
		varying vec2 v_texcoord;

		uniform sampler2D u_texture;

		void main() {
			gl_FragColor = texture2D(u_texture, v_texcoord);
		}
	`;
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

var fontInfo = {
	letterHeight: 8,
	spaceWidth: 8,
	spacing: -1,
	textureWidth: 64,
	textureHeight: 40,
	glyphInfos: {
		'a': { x:  0, y:  0, width: 8, },
		'b': { x:  8, y:  0, width: 8, },
		'c': { x: 16, y:  0, width: 8, },
		'd': { x: 24, y:  0, width: 8, },
		'e': { x: 32, y:  0, width: 8, },
		'f': { x: 40, y:  0, width: 8, },
		'g': { x: 48, y:  0, width: 8, },
		'h': { x: 56, y:  0, width: 8, },
		'i': { x:  0, y:  8, width: 8, },
		'j': { x:  8, y:  8, width: 8, },
		'k': { x: 16, y:  8, width: 8, },
		'l': { x: 24, y:  8, width: 8, },
		'm': { x: 32, y:  8, width: 8, },
		'n': { x: 40, y:  8, width: 8, },
		'o': { x: 48, y:  8, width: 8, },
		'p': { x: 56, y:  8, width: 8, },
		'q': { x:  0, y: 16, width: 8, },
		'r': { x:  8, y: 16, width: 8, },
		's': { x: 16, y: 16, width: 8, },
		't': { x: 24, y: 16, width: 8, },
		'u': { x: 32, y: 16, width: 8, },
		'v': { x: 40, y: 16, width: 8, },
		'w': { x: 48, y: 16, width: 8, },
		'x': { x: 56, y: 16, width: 8, },
		'y': { x:  0, y: 24, width: 8, },
		'z': { x:  8, y: 24, width: 8, },
		'0': { x: 16, y: 24, width: 8, },
		'1': { x: 24, y: 24, width: 8, },
		'2': { x: 32, y: 24, width: 8, },
		'3': { x: 40, y: 24, width: 8, },
		'4': { x: 48, y: 24, width: 8, },
		'5': { x: 56, y: 24, width: 8, },
		'6': { x:  0, y: 32, width: 8, },
		'7': { x:  8, y: 32, width: 8, },
		'8': { x: 16, y: 32, width: 8, },
		'9': { x: 24, y: 32, width: 8, },
		'-': { x: 32, y: 32, width: 8, },
		'*': { x: 40, y: 32, width: 8, },
		'!': { x: 48, y: 32, width: 8, },
		'?': { x: 56, y: 32, width: 8, },
	},
};
//------------------------------------------------------------------------------
function makeVerticesForString(fontInfo, s)
{
	var len = s.length;
	var numVertices = len * 6;
	var positions = new Float32Array(numVertices * 2);
	var texcoords = new Float32Array(numVertices * 2);
	var offset = 0;
	var x = 0;
	var maxX = fontInfo.textureWidth;
	var maxY = fontInfo.textureHeight;
	for (var ii = 0; ii < len; ++ii) {
		var letter = s[ii];
		var glyphInfo = fontInfo.glyphInfos[letter];
		if (glyphInfo) {
			var x2 = x + glyphInfo.width;
			var u1 = glyphInfo.x / maxX;
			var v1 = (glyphInfo.y + fontInfo.letterHeight - 1) / maxY;
			var u2 = (glyphInfo.x + glyphInfo.width - 1) / maxX;
			var v2 = glyphInfo.y / maxY;

			// 6 вершин на букву
			positions[offset + 0] = x;
			positions[offset + 1] = 0;
			texcoords[offset + 0] = u1;
			texcoords[offset + 1] = v1;

			positions[offset + 2] = x2;
			positions[offset + 3] = 0;
			texcoords[offset + 2] = u2;
			texcoords[offset + 3] = v1;

			positions[offset + 4] = x;
			positions[offset + 5] = fontInfo.letterHeight;
			texcoords[offset + 4] = u1;
			texcoords[offset + 5] = v2;

			positions[offset + 6] = x;
			positions[offset + 7] = fontInfo.letterHeight;
			texcoords[offset + 6] = u1;
			texcoords[offset + 7] = v2;

			positions[offset + 8] = x2;
			positions[offset + 9] = 0;
			texcoords[offset + 8] = u2;
			texcoords[offset + 9] = v1;

			positions[offset + 10] = x2;
			positions[offset + 11] = fontInfo.letterHeight;
			texcoords[offset + 10] = u2;
			texcoords[offset + 11] = v2;

			x += glyphInfo.width + fontInfo.spacing;
			offset += 12;
			} else {
			// у нас нет такого персонажа, так что просто продвигайтесь вперед
			x += fontInfo.spaceWidth;
		}
	}

	// возвращает ArrayBufferViews для части TypedArrays
	//, которые были фактически использованы.
	return {
		arrays: {
		position: new Float32Array(positions.buffer, 0, offset),
		texcoord: new Float32Array(texcoords.buffer, 0, offset),
		},
		numVertices: offset / 2,
	};
}
//------------------------------------------------------------------------------
function main()
{
	// Получите контекст WebGL
	// /** @type {HTMLCanvasElement} */ // хз зачем - отключил
	//--------------------------------------------------------------------------
	var canvas = document.querySelector("#canvas");
	var gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}
	//--------------------------------------------------------------------------
	// Вручную создайте BufferInfo
	var textBufferInfo = {
		attribs: {
		a_position: { buffer: gl.createBuffer(), numComponents: 2, },
		a_texcoord: { buffer: gl.createBuffer(), numComponents: 2, },
		},
		numElements: 0,
	};
	//--------------------------------------------------------------------------
	var textProgramInfo = webglUtils.createProgramInfo(gl, ["text-vertex-shader", "text-fragment-shader"]);
	////////////////////////////////////////////////////////////////////////////
	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, this.vsSource);
	gl.compileShader(vertexShader);
	// проверка компиляции
	const vertexLog = gl.getShaderInfoLog(vertexShader);
	if (vertexLog.length > 0) console.log(vertexLog);
	else console.log("vertexShaderT ... [ ok ]");
	//----------------------------------------------------------------------
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, this.fsSource);
	gl.compileShader(fragmentShader);
	const fragmentLog = gl.getShaderInfoLog(fragmentShader);
	if (fragmentLog.length > 0) console.log(fragmentLog);
	else console.log("fragmentShaderT ... [ ok ]");
	//----------------------------------------------------------------------
	// Для связывания двух типов шейдеров вместе используется программа
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	// проверка компиляции
	const programLog = gl.getProgramInfoLog(shaderProgram);
	if (programLog.length > 0) console.log(programLog);
	else console.log("programShaderT ... [ ok ]");
	//----------------------------------------------------------------------
	// attribute vec4
	const vertexPosition = gl.getAttribLocation(shaderProgram, 'a_position');
	const textureCoord = gl.getAttribLocation(shaderProgram, 'a_texcoord');// xTexture 1
	// uniform mat4
	const projectionMatrix2 = gl.getUniformLocation(shaderProgram, 'u_matrix');
	// uniform sampler2D
	const uSampler2 = gl.getUniformLocation(shaderProgram, 'u_texture');// xTexture 2
		//----------------------------------------------------------------------
	////////////////////////////////////////////////////////////////////////////
	//--------------------------------------------------------------------------
	// Создайте текстуру.
	var glyphTex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, glyphTex);
	// Заполните текстуру синим пикселем размером 1x1.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
	// Асинхронная загрузка изображения
	var image = new Image();
	image.src = "8x8-font.png";
	image.addEventListener('load', function() {
		// Теперь, когда изображение загружено, скопируйте его в текстуру.
		gl.bindTexture(gl.TEXTURE_2D, glyphTex);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	});
	//--------------------------------------------------------------------------
	var names = [
		"anna",   // 0
		"colin",  // 1
		"james",  // 2
		"danny",  // 3
		"kalin",  // 4
		"hiro",   // 5
		"eddie",  // 6
		"shu",    // 7
		"brian",  // 8
		"tami",   // 9
		"rick",   // 10
		"gene",   // 11
		"natalie",// 12,
		"evan",   // 13,
		"sakura", // 14,
		"kai",    // 15,
	];
	//--------------------------------------------------------------------------
	var textUniforms = {
		u_matrix: m4.identity(),
		u_texture: glyphTex,
		u_color: [0, 0, 0, 1],  // black
	};

	requestAnimationFrame(drawScene);
	//--------------------------------------------------------------------------
	function drawScene()
	{
		gl.clearColor(0.2, 0.0, 0.2, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		//--
		// gl.enableVertexAttribArray(vertexPosition);
		// gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
		
		// gl.bindBuffer(gl.ARRAY_BUFFER, textureCoord);
		// gl.enableVertexAttribArray(textureCoord);
		// gl.vertexAttribPointer(textureCoord, 2, gl.FLOAT, false, 0, 0);

		

		// gl.uniform1i(uSampler2, 0);

		gl.useProgram(shaderProgram);
		////////////////////////////////////////////////////////////////////////
		//----------------------------------------------------------------------
		// var projectionMatrix = m4.perspective(60 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 2000);
		let projectionMatrix = glMatrix.mat4.create();
		glMatrix.mat4.perspective(projectionMatrix,
			45*Math.PI/180,
			gl.canvas.clientWidth/gl.canvas.clientHeight,
			0.1, 10000.0);

			gl.uniformMatrix4fv(projectionMatrix2, false, projectionMatrix);// камера
		//----------------------------------------------------------------------
		//+ gl.useProgram(textProgramInfo.program);

		//- webglUtils.setBuffersAndAttributes(gl, textProgramInfo, textBufferInfo);
		
		var s = names[4] + ":" + 333 + "," + 777 + "," + 888;
		var vertices = makeVerticesForString(fontInfo, s);

		// gl.bindBuffer(gl.ARRAY_BUFFER, textBufferInfo.attribs.a_position.buffer);
		gl.bindBuffer(gl.ARRAY_BUFFER, textBufferInfo.attribs.a_position.buffer);
		gl.enableVertexAttribArray(vertexPosition);
		gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);

		// gl.bufferData(gl.ARRAY_BUFFER, vertices.arrays.position, gl.DYNAMIC_DRAW);
		gl.bufferData(gl.ARRAY_BUFFER, vertices.arrays.position, gl.STATIC_DRAW);
		//--
		// gl.bindBuffer(gl.ARRAY_BUFFER, textBufferInfo.attribs.a_texcoord.buffer);
		gl.bindBuffer(gl.ARRAY_BUFFER, textBufferInfo.attribs.a_texcoord.buffer);
		gl.enableVertexAttribArray(textureCoord);
		gl.vertexAttribPointer(textureCoord, 2, gl.FLOAT, false, 0, 0);

		// gl.bufferData(gl.ARRAY_BUFFER, vertices.arrays.texcoord, gl.DYNAMIC_DRAW);
		gl.bufferData(gl.ARRAY_BUFFER, vertices.arrays.texcoord,gl.STATIC_DRAW);

		// var textMatrix = m4.translate(projectionMatrix, 0, 0, -210);
		// m4.copy(textMatrix, textUniforms.u_matrix);
		// webglUtils.setUniforms(textProgramInfo, textUniforms);
		
		// glMatrix.mat4.translate(modelViewMatrix,modelViewMatrix,[-obj[id][0], -obj[id][1], -obj[id][2]]);
		
		gl.uniformMatrix4fv(projectionMatrix2, false, projectionMatrix);// объект

		const modelViewMatrix3 = glMatrix.mat4.create();
		glMatrix.mat4.translate(modelViewMatrix3,modelViewMatrix3,0, 0, 0);
		gl.uniformMatrix4fv(projectionMatrix2, false, modelViewMatrix3);// объект

		gl.drawArrays(gl.TRIANGLES, 0, vertices.numVertices);
		//----------------------------------------------------------------------
		requestAnimationFrame(drawScene);
	}
}
//------------------------------------------------------------------------------
main();
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
