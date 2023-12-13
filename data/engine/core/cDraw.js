//------------------------------------------------------------------------------
class Draw
{
	constructor() {}

	clearScene(gl,_r,_g,_b)
	{
		gl.clearColor(_r, _g, _b, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);// очистка фона и буфера глубины
	}

	getColor()
	{
		const pixels = new Uint8Array(4);
		gl.readPixels(940/2, 570/2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		if (pixels[0] < map.setmap[map.level].length)
		{
			// console.log(pixels[0]);
			map.objId = pixels[0];

			if (pixels[0] == 0)
			{
				death2Sound.play();
				map.enemyhp -= 20;
				if (map.enemyhp <= 0)
				{
					if (map.enemyhp < 0) map.enemyhp = 0;
					deathSound.play();
					obj[0][12] = 0;
				}
				chud.setenemy(map.enemyhp);
			}
			shotLook = true;
		}
		return pixels[0];
	}

	// initDraw(gl, buffers)
	// {
		// gl.enable(gl.DEPTH_TEST);// Включает буфер глубины
		//----------------------------------------------------------------------
		//   О С В Е Щ Е Н И Е   ///////////////////////////////////////////////
		//----------------------------------------------------------------------
		////////////////////////////////////////////////////////////////////////
		//----------------------------------------------------------------------
		// Расскажите WebGL, как извлечь позиции из позиции буфер в атрибут положения вершины
		// gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		// gl.enableVertexAttribArray(shader.vertexPosition2);
		// gl.vertexAttribPointer(shader.vertexPosition2, 3, gl.FLOAT, false, 0, 0);

		// gl.enableVertexAttribArray(shader.vertexPosition);
		// gl.vertexAttribPointer(shader.vertexPosition, 3, gl.FLOAT, false, 0, 0);
		//----------------------------------------------------------------------
		// Подскажите WebGL, как извлечь координаты текстуры из
		// буфер координат текстуры преобразуется в атрибут textureCoordattribute.
		// xTexture 1
		// if (map.xTexture)
		// {
		// 	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
		// 	gl.enableVertexAttribArray(shader.textureCoord);
		// 	gl.vertexAttribPointer(shader.textureCoord, 2, gl.FLOAT, false, 0, 0);
		// }
		//----------------------------------------------------------------------
		// Расскажите WebGL, как извлечь нормали из
		// обычный буфер в атрибут vertexNormalattribute.
		// xLighting 4 если отключить цвет (Расскоментить)
		// if (map.xLighting)
		// {
		// 	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
		// 	gl.enableVertexAttribArray(shader.vertexNormal);
		// 	gl.vertexAttribPointer(shader.vertexNormal, 3, gl.FLOAT, false, 0, 0);
		// }
		//----------------------------------------------------------------------
		// Сообщите WebGL, какие индексы использовать для индексации вершин
		// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
		//----------------------------------------------------------------------
		////////////////////////////////////////////////////////////////////////
		//----------------------------------------------------------------------
		// gl.useProgram(shader.shaderProgram);// Включает шейдерную программу
		//----------------------------------------------------------------------
	// }

	// updateCam(_camera)
	// {
	// 	// gl.uniformMatrix4fv(shader.projectionMatrix22, false, _camera);// камера
	// 	// gl.uniformMatrix4fv(shader.projectionMatrix2, false, _camera);// камера
	// }

	drawScene(gl, texture, obj, id, buffers)
	{
		map.xColour = false;
		map.xTexture = true;
		map.xLighting = true;

		gl.enable(gl.DEPTH_TEST);// Включает буфер глубины
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.enableVertexAttribArray(shader.vertexPosition);
		gl.vertexAttribPointer(shader.vertexPosition, 3, gl.FLOAT, false, 0, 0);
		if (map.xTexture)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
			gl.enableVertexAttribArray(shader.textureCoord);
			gl.vertexAttribPointer(shader.textureCoord, 2, gl.FLOAT, false, 0, 0);
		}
		if (map.xLighting)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
			gl.enableVertexAttribArray(shader.vertexNormal);
			gl.vertexAttribPointer(shader.vertexNormal, 3, gl.FLOAT, false, 0, 0);
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

		gl.uniformMatrix4fv(shader.projectionMatrix2, false, cameraMatrix);// камера
		//----------------------------------------------------------------------
		gl.useProgram(shader.shaderProgram);// Включает шейдерную программу
		//----------------------------------------------------------------------
		// Подскажите WebGL, как извлечь цвета из цветового буфера в атрибут цвета вершины.
		// xColour 1
		if (map.xColour)
		{
			let colors = [];
			let colorObj = id/255;
			let c = [colorObj, colorObj, colorObj, 1];
			colors = colors.concat(c, c, c, c);
			//--
			const colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
			//--
			// gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.enableVertexAttribArray(shader.vertexColor);
			gl.vertexAttribPointer(shader.vertexColor,4,gl.FLOAT,false,0,0);
			//--
		}
		//----------------------------------------------------------------------
		// установка объекта по координатам
		const modelViewMatrix = glMatrix.mat4.create();
		glMatrix.mat4.translate(modelViewMatrix,modelViewMatrix,[-obj[id][0], -obj[id][1], -obj[id][2]]);

		glMatrix.mat4.rotate(modelViewMatrix,modelViewMatrix,obj[id][3]*Math.PI/180,[1, 0, 0]);
		glMatrix.mat4.rotate(modelViewMatrix,modelViewMatrix,obj[id][4]*Math.PI/180,[0, 1, 0]);
		glMatrix.mat4.rotate(modelViewMatrix,modelViewMatrix,obj[id][5]*Math.PI/180,[0, 0, 1]);

		glMatrix.mat4.scale(modelViewMatrix, modelViewMatrix, [obj[id][6],obj[id][7],obj[id][8]]);
		//----------------------------------------------------------------------
		// xLighting 3
		const normalMatrix = glMatrix.mat4.create();
		if (map.xLighting)
		{
			glMatrix.mat4.invert(normalMatrix, modelViewMatrix);// Инвертированная матрица
			glMatrix.mat4.transpose(normalMatrix, normalMatrix);// Транспонирует матрицу, отражая ее значения по диагонали.
		}
		//----------------------------------------------------------------------
		// загрузка в шейдеры новых данных
		gl.uniformMatrix4fv(shader.modelViewMatrix2, false, modelViewMatrix);// объект
		if (map.xLighting) gl.uniformMatrix4fv(shader.normalMatrix2, false, normalMatrix);// xLighting 5 освещение
		//----------------------------------------------------------------------
		// Указываем текстуру для отображения
		// xTexture 2
		if (map.xTexture)
		{
			gl.activeTexture(gl.TEXTURE0);// Сообщите WebGL, что сделать активным текстурный блок 0
			gl.bindTexture(gl.TEXTURE_2D, texture[obj[id][9]]);// Привязать текстуру к текстурному блоку 0
			// Сообщите шейдеру, что мы привязали текстуру к текстурному блоку 0
			gl.uniform1i(shader.uSampler2, 0);
		}
		//----------------------------------------------------------------------
		// gl.POINTS: рисует одну точку.
		// gl.LINE_STRIP: рисует прямую линию до следующей вершины.
		// gl.LINE_LOOP: рисует прямую линию до следующей вершины и соединяет последнюю вершину с первой.
		// gl.LINES: рисует линию между парой вершин.
		// gl.TRIANGLE_STRIPw
		// gl.TRIANGLE_FAN
		// gl.TRIANGLES: рисует треугольник для группы из трех вершин.
		//----------------------------------------------------------------------
		switch(obj[id][10])
		{
		// case 0:// point
		// 	// gl.drawArrays(gl.POINTS, 0, 1);
		// 	gl.drawElements(gl.TRIANGLES, 1, gl.UNSIGNED_SHORT, 0);
		// 	break;
		// case 1:// line
		// 	// gl.drawArrays(gl.LINES, 0, 2);
		// 	gl.drawElements(gl.TRIANGLES, 2, gl.UNSIGNED_SHORT, 0);
		// 	break;
		// case 2:// triangleк90
		// 	// gl.drawArrays(gl.TRIANGLES, 2, 3);
		// 	gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 2);
		// 	break;
		// case 3:// triangle
		// 	// gl.drawArrays(gl.TRIANGLES, 5, 3);
		// 	// gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 5);
		// 	break;
		// case 4:// square
		// 	// gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		// 	gl.drawElements(gl.TRIANGLES, 4, gl.UNSIGNED_SHORT, 8);
		// 	break;
		// case 5:// triangle90_3d
		// 	gl.drawArrays(gl.TRIANGLE_FAN, 12, 5);
		// 	break;
		case 0:// cube
			// gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
			break;
		}
		//----------------------------------------------------------------------
	}
	//--------------------------------------------------------------------------
	drawScene2(gl, texture, obj, id, buffers)
	{
		map.xColour = true;
		map.xTexture = false;
		map.xLighting = false;

		gl.enable(gl.DEPTH_TEST);// Включает буфер глубины
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.enableVertexAttribArray(shader.vertexPosition2);
		gl.vertexAttribPointer(shader.vertexPosition2, 3, gl.FLOAT, false, 0, 0);
		if (map.xTexture)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
			gl.enableVertexAttribArray(shader.textureCoord);
			gl.vertexAttribPointer(shader.textureCoord, 2, gl.FLOAT, false, 0, 0);
		}
		if (map.xLighting)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
			gl.enableVertexAttribArray(shader.vertexNormal);
			gl.vertexAttribPointer(shader.vertexNormal, 3, gl.FLOAT, false, 0, 0);
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

