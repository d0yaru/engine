//------------------------------------------------------------------------------
// Для начала получим контекст WebGL ///////////////////////////////////////////
//------------------------------------------------------------------------------
const gl = document.getElementById('glcanvas').getContext('webgl');
if(!gl) alert("Ваш браузер не поддерживает WebGL");
//------------------------------------------------------------------------------
//   T E S T   /////////////////////////////////////////////////////////////////
//------------------------------------------------------------------------------
let fps = new Fps();
//------------------------------------------------------------------------------
let objs = new Objs();
//------------------------------------------------------------------------------
let ltexture = new LoadTexture();
//------------------------------------------------------------------------------
let map = new Map();
let obj = map.test;
//------------------------------------------------------------------------------
// alert(`Привет, ${this.name}!`);
//------------------------------------------------------------------------------
let shader = new Shader();
//------------------------------------------------------------------------------
let pawn = new Player(0, 0, 0, 0, 0);
//------------------------------------------------------------------------------
let camera = new Camera();
let cameraMatrix = camera.getCamera();
//------------------------------------------------------------------------------
let scene = new Draw();
//------------------------------------------------------------------------------
let coll = new Collision2d();
//------------------------------------------------------------------------------
//   П Е Р Е М Е Н Н Ы Е   /////////////////////////////////////////////////////
//------------------------------------------------------------------------------
let objId = 0;// id выбранного обьекта
let objCount = 0;// количество загруженых объектов
let objMode = 0;// режим редактирования 0-позиция, 1-вращение, 2-размеры
let objModeText = "";
//------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------------------------
function main()
{
	//--------------------------------------------------------------------------
	// Общие настройки для всех режимов
	const buffers = objs.initBuffers(gl);// Загружаем буферы
	shader = shader.initShader();
	//--------------------------------------------------------------------------
	obj = map.setmap;
	pawn.x = map.pawnx;
	pawn.y = map.pawny;
	pawn.z = map.pawnz;
	//--------------------------------------------------------------------------
	let texture = [];
	// xTexture 3
	for (let i = 0; i <= map.countimg; i++) {
		texture[i] = ltexture.loadTexture(gl, map.imgpath + '/img/img' + i + map.typeimg);
	}
	//--------------------------------------------------------------------------
	// генерация карты /////////////////////////////////////////////////////////
	//--------------------------------------------------------------------------
// раскомментировать при режиме: img_generation
/*
	let pos00 = [0,37,74,111];
	let pos01 = [75, 79, 83,112,113,114,115,116,117,118,119,120,121,122,123];
	let pos02 = [87, 91, 95,124,125,126,127,128,129,130,131,132,133,134,135];
	let pos03 = [99,103,107,136,137,138,139,140,141,142,143,144,145,146,147];

	let pos10 = [ 1, 2, 3, 4,  5, 6, 7, 8,  9,10,11,12];
	let pos11 = [39,43,47,   78, 82, 86];
	let pos12 = [40,44,48,   90, 94, 98];
	let pos13 = [41,45,49,  102,106,110];

	let pos20 = [13,14,15,16, 17,18,19,20, 21,22,23,24];
	let pos21 = [51,55,59,   77, 81, 85];
	let pos22 = [52,56,60,   89, 93, 97];
	let pos23 = [53,57,61,  101,105,109];

	let pos30 = [25,26,27,28, 29,30,31,32, 33,34,35,36];
	let pos31 = [63,67,71,   76, 80, 84];
	let pos32 = [64,68,72,   88, 92, 96];
	let pos33 = [65,69,73,  100,104,108];
	//--------------------------------------------------------------------------
	let downObj0 = [ 0,37,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,116,120,124,128,132,136,140,144];
	let downObj1 = [ 1, 2, 3, 4,  13,14,15,16,  25,26,27,28,  38,39,40,41,  50,51,52,53,  62,63,64,65,  115,119,123,127,131,135,139,143,147];
	let downObj2 = [ 5, 6, 7, 8,  17,18,19,20,  29,30,31,32,  42,43,44,45,  54,55,56,57,  66,67,68,69,  114,118,122,126,130,134,138,142,146];
	let downObj3 = [ 9,10,11,12,  21,22,23,24,  33,34,35,36,  46,47,48,49,  58,59,60,61,  70,71,72,73,  113,117,121,125,129,133,137,141,145];

	let leftObj0 = [ 0,1,5,9,13,17,21,25,29,33,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,111];
	let leftObj1 = [2,6,10,14,18,22,26,30,34,  75,76,77,78, 87,88,89,90,  99,100,101,102, 112,113,114,115, 124,125,126,127, 136,137,138,139];
	let leftObj2 = [3,7,11,15,19,23,27,31,35,  79,80,81,82, 91,92,93,94, 103,104,105,106, 116,117,118,119, 128,129,130,131, 140,141,142,143];
	let leftObj3 = [4,8,12,16,20,24,28,32,36,  83,84,85,86, 95,96,97,98, 107,108,109,110, 120,121,122,123, 132,133,134,135, 144,145,146,147];
	//--------------------------------------------------------------------------
	for (let gx = 10; gx < 100; gx+=10) {
		for (let gy = 1; gy < 10; gy++) {
			//------------------------------------------------------------------
			obj[(gx+gy)][9] = 72;
			let chekDown = chekObjDown(obj[(gx+gy)-1][9]);
			let chekLeft = chekObjLeft(obj[(gx+gy)-10][9]);

			console.log(`Проверка >> Down:${chekDown}, Left:${chekLeft}`);

			if(chekDown == 0 && chekLeft == 0) addObj(gx,gy,pos00,pos00.length);
			if(chekDown == 0 && chekLeft == 1) addObj(gx,gy,pos01,pos01.length);
			if(chekDown == 0 && chekLeft == 2) addObj(gx,gy,pos02,pos02.length);
			if(chekDown == 0 && chekLeft == 3) addObj(gx,gy,pos03,pos03.length);

			if(chekDown == 1 && chekLeft == 0) addObj(gx,gy,pos10,pos10.length);
			if(chekDown == 1 && chekLeft == 1) addObj(gx,gy,pos11,pos11.length);
			if(chekDown == 1 && chekLeft == 2) addObj(gx,gy,pos12,pos12.length);
			if(chekDown == 1 && chekLeft == 3) addObj(gx,gy,pos13,pos13.length);

			if(chekDown == 2 && chekLeft == 0) addObj(gx,gy,pos20,pos20.length);
			if(chekDown == 2 && chekLeft == 1) addObj(gx,gy,pos21,pos21.length);
			if(chekDown == 2 && chekLeft == 2) addObj(gx,gy,pos22,pos22.length);
			if(chekDown == 2 && chekLeft == 3) addObj(gx,gy,pos23,pos23.length);

			if(chekDown == 3 && chekLeft == 0) addObj(gx,gy,pos30,pos30.length);
			if(chekDown == 3 && chekLeft == 1) addObj(gx,gy,pos31,pos31.length);
			if(chekDown == 3 && chekLeft == 2) addObj(gx,gy,pos32,pos32.length);
			if(chekDown == 3 && chekLeft == 3) addObj(gx,gy,pos33,pos33.length);
			console.log('----------------------');
		}
		console.log('========================');
	}
	//--------------------------------------------------------------------------
	function addObj(gx,gy,_pos,_length) {
		let randbuf = getRandomInt(_length);
		obj[gx+gy][9] = _pos[randbuf];
		console.log(`Поставил = ${_pos[randbuf]}`);
	}

	function chekObjDown(id) {
		console.log(`chekObjDown = ${id}`);
		if(downObj0.indexOf(id) != -1) return 0;
		else if(downObj1.indexOf(id) != -1) return 1;
		else if(downObj2.indexOf(id) != -1) return 2;
		else if(downObj3.indexOf(id) != -1) return 3;
	}

	function chekObjLeft(id) {
		console.log(`chekObjLeft = ${id}`);
		if(leftObj0.indexOf(id) != -1) return 0;
		else if(leftObj1.indexOf(id) != -1) return 1;
		else if(leftObj2.indexOf(id) != -1) return 2;
		else if(leftObj3.indexOf(id) != -1) return 3;
	}
	//--------------------------------------------------------------------------
	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}
	//--------------------------------------------------------------------------
*/
	//--------------------------------------------------------------------------
	////////////////////////////////////////////////////////////////////////////
	//--------------------------------------------------------------------------
	scene.initDraw(gl, buffers)
	//--------------------------------------------------------------------------
	function render()
	{
		requestAnimationFrame(render);// обновление если браузер не занят
		//----------------------------------------------------------------------
		document.getElementById("fps").innerHTML = "FPS: " + fps.getFps();
		//----------------------------------------------------------------------
		updateGame();
		//----------------------------------------------------------------------
		camera.setCamera(cameraMatrix, pawn.x, pawn.y, pawn.z, pawn.rx, pawn.ry);
		scene.updateCam(cameraMatrix);
		//----------------------------------------------------------------------
		scene.clearScene(gl,map.sr,map.sg,map.sb);
		addScene(gl, texture);
		//----------------------------------------------------------------------
		document.getElementById("objData").innerHTML = 
		" objId: " + objId +
		" X:"+obj[objId][0].toFixed(2)+" Y:"+obj[objId][1].toFixed(2)+" Z:"+obj[objId][2].toFixed(2)+
		" rX:"+obj[objId][3].toFixed(2)+" rY:"+obj[objId][4].toFixed(2)+" rZ:"+obj[objId][5].toFixed(2)+
		" sX:"+obj[objId][6].toFixed(2)+" sY:"+obj[objId][7].toFixed(2)+" sZ:"+obj[objId][8].toFixed(2)+
		" objCount: " + objCount + " objMode: " + objMode + objModeText;
		//----------------------------------------------------------------------
	}
	//--------------------------------------------------------------------------
	render();
}

