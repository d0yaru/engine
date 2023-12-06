//------------------------------------------------------------------------------
class Shader
{
	//--------------------------------------------------------------------------
	// Программа для создания вершинных шейдеров
	vsSource = `
		//----------------------------------------------------------------------
		attribute vec4 aVertexPosition;
		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;
		//----------------------------------------------------------------------
		// xColour 1
		attribute vec4 aVertexColor;
		varying lowp vec4 vColor;
		//----------------------------------------------------------------------

		void main(void)
		{
			//------------------------------------------------------------------
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
			//------------------------------------------------------------------
			vColor = aVertexColor;// xColour 2
			//------------------------------------------------------------------
		}
		`;
	//--------------------------------------------------------------------------
	// Программа для создания фрагментных шейдеров
	fsSource = `
		//----------------------------------------------------------------------
		varying lowp vec4 vColor;// xColour 3
		//----------------------------------------------------------------------

		void main(void)
		{
			//------------------------------------------------------------------
			gl_FragColor = vColor;// xColour 4
			//------------------------------------------------------------------
		}
		`;
	//--------------------------------------------------------------------------
	constructor() {}

	initShader()
	{
		//----------------------------------------------------------------------
		// Код шейдеров нужно скомпилировать ///////////////////////////////////
		//----------------------------------------------------------------------
		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, this.vsSource);
		gl.compileShader(vertexShader);
		// проверка компиляции
		const vertexLog = gl.getShaderInfoLog(vertexShader);
		if (vertexLog.length > 0) console.log(vertexLog);
		else console.log("vertexShaderC ... [ ok ]");
		//----------------------------------------------------------------------
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, this.fsSource);
		gl.compileShader(fragmentShader);
		const fragmentLog = gl.getShaderInfoLog(fragmentShader);
		if (fragmentLog.length > 0) console.log(fragmentLog);
		else console.log("fragmentShaderC ... [ ok ]");
		//----------------------------------------------------------------------
		// Для связывания двух типов шейдеров вместе используется программа
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		// проверка компиляции
		const programLog = gl.getProgramInfoLog(shaderProgram);
		if (programLog.length > 0) console.log(programLog);
		else console.log("programShaderC ... [ ok ]");
		//----------------------------------------------------------------------
		// Получим местоположение переменных в программе шейдеров
		const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
		const vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor');// xColour 1

		const projectionMatrix2 = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
		const modelViewMatrix2 = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
		//----------------------------------------------------------------------
		return {
			shaderProgram: shaderProgram,

			vertexPosition: vertexPosition,
			vertexColor: vertexColor,

			projectionMatrix2: projectionMatrix2,
			modelViewMatrix2: modelViewMatrix2,
		};
		//----------------------------------------------------------------------
		////////////////////////////////////////////////////////////////////////
		//----------------------------------------------------------------------
	}
}
//------------------------------------------------------------------------------
