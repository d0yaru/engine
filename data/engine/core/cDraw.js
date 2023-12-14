//------------------------------------------------------------------------------
class Draw
{
	//--------------------------------------------------------------------------
	constructor() {}
	//--------------------------------------------------------------------------
	clearScene(gl,_r,_g,_b)// очистка сцены
	{
		gl.clearColor(_r, _g, _b, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);// очистка фона и буфера глубины
	}
	//--------------------------------------------------------------------------
	getColor()// чтение цвета пикселя с центра экрана
	{
		const pixels = new Uint8Array(4);
		gl.readPixels(940/2, 570/2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		if (pixels[0] < map.setmap[map.level].length)
		{
			// console.log(` >> getColor() ... [${pixels[0]}]`);
			map.shotAction(pixels[0]);
			// shotLook = true;
			setTimeout(() => { shotLook = true; }, 100);
		}
	}
	//--------------------------------------------------------------------------
	drawScene(gl, texture, id, buffers)// рисует сцену с текстурами и освещением
	{
		gl.enable(gl.DEPTH_TEST);// Включает буфер глубины
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.enableVertexAttribArray(shader.vertexPosition);
		gl.vertexAttribPointer(shader.vertexPosition, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
		gl.enableVertexAttribArray(shader.textureCoord);
		gl.vertexAttribPointer(shader.textureCoord, 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
		gl.enableVertexAttribArray(shader.vertexNormal);
		gl.vertexAttribPointer(shader.vertexNormal, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

		gl.uniformMatrix4fv(shader.projectionMatrix2, false, cameraMatrix);// камера
		//----------------------------------------------------------------------
		gl.useProgram(shader.shaderProgram);// Включает шейдерную программу
		//----------------------------------------------------------------------
		// установка объекта по координатам
		const modelViewMatrix = glMatrix.mat4.create();
		glMatrix.mat4.translate(modelViewMatrix,modelViewMatrix,[-map.setmap[map.level][id][0], -map.setmap[map.level][id][1], -map.setmap[map.level][id][2]]);

		glMatrix.mat4.rotate(modelViewMatrix,modelViewMatrix,map.setmap[map.level][id][3]*Math.PI/180,[1, 0, 0]);
		glMatrix.mat4.rotate(modelViewMatrix,modelViewMatrix,map.setmap[map.level][id][4]*Math.PI/180,[0, 1, 0]);
		glMatrix.mat4.rotate(modelViewMatrix,modelViewMatrix,map.setmap[map.level][id][5]*Math.PI/180,[0, 0, 1]);

		glMatrix.mat4.scale(modelViewMatrix, modelViewMatrix, [map.setmap[map.level][id][6],map.setmap[map.level][id][7],map.setmap[map.level][id][8]]);
		//----------------------------------------------------------------------
		// xLighting 3
		const normalMatrix = glMatrix.mat4.create();
		glMatrix.mat4.invert(normalMatrix, modelViewMatrix);// Инвертированная матрица
		glMatrix.mat4.transpose(normalMatrix, normalMatrix);// Транспонирует матрицу, отражая ее значения по диагонали.
		//----------------------------------------------------------------------
		// загрузка в шейдеры новых данных
		gl.uniformMatrix4fv(shader.modelViewMatrix2, false, modelViewMatrix);// объект
		gl.uniformMatrix4fv(shader.normalMatrix2, false, normalMatrix);// xLighting 5 освещение
		//----------------------------------------------------------------------
		// Указываем текстуру для отображения
		gl.activeTexture(gl.TEXTURE0);// Сообщите WebGL, что сделать активным текстурный блок 0
		gl.bindTexture(gl.TEXTURE_2D, texture[map.setmap[map.level][id][9]]);// Привязать текстуру к текстурному блоку 0
		// Сообщите шейдеру, что мы привязали текстуру к текстурному блоку 0
		gl.uniform1i(shader.uSampler2, 0);
		//----------------------------------------------------------------------
		// gl.POINTS: рисует одну точку.
		// gl.LINE_STRIP: рисует прямую линию до следующей вершины.
		// gl.LINE_LOOP: рисует прямую линию до следующей вершины и соединяет последнюю вершину с первой.
		// gl.LINES: рисует линию между парой вершин.
		// gl.TRIANGLE_STRIPw
		// gl.TRIANGLE_FAN
		// gl.TRIANGLES: рисует треугольник для группы из трех вершин.
		//----------------------------------------------------------------------
		switch(map.setmap[map.level][id][10])
		{
		case 0:
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
			break;
		}
		//----------------------------------------------------------------------
	}
	//--------------------------------------------------------------------------
	drawScene2(gl, texture, id, buffers)// рисует сцену только цветом (каждый объект своим цветом "max=255" объектов)
	{
		gl.enable(gl.DEPTH_TEST);// Включает буфер глубины
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.enableVertexAttribArray(shader.vertexPosition2);
		gl.vertexAttribPointer(shader.vertexPosition2, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

		gl.uniformMatrix4fv(shader.projectionMatrix22, false, cameraMatrix);// камера
		//----------------------------------------------------------------------
		gl.useProgram(shader.shaderProgram2);// Включает шейдерную программу
		//----------------------------------------------------------------------
		// Подскажите WebGL, как извлечь цвета из цветового буфера в атрибут цвета вершины.
		// xColour 1
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
		//----------------------------------------------------------------------
		// установка объекта по координатам
		const modelViewMatrix3 = glMatrix.mat4.create();
		glMatrix.mat4.translate(modelViewMatrix3,modelViewMatrix3,[-map.setmap[map.level][id][0], -map.setmap[map.level][id][1], -map.setmap[map.level][id][2]]);

		glMatrix.mat4.rotate(modelViewMatrix3,modelViewMatrix3,map.setmap[map.level][id][3]*Math.PI/180,[1, 0, 0]);
		glMatrix.mat4.rotate(modelViewMatrix3,modelViewMatrix3,map.setmap[map.level][id][4]*Math.PI/180,[0, 1, 0]);
		glMatrix.mat4.rotate(modelViewMatrix3,modelViewMatrix3,map.setmap[map.level][id][5]*Math.PI/180,[0, 0, 1]);

		glMatrix.mat4.scale(modelViewMatrix3, modelViewMatrix3, [map.setmap[map.level][id][6],map.setmap[map.level][id][7],map.setmap[map.level][id][8]]);
		//----------------------------------------------------------------------
		//----------------------------------------------------------------------
		// загрузка в шейдеры новых данных
		gl.uniformMatrix4fv(shader.modelViewMatrix22, false, modelViewMatrix3);// объект
		//----------------------------------------------------------------------
		switch(map.setmap[map.level][id][10])
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