setTimeout(() => {  main(); }, 500);
//------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------------------------
function addScene(gl, texture)
{
	for (let id = 0; id < obj.length; id++) {// рисует все объекты на карте
		scene.drawScene(gl, texture, obj, id);
		objCount++;
	}
	objCount = 0;
}
//------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------------------------

// ---------------------------------------------------------------
//   М Ы Ш Ь   ///////////////////////////////////////////////////
// ---------------------------------------------------------------
// Обработчик проверки изменения состояния захвата курсора
let canlock = true;
let lock = false;
// ---------------------------------------------------------------
document.addEventListener("pointerlockchange", (event)=> {
	lock = !lock;
});
// Обработчик захвата курсора мыши
container.onclick = function() {
	if (!lock && canlock) container.requestPointerLock();
};
//----------------------------------------------------------------
// Обработчик движения мыши
let MouseX = 0;
let MouseY = 0;
//----------------------------------------------------------------
document.addEventListener("mousemove", (event)=> {
	MouseX = event.movementX;
	MouseY = event.movementY;
});
//----------------------------------------------------------------
//////////////////////////////////////////////////////////////////
//----------------------------------------------------------------

// ---------------------------------------------------------------
//   К Л А В И А Т У Р А   ///////////////////////////////////////
// ---------------------------------------------------------------
let PressBack = 0;
let PressForward = 0;
let PressLeft = 0;
let PressRight = 0;
let PressUp = 0;

