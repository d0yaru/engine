//------------------------------------------------------------------------------
class Fps
{
	//------------------------------------------------------------------------------
	startTime = Date.now()
	frameCount = 0;
	fps = 0;
	//------------------------------------------------------------------------------
	constructor(){}

	getFps()
	{
		if(Date.now() - this.startTime < 1000) this.frameCount++;
		else
		{
			this.startTime = Date.now();
			this.fps = this.frameCount;
			this.frameCount = 0;
			// document.getElementById("fps").innerHTML = "FPS: " + fps;
		}
		return this.fps;
	}
//------------------------------------------------------------------------------
}
//------------------------------------------------------------------------------
