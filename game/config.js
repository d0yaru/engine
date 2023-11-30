//------------------------------------------------------------------------------
// includes
document.write('\
	<script src="/data/engine/core/cShader.js"></script>\
	<script src="/data/engine/core/cCamera.js"></script>\
	<script src="/data/engine/core/cPlayer.js"></script>\
	<script src="/data/engine/core/cDraw.js"></script>\
	<script src="/data/engine/core/cLoadtexture.js"></script>\
	<script src="/data/engine/core/cObjs.js"></script>\
	<script src="/data/engine/core/cFps.js"></script>\
	<script src="/data/engine/physics/cCollision2d.js"></script>\
	<script src="/data/engine/main.js" defer></script>\
');
//------------------------------------------------------------------------------
// Интерфейс
document.write('\
	<div id="fps">0</div>\
	<div id="objData">0</div>\
	<div id="cam">0</div>\
	<div id="pawn">0</div>\
');
//------------------------------------------------------------------------------
class Map
{
	//--------------------------------------------------------------------------
	// Цвет неба
	sr = 0.3;
	sg = 0.55;
	sb = 0.67;
	//--------------------------------------------------------------------------
	// Спавн игрока X, Y, Z
	pawnx = 0;
	pawny = -100;
	pawnz = 0;
	// Куда смотрит игрок rX, rY
	pawnrx = 0;
	pawnry = 0;
	//--
	Speed = 4;// Скорость игрока
	grav = 1.5;// Гравитация игрока
	collis = true;// Проверка коллизии игрока
	//--------------------------------------------------------------------------
	// Карта
	imgpath = "game";// Папка с изображениями
	typeimg = ".jpg";// Формат изображений
	countimg = 10;// Количество изображений
	//--------------------------------------------------------------------------
	setmap = [
	//  [x,y,z,rx,ry,rz,sx,sy,sz,idImg,objType]
		[0,90,1000,   0,180,0,   2000,200,35,   0,0],// 0
		[0,90,-1000,   0,0,0,   2000,200,35,   1,0],// 1
		[1000,90,0,   0,-90,0,   2000,200,35,   2,0],// 2
		[-1000,90,0,   0,90,0,   2000,200,35,   3,0],// 3

		[0,0,0,   90,0,0,   2000,2000,35,   9,0],// 4
		
		[-50,0,0,   90,30,0,   2000,1000,35,   6,0],// 5
		[0,0,-50,   60,0,30,   2000,1000,35,   10,0],// 6

		[2000,0,0,90,0,0,2000,2000,35,6,0],
		[-2000,0,0,90,0,0,2000,2000,35,6,0],
		[0,0,2000,90,0,0,2000,2000,35,6,0],
		[0,0,-2000,90,0,0,2000,2000,35,6,0],
		
		[2000,0,2000,90,0,0,2000,2000,35,6,0],
		[-2000,0,2000,90,0,0,2000,2000,35,6,0],
		[-2000,0,-2000,90,0,0,2000,2000,35,6,0],
		[2000,0,-2000,90,0,0,2000,2000,35,6,0],

		[1500,70,1500,0,0,0,100,200,100,3,0],
		[-1200,70,-1500,0,0,0,100,200,100,4,0],
		[-1400,70,1500,0,0,0,100,200,100,5,0],
		[1300,70,-1500,0,0,0,10,10,10,8,0],
	];
	//--------------------------------------------------------------------------
	constructor() {}
}
//------------------------------------------------------------------------------
