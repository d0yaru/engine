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
		// attribute vec4 aVertexColor;
		// varying lowp vec4 vColor;
		//----------------------------------------------------------------------
		// xLighting 1
		attribute vec3 aVertexNormal;
		uniform mat4 uNormalMatrix;
		varying highp vec3 vLighting;
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
			// vColor = aVertexColor;// xColour 2
			//------------------------------------------------------------------
			// xLighting 2 (Примените световой эффект)
			highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);// vec3(0.3, 0.3, 0.3);
			highp vec3 directionalLightColor = vec3(1, 1, 1);
			highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
			highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
			highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
			vLighting = ambientLight + (directionalLightColor * directional);
			//------------------------------------------------------------------
			vTextureCoord = aTextureCoord;// xTexture 2
			//------------------------------------------------------------------
		}
		`;
	//--------------------------------------------------------------------------
	// Программа для создания фрагментных шейдеров
	fsSource = `
		//----------------------------------------------------------------------
		// varying lowp vec4 vColor;// xColour 3
		varying highp vec3 vLighting;// xLighting 3
		//----------------------------------------------------------------------
		// xTexture 3
		varying highp vec2 vTextureCoord;
		uniform sampler2D uSampler;
		//----------------------------------------------------------------------

		void main(void)
		{
			//------------------------------------------------------------------
			// gl_FragColor = vColor;// xColour 4
			//------------------------------------------------------------------
			// xLighting 4
			// highp vec4 texelColor = vColor;// xColour
			highp vec4 texelColor = texture2D(uSampler, vTextureCoord);// xTexture

			gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
			//------------------------------------------------------------------
			// gl_FragColor = texture2D(uSampler, vTextureCoord);// xTexture 4
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
		else console.log("vertexShader ... [ ok ]");
		//----------------------------------------------------------------------
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, this.fsSource);
		gl.compileShader(fragmentShader);
		const fragmentLog = gl.getShaderInfoLog(fragmentShader);
		if (fragmentLog.length > 0) console.log(fragmentLog);
		else console.log("fragmentShader ... [ ok ]");
		//----------------------------------------------------------------------
		// Для связывания двух типов шейдеров вместе используется программа
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		// проверка компиляции
		const programLog = gl.getProgramInfoLog(shaderProgram);
		if (programLog.length > 0) console.log(programLog);
		else console.log("programShader ... [ ok ]");
		//----------------------------------------------------------------------
		// Получим местоположение переменных в программе шейдеров
		const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
		// const vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor');// xColour 1
		const vertexNormal = gl.getAttribLocation(shaderProgram, 'aVertexNormal');// xLighting 1
		const textureCoord = gl.getAttribLocation(shaderProgram, 'aTextureCoord');// xTexture 1

		const projectionMatrix2 = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
		const modelViewMatrix2 = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
		const normalMatrix2 = gl.getUniformLocation(shaderProgram, 'uNormalMatrix');// xLighting 2
		const uSampler2 = gl.getUniformLocation(shaderProgram, 'uSampler');// xTexture 2
		//----------------------------------------------------------------------
		return {
			shaderProgram: shaderProgram,

			vertexPosition: vertexPosition,
			// vertexColor: vertexColor,
			vertexNormal: vertexNormal,
			textureCoord: textureCoord,

			projectionMatrix2: projectionMatrix2,
			modelViewMatrix2: modelViewMatrix2,
			normalMatrix2: normalMatrix2,
			uSampler2: uSampler2,
		};
		//----------------------------------------------------------------------
		////////////////////////////////////////////////////////////////////////
		//----------------------------------------------------------------------
	}
}
//------------------------------------------------------------------------------