let addSpeed = 0;
let Jump = 5;
// ---------------------------------------------------------------
document.addEventListener("keydown", (event) => {
	if (event.keyCode == 68) PressLeft = map.Speed+addSpeed;// W
	if (event.keyCode == 83) PressForward = map.Speed+addSpeed;// D
	if (event.keyCode == 65) PressRight = map.Speed+addSpeed;// S
	if (event.keyCode == 87) PressBack = map.Speed+addSpeed;// A
	if (event.keyCode == 32) PressUp = Jump;// Space
	if (event.keyCode == 16) addSpeed = 4;// Shift
	// if (event.keyCode == 17) // Ctrl
	// console.log(event.keyCode);
});
// ---------------------------------------------------------------
document.addEventListener("keyup", (event) => {
	if (event.keyCode == 68) PressLeft = 0;
	if (event.keyCode == 83) PressForward = 0;
	if (event.keyCode == 65) PressRight = 0;
	if (event.keyCode == 87) PressBack = 0;
	if (event.keyCode == 32) PressUp = 0;
	if (event.keyCode == 16) addSpeed = 0;
});
// ---------------------------------------------------------------
//////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------

// ---------------------------------------------------------------
//   О Б Н О В Л Е Н И Е   К А Д Р А   ///////////////////////////
// ---------------------------------------------------------------
const deg = 3.141592/180;
let onGround = false;

