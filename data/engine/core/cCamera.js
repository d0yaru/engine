//------------------------------------------------------------------------------
class Camera
{
	constructor() {}

	getCamera()
	{
		let projectionMatrix = glMatrix.mat4.create();
		glMatrix.mat4.perspective(projectionMatrix,
			45*Math.PI/180,
			gl.canvas.clientWidth/gl.canvas.clientHeight,
			0.1, 10000.0);

		return projectionMatrix;
	}

	setCamera(projectionMatrix,_x,_y,_z,_rx,_ry)
	{
		glMatrix.mat4.perspective(projectionMatrix,
			45*Math.PI/180,
			gl.canvas.clientWidth/gl.canvas.clientHeight,
			0.1, 10000.0);

		glMatrix.mat4.rotate(projectionMatrix,projectionMatrix,(-_rx+180)*Math.PI/180,[1, 0, 0]);
		glMatrix.mat4.rotate(projectionMatrix,projectionMatrix,(-_ry+180)*Math.PI/180,[0, 1, 0]);

		glMatrix.mat4.translate(projectionMatrix,projectionMatrix,[_x,_y,_z]);
		//----------------------------------------------------------------------
		// интерфейс
		document.getElementById("cam").innerHTML =
		"camX: " + _x.toFixed(3) +
		" camY: " + _y.toFixed(3) +
		" camZ: " + _z.toFixed(3) +
		" camRX: " + _rx.toFixed(1) +
		" camRY: " + _ry.toFixed(1);
		//----------------------------------------------------------------------
	}
}
//------------------------------------------------------------------------------
//----------------------------------------------------------------------
	// function setupWebGL()
	// {
	//     gl.clearColor(0.0, 0.0, 0.0, 1.0);  
	//     gl.clear(gl.COLOR_BUFFER_BIT);  
					
	//     gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	//     mat4.perspective(pMatrix, Math.PI/2, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
	//     mat4.identity(mvMatrix);
	//     mat4.lookAt(mvMatrix, [2, 0,-2], [0,0,0], [0,1,0]); 
	// }
	//--------------------------------------------------------------------------
	