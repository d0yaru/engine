//------------------------------------------------------------------------------
class Objs
{
	// constructor(){}
	//
	// Буферы инициализации
	//
	// Инициализируем буферы, которые нам понадобятся. Для этой демонстрации мы просто
	// есть один объект - простой трехмерный куб.
	//
	initBuffers(gl)
	{
		//--------------------------------------------------------------------------
		// Создайте буфер для позиций вершин куба.
		const positionBuffer = gl.createBuffer();
		// Выберите позиционный буфер в качестве буфера для применения
		// операции, чтобы отсюда выйти.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		// Теперь создайте массив позиций для куба.
		const positions = [
			-0.5, -0.5,  0.0,// 8
			0.5, -0.5,  0.0,// 9
			0.5,  0.5,  0.0,// 10
			-0.5,  0.5,  0.0,// 11
		];
		// Теперь передайте список позиций в WebGL, чтобы создать
		// форма. Мы делаем это, создавая Float32Array из
		// Массив JavaScript, затем используйте его для заполнения текущего буфера.

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		//--------------------------------------------------------------------------
		// xColour 1
		// Теперь настройте цвета для граней. Мы будем использовать однотонные цвета
		// для каждого лица.

		const faceColors = [
			[1.0,  1.0,  1.0,  1.0],    // Front face: white
			[1.0,  0.0,  0.0,  1.0],    // Back face: red
			[0.0,  1.0,  0.0,  1.0],    // Top face: green
			[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
			[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
			[1.0,  0.0,  1.0,  1.0],    // Left face: purple
		];

		// Преобразуйте массив цветов в таблицу для всех вершин.

		var colors = [];

		for (var j = 0; j < faceColors.length; ++j) {
			// const c = faceColors[j];
			const c = faceColors[5];

			// Повторите каждый цвет четыре раза для четырех вершин грани
			colors = colors.concat(c, c, c, c);
		}

		const colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		//--------------------------------------------------------------------------
		// Установите нормали для вершин, чтобы мы могли вычислить освещение.
		const normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

		const vertexNormals = [
			0.0,  0.0,  1.0,// 8
			0.0,  0.0,  1.0,// 9
			0.0,  0.0,  1.0,// 10
			0.0,  0.0,  1.0,// 11
		];
		
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
		//--------------------------------------------------------------------------
		// Теперь установите текстурные координаты для граней.
		const textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

		const textureCoordinates = [
			0.0,  1.0,// 8
			1.0,  1.0,// 9
			1.0,  0.0,// 10
			0.0,  0.0,// 11
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),gl.STATIC_DRAW);
		//--------------------------------------------------------------------------
		// Создайте буфер массива элементов; это определяет индексы
		// в массивы вершин для вершин каждой грани.
		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		// Этот массив определяет каждую грань как два треугольника, используя
		// индексирует массив вершин, чтобы указать размер каждого треугольника
		// позиция.

		const indices = [
			0,  1,  2,      0,  2,  3,
		];
		
		// Теперь отправьте массив элементов в GL
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices), gl.STATIC_DRAW);
		//--------------------------------------------------------------------------
		return {
			position: positionBuffer,
			indices: indexBuffer,
			color: colorBuffer,// xColour 2
			normal: normalBuffer,// xLighting
		};
		//--------------------------------------------------------------------------
	}
	//------------------------------------------------------------------------------
}
//------------------------------------------------------------------------------