		gl.uniformMatrix4fv(shader.projectionMatrix22, false, cameraMatrix);// камера
		//----------------------------------------------------------------------
		gl.useProgram(shader.shaderProgram2);// Включает шейдерную программу
		//----------------------------------------------------------------------
		// Подскажите WebGL, как извлечь цвета из цветового буфера в атрибут цвета вершины.
		// xColour 1
		if (map.xColour)
		{
			let colors = [];
			let colorObj = id/255;
			let c = [colorObj, colorObj, colorObj, 1];
			colors = colors.concat(c, c, c, c);
			//--
			const colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
			//--
			// gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.enableVertexAttribArray(shader.vertexColor2);
			gl.vertexAttribPointer(shader.vertexColor2,4,gl.FLOAT,false,0,0);
		}
		//----------------------------------------------------------------------
		// установка объекта по координатам
		const modelViewMatrix3 = glMatrix.mat4.create();
		glMatrix.mat4.translate(modelViewMatrix3,modelViewMatrix3,[-obj[id][0], -obj[id][1], -obj[id][2]]);

		glMatrix.mat4.rotate(modelViewMatrix3,modelViewMatrix3,obj[id][3]*Math.PI/180,[1, 0, 0]);
		glMatrix.mat4.rotate(modelViewMatrix3,modelViewMatrix3,obj[id][4]*Math.PI/180,[0, 1, 0]);
		glMatrix.mat4.rotate(modelViewMatrix3,modelViewMatrix3,obj[id][5]*Math.PI/180,[0, 0, 1]);