let dx = dy = dz = 0;
// ---------------------------------------------------------------
function updateGame()
{
	//------------------------------------------------------------
	// Задаем локальные переменные смещения
	dx = ((PressRight - PressLeft)*Math.cos(pawn.ry*deg) - (PressForward - PressBack)*Math.sin(pawn.ry*deg))*pawn.vx;
	dz = ( -(PressForward - PressBack)*Math.cos(pawn.ry*deg) - (PressRight - PressLeft)*Math.sin(pawn.ry*deg))*pawn.vz;
	dy = dy + map.grav;
	if (onGround)
	{
		dy = 0;
		if (PressUp)
		{
			dy = - PressUp*pawn.vy;
			onGround = false;
		}
	};
	//------------------------------------------------------------
	if(map.collis) coll.collision2d();// Проверяем коллизию с прямоугольниками
	//------------------------------------------------------------
	// Прибавляем смещения к координатам
	pawn.x = pawn.x + dx;
	pawn.y = pawn.y + dy;
	pawn.z = pawn.z + dz;
	//------------------------------------------------------------
	drx = MouseY/6;
	dry = -MouseX/6;
	
	MouseX = MouseY = 0;
	
	if (lock)// Если курсор захвачен, разрешаем вращение
	{
		pawn.rx = pawn.rx + drx;
		pawn.ry = pawn.ry + dry;
	};
	//--------------------------------------------------------------------------
	// интерфейс
	document.getElementById("pawn").innerHTML =
	"pawnX: " + pawn.x.toFixed(3) +
	" pawnY: " + pawn.y.toFixed(3) +
	" pawnZ: " + pawn.z.toFixed(3) +
	" pawnRX: " + pawn.rx.toFixed(1) +
	" pawnRY: " + pawn.ry.toFixed(1);
	//--------------------------------------------------------------------------
	// Если упал в пропость - спавн
	if(pawn.y > 3000)
	{
		pawn.x = 0;
		pawn.y = -100;
		pawn.z = 0;
	}
}
//------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------------------------

//---------------------------------------------------------------------
//   К Л А В И А Т У Р А   ////////////////////////////////////////////
//---------------------------------------------------------------------
document.addEventListener("keydown", (event) => {
	//-----------------------------------------------------------------
	if (event.keyCode == 39) obj[objId][0+objMode*3] += 1.1;// ->
	if (event.keyCode == 37) obj[objId][0+objMode*3] -= 1.1;// <-
	if (event.keyCode == 38) obj[objId][2+objMode*3] -= 1.1;// ^
	if (event.keyCode == 40) obj[objId][2+objMode*3] += 1.1;// v
	if (event.keyCode == 34) obj[objId][1+objMode*3] -= 1.1;// pageDown
	if (event.keyCode == 33) obj[objId][1+objMode*3] += 1.1;// PageUp
	//-----------------------------------------------------------------
	if (event.keyCode == 48) objId = 0;// 0
	if (event.keyCode == 49) objId = 1;// 1
	if (event.keyCode == 50) objId = 2;// 2
	if (event.keyCode == 51) objId = 3;// 3
	if (event.keyCode == 52) objId = 4;// 4
	if (event.keyCode == 53) objId = 5;// 5
	if (event.keyCode == 54) objId = 6;// 6
	if (event.keyCode == 55) objId = 7;// 7
	if (event.keyCode == 56) objId = 8;// 8
	if (event.keyCode == 57) objId = 9;// 9
	//----------------------------------------------------------------- 
	if (event.keyCode == 107)// num +
	{
		objMode++;
		if(objMode > 2) objMode = 0;
		updateObjMode();
	}
	if (event.keyCode == 109)// num -
	{
		objMode--;
		if(objMode < 0) objMode = 2;
		updateObjMode();
	}
	//-----------------------------------------------------------------   
	// console.log(event.keyCode);
});
//---------------------------------------------------------------------
///////////////////////////////////////////////////////////////////////
//---------------------------------------------------------------------
function updateObjMode()
{
	switch(objMode)
	{
	case 0:
		objModeText = " [ Pos ]";
		break;
	case 1:
		objModeText = " [ Rotate ]";
		break;
	case 2:
		objModeText = " [ Scale ]";
	}
	// document.getElementById("objMode").innerHTML = ;
}
//---------------------------------------------------------------------