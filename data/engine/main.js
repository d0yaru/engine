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
let pawn = new Player(0, 0, 0, 0, 0);// Игрок
let enemy = new Player(-200, 50, 500, 0, 0);// Враг
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
	loadMap(map.level);
	//--------------------------------------------------------------------------
	let texture = [];
	// xTexture 3
	for (let i = 0; i <= map.countimg; i++) {
		texture[i] = ltexture.loadTexture(gl, map.imgpath + '/img/img' + i + map.typeimg);
	}
	//--------------------------------------------------------------------------
	// scene.initDraw(gl, buffers)
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
		// scene.updateCam(cameraMatrix);
		//----------------------------------------------------------------------
		scene.clearScene(gl,map.sr,map.sg,map.sb);
		addScene(gl, texture, buffers);
		if (gColor) objId = scene.getColor();
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
function addScene(gl, texture, buffers)
{
	for (let id = 0; id < obj.length; id++) {// рисует все объекты на карте
		if (obj[id][12])
		{
			if (obj[id][11]) obj[id][4] = pawn.ry;
			if (!gColor) scene.drawScene(gl, texture, obj, id, buffers);
			else scene.drawScene2(gl, texture, obj, id, buffers);
			objCount++;
		}
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

document.addEventListener("mousedown", (event)=> {
	if (event.which == 1) gColor = 1;
});
//----------------------------------------------------------------
document.addEventListener("mouseup", (event)=> {
	if (event.which == 1) gColor = 0;
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

let gColor = 0;

let addSpeed = 0;
let creative = false;
let ghost = false;
// ---------------------------------------------------------------
document.addEventListener("keydown", (event) => {
	if (event.keyCode == 65) PressLeft = map.speed + addSpeed;// A 65
	if (event.keyCode == 87) PressForward = map.speed + addSpeed;// W 87
	if (event.keyCode == 68) PressRight = map.speed + addSpeed;// D 68
	if (event.keyCode == 83) PressBack = map.speed + addSpeed;// S 83
	if (event.keyCode == 32) PressUp = map.jump + addSpeed;// Space

	if (event.keyCode == 16)// Shift
	{
		if (!creative) addSpeed = map.boost;
		else PressUp = -map.jump;
	}

	// if (event.keyCode == 17) gColor = 1;// Ctrl
	if (event.keyCode == 67) creative = !creative;// [C]
	if (event.keyCode == 71) ghost = !ghost;// [G]
	// console.log(event.keyCode);
});
// ---------------------------------------------------------------
document.addEventListener("keyup", (event) => {
	if (event.keyCode == 65) PressLeft = 0;
	if (event.keyCode == 87) PressForward = 0;
	if (event.keyCode == 68) PressRight = 0;
	if (event.keyCode == 83) PressBack = 0;
	if (event.keyCode == 32) PressUp = 0;
	if (event.keyCode == 16) addSpeed = 0;
	// if (event.keyCode == 17) gColor = 0;
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
let edx = edy = edz = 0;// враг
// ---------------------------------------------------------------
function updateGame()
{
	//--------------------------------------------------------------------------
	// Задаем локальные переменные смещения
	dx = ((PressRight - PressLeft)*Math.cos(pawn.ry*deg) - (PressBack - PressForward)*Math.sin(pawn.ry*deg))*pawn.vx;
	dz = (-(PressBack - PressForward)*Math.cos(pawn.ry*deg) - (PressRight - PressLeft)*Math.sin(pawn.ry*deg))*pawn.vz;
	//--------------------------------------------------------------------------
	// enemy.rx = obj[0][3];
	enemy.ry = obj[0][4]+180;

	edx = ((0 - 0)*Math.cos(enemy.ry*deg) - (0 - 1)*Math.sin(enemy.ry*deg))*enemy.vx;
	edz = (-(0 - 1)*Math.cos(enemy.ry*deg) - (0 - 0)*Math.sin(enemy.ry*deg))*enemy.vz;
	
	enemy.x = enemy.x + edx;
	// enemy.y = enemy.y + edy;
	enemy.z = enemy.z + edz;

	document.getElementById("debug").innerHTML = " X:["+enemy.x.toFixed(2)+"] z:["+enemy.z.toFixed(2)+"]";
	// чтобы не убегал далеко
	if (enemy.x < -1500) enemy.x = -1500;
	if (enemy.x > 1500) enemy.x = 1500;
	if (enemy.z < -1500) enemy.z = -1500;
	if (enemy.z > 1500) enemy.z = 1500;

	obj[0][0] = enemy.x;
	obj[0][2] = enemy.z;
	//--------------------------------------------------------------------------
	if (!creative)
	{
		dy = dy - map.grav;
		if (onGround)
		{
			dy = 0;
			if (PressUp)
			{
				dy += PressUp*pawn.vy;
				onGround = false;
			}
		}
	}
	else
	{
		pawn.y += PressUp;
		dy = 0;
	}
	//------------------------------------------------------------
	if(!ghost) coll.collision2d();// Проверяем коллизию с прямоугольниками
	//--------------------------------------------------------------------------
	// Прибавляем смещения к координатам
	pawn.x = pawn.x + dx;
	pawn.y = pawn.y + dy;
	pawn.z = pawn.z + dz;
	//--------------------------------------------------------------------------
	drx = MouseY/6;
	dry = -MouseX/6;
	
	MouseX = MouseY = 0;
	
	if (lock)// Если курсор захвачен, разрешаем вращение
	{
		pawn.rx = pawn.rx - drx;
		pawn.ry = pawn.ry - dry;
		if (pawn.rx > 80) pawn.rx = 80;
		if (pawn.rx < -80) pawn.rx = -80;

		if (pawn.ry > 359.9) pawn.ry = 0;
		if (pawn.ry < 0) pawn.ry = 359.9;
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
	if(pawn.y < -3000)
	{
		playerSpawn();
	}
}
//------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------------------------
function playerSpawn()
{
	pawn.x = map.spawnx;
	pawn.y = map.spawny;
	pawn.z = map.spawnz;
	pawn.rx = map.spawnrx;
	pawn.ry = map.spawnrx;
}

function loadMap(world)
{
	obj = map.setmap[world];
	playerSpawn();
}
//---------------------------------------------------------------------
//   К Л А В И А Т У Р А   ////////////////////////////////////////////
//---------------------------------------------------------------------
document.addEventListener("keydown", (event) => {
	//-----------------------------------------------------------------
	if (event.keyCode == 39) obj[objId][0+objMode*3] += 1.1;// ->
	if (event.keyCode == 37) obj[objId][0+objMode*3] -= 1.1;// <-
	if (event.keyCode == 38) obj[objId][2+objMode*3] += 1.1;// ^
	if (event.keyCode == 40) obj[objId][2+objMode*3] -= 1.1;// v
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