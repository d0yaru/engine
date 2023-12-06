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
		// xTexture 1
		attribute vec2 aTextureCoord;
		varying highp vec2 vTextureCoord;
		//----------------------------------------------------------------------

		void main(void)
		{
			//------------------------------------------------------------------
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
			//------------------------------------------------------------------
			vTextureCoord = aTextureCoord;// xTexture 2
			//------------------------------------------------------------------
		}
		`;
	//--------------------------------------------------------------------------
	// Программа для создания фрагментных шейдеров
	fsSource = `
		//----------------------------------------------------------------------
		// xTexture 3
		varying highp vec2 vTextureCoord;
		uniform sampler2D uSampler;
		//----------------------------------------------------------------------

		void main(void)
		{
			highp vec4 texelColor = texture2D(uSampler, vTextureCoord);// xTexture
			gl_FragColor = texture2D(uSampler, vTextureCoord);// xTexture 4
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
		// Получим местоположение переменных в программе шейдеров
		const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
		const textureCoord = gl.getAttribLocation(shaderProgram, 'aTextureCoord');// xTexture 1

		const projectionMatrix2 = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
		const modelViewMatrix2 = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
		const uSampler2 = gl.getUniformLocation(shaderProgram, 'uSampler');// xTexture 2
		//----------------------------------------------------------------------
		return {
			shaderProgram: shaderProgram,

			vertexPosition: vertexPosition,
			textureCoord: textureCoord,

			projectionMatrix2: projectionMatrix2,
			modelViewMatrix2: modelViewMatrix2,
			uSampler2: uSampler2,
		};
		//----------------------------------------------------------------------
		////////////////////////////////////////////////////////////////////////
		//----------------------------------------------------------------------
	}
}
//------------------------------------------------------------------------------