		glMatrix.mat4.scale(modelViewMatrix3, modelViewMatrix3, [obj[id][6],obj[id][7],obj[id][8]]);
		//----------------------------------------------------------------------
		// xLighting 3
		// const normalMatrix = glMatrix.mat4.create();
		// if (map.xLighting)
		// {
		// 	glMatrix.mat4.invert(normalMatrix, modelViewMatrix);// Инвертированная матрица
		// 	glMatrix.mat4.transpose(normalMatrix, normalMatrix);// Транспонирует матрицу, отражая ее значения по диагонали.
		// }
		//----------------------------------------------------------------------
		// загрузка в шейдеры новых данных
		gl.uniformMatrix4fv(shader.modelViewMatrix22, false, modelViewMatrix3);// объект
		//if (map.xLighting) gl.uniformMatrix4fv(shader.normalMatrix2, false, normalMatrix);// xLighting 5 освещение
		//----------------------------------------------------------------------
		// Указываем текстуру для отображения
		// xTexture 2
		// if (map.xTexture)
		// {
		// 	gl.activeTexture(gl.TEXTURE0);// Сообщите WebGL, что сделать активным текстурный блок 0
		// 	gl.bindTexture(gl.TEXTURE_2D, texture[obj[id][9]]);// Привязать текстуру к текстурному блоку 0
		// 	// Сообщите шейдеру, что мы привязали текстуру к текстурному блоку 0
		// 	gl.uniform1i(shader.uSampler2, 0);
		// }
		//----------------------------------------------------------------------
		switch(obj[id][10])
		{
		case 0:
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
			break;
		}
		//----------------------------------------------------------------------
		scene.getColor();
	}
	//--------------------------------------------------------------------------
}
//------------------------------------------------------------------------------
