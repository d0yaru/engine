//------------------------------------------------------------------------------
// Для начала получим контекст WebGL ///////////////////////////////////////////
//------------------------------------------------------------------------------
const canvas = document.getElementById("canvas");
// console.log( canvas.width, canvas.height );
const gl = canvas.getContext('webgl');
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
let chud = new cHud();
//------------------------------------------------------------------------------
let coll = new Collision2d();
//------------------------------------------------------------------------------
//   П Е Р Е М Е Н Н Ы Е   /////////////////////////////////////////////////////
//------------------------------------------------------------------------------
let objCount = 0;// количество загруженых объектов
let objMode = 0;// режим редактирования 0-позиция, 1-вращение, 2-размеры
let objModeText = "";
//------------------------------------------------------------------------------
let shotOpen = false;
let shotLook = false;
//------------------------------------------------------------------------------
let openmap = false;
//------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------------------------
// ---------------------------------------------------------------
// Загрузка звуков
// steps_snowSound.play();
// let shotSound = new Audio;
// shotSound.src = "game/sounds/shot.mp3";// выстрел

let shot2_left_Sound = new Audio;
shot2_left_Sound.src = "game/sounds/shot2.mp3";// выстрел
let shot2_right_Sound = new Audio;
shot2_right_Sound.src = "game/sounds/shot2.mp3";// выстрел

let deathSound = new Audio;
deathSound.src = "game/sounds/death.mp3";// гибель
// let death1Sound = new Audio;
// death1Sound.src = "game/sounds/death1.mp3";// гибель 1
let death2Sound = new Audio;
death2Sound.src = "game/sounds/death2.mp3";// гибель 2
// let death3Sound = new Audio;
// death3Sound.src = "game/sounds/death3.mp3";// гибель 3

// let hitSound = new Audio;
// hitSound.src = "game/sounds/hit.mp3";// попал по врагу

let respawnSound = new Audio;
respawnSound.src = "game/sounds/respawn.mp3";// спавн игрока

let bringSound = new Audio;
bringSound.src = "game/sounds/bring.mp3";// собрал

let woundedSound = new Audio;
woundedSound.src = "game/sounds/wounded.mp3";// ранил

let nokeySound = new Audio;
nokeySound.src = "game/sounds/nokey.mp3";// нет ключа

let stepsSound = new Audio;
stepsSound.src = "game/sounds/steps.mp3";// шаги по деревянному полу

let steps_snowSound = new Audio;
steps_snowSound.src = "game/sounds/steps_snow.mp3";// шаги по деревянному снегу

// let steps_wadeSound = new Audio;
// steps_wadeSound.src = "game/sounds/steps_wade.mp3";// шаги по деревянному воде

let picked_kitSound = new Audio;
picked_kitSound.src = "game/sounds/picked_kit.mp3";// подобрал аптечку

let picked_keySound = new Audio;
picked_keySound.src = "game/sounds/picked_key.mp3";// подобрал ключ

let golevelSound = new Audio;
golevelSound.src = "game/sounds/golevel.mp3";// переход на следующий уровень
// ---------------------------------------------------------------
function main()
{
	//--------------------------------------------------------------------------
	// Общие настройки для всех режимов
	const buffers = objs.initBuffers(gl);// Загружаем буферы
	shader = shader.initShader();
	//--------------------------------------------------------------------------
	playerSpawn();
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
		//----------------------------------------------------------------------
		// document.getElementById("objData").innerHTML = 
		// " objId: " + map.objId +
		// " X:"+map.setmap[map.level][map.objId][0].toFixed(2)+" Y:"+map.setmap[map.level][map.objId][1].toFixed(2)+" Z:"+map.setmap[map.level][map.objId][2].toFixed(2)+
		// " rX:"+map.setmap[map.level][map.objId][3].toFixed(2)+" rY:"+map.setmap[map.level][map.objId][4].toFixed(2)+" rZ:"+map.setmap[map.level][map.objId][5].toFixed(2)+
		// " sX:"+map.setmap[map.level][map.objId][6].toFixed(2)+" sY:"+map.setmap[map.level][map.objId][7].toFixed(2)+" sZ:"+map.setmap[map.level][map.objId][8].toFixed(2)+
		// " objCount: " + objCount + " objMode: " + objMode + objModeText;
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
	for (let id = 0; id < map.setmap[map.level].length; id++)// рисует все объекты на карте
	{// рисует все объекты на карте
		if (map.setmap[map.level][id][12])
		{
			if (map.setmap[map.level][id][11]) map.setmap[map.level][id][4] = pawn.ry;

			if (gColor && !shotLook) scene.drawScene2(gl, texture, id, buffers);
			else scene.drawScene(gl, texture, id, buffers);

			// scene.drawScene2(gl, texture, id, buffers);

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
	if (event.which == 1 && map.weapon)
	{
		if (shotRL) {shot2_left_Sound.play(); shot2_left(); shotRL =! shotRL;}
		else {shot2_right_Sound.play(); shot2_right(); shotRL =! shotRL;}
		gColor = 1;
		// shot2Sound.play();
		map.weapon--;
		chud.setweapon(map.weapon);
		// setTimeout(() => {  mLeftLock(); }, 600);
	}
});
//----------------------------------------------------------------
document.addEventListener("mouseup", (event)=> {
	if (event.which == 1) {gColor = 0;shotLook = false;}
});
//----------------------------------------------------------------
//////////////////////////////////////////////////////////////////
//----------------------------------------------------------------
let shotRL = false;
const two_pistols_left = document.getElementById("two_pistols_left");
const two_pistols_right = document.getElementById("two_pistols_right");

function shot2_left()
{
	shot3_2_left();
	if(two_pistols_left.classList != "shot2_left")
	{
		two_pistols_left.classList.add("shot2_left");
	}
	setTimeout(function()
	{
		two_pistols_left.classList.remove("shot2_left");
	}, 500);
}

function shot2_right()
{
	shot3_2_left();
	if(two_pistols_right.classList != "shot2_right")
	{
		two_pistols_right.classList.add("shot2_right");
	}
	setTimeout(function()
	{
		two_pistols_right.classList.remove("shot2_right");
	}, 500);
}

function shot3_left()
{
	if(two_pistols_left.classList != "shot3_left")
	{
		two_pistols_left.classList.add("shot3_left");
	}

	if(two_pistols_right.classList != "shot3_right")
	{
		two_pistols_right.classList.add("shot3_right");
	}
}

function shot3_2_left()
{
	if(two_pistols_left.classList == "shot3_left")
	{
		two_pistols_left.classList.remove("shot3_left");
	}

	if(two_pistols_right.classList == "shot3_right")
	{
		two_pistols_right.classList.remove("shot3_right");
	}
}
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
	if (event.keyCode == 65) {stepsSound.play(); PressLeft = map.speed + addSpeed;}// A 65
	if (event.keyCode == 87) {stepsSound.play(); PressForward = map.speed + addSpeed;}// W 87
	if (event.keyCode == 68) {stepsSound.play(); PressRight = map.speed + addSpeed;}// D 68
	if (event.keyCode == 83) {stepsSound.play(); PressBack = map.speed + addSpeed;}// S 83
	if (event.keyCode == 32) {steps_snowSound.play(); PressUp = map.jump + addSpeed;}// Space

	if (event.keyCode == 16)// Shift
	{
		if (!creative) addSpeed = map.boost;
		else PressUp = -map.jump;
	}

	// if (event.keyCode == 17) gColor = 1;// Ctrl
	if (event.keyCode == 67)// [C]
	{
		creative = !creative;
		if (creative) chud.sethudavatar("/game/hud/creative.jpg");
		else chud.sethudavatar(map.avatar);
	}
	if (event.keyCode == 71)// [G]
	{
		ghost = !ghost;
		if (ghost) chud.sethudavatar("/game/hud/ghost.jpg");
		else chud.sethudavatar(map.avatar);
	}
	//--------------------------------------------------------------------------
	if (event.keyCode == 82)// [R]
	{
		if (map.weaponall >= 14)
		{
			map.weaponall -= 14-map.weapon;
			chud.setweaponall(map.weaponall);
			chud.setweapon(map.weapon = 14);
		}
		else
		{
			if (map.weapon+map.weaponall > 14)
			{
				weaponall -= 14-map.weapon+map.weaponall
				chud.setweaponall(map.weaponall=map.weaponall+map.weapon-14);
				chud.setweapon(map.weapon=14);
			}
			else
			{
				map.weapon = map.weapon+map.weaponall;
				chud.setweaponall(map.weaponall=0);
				chud.setweapon(map.weapon);
			}
		}
	}
	//--------------------------------------------------------------------------
	if (event.keyCode == 77)// [M]
	{
		openmap = !openmap;
		if (openmap) document.getElementById("big-map").style.display = "block";
		else document.getElementById("big-map").style.display = "none";
	}

	shot3_left();
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

	// shot3_2_left();
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
// -----------------------------------------------------------------------------
function distance(x1, z1, x2, z2)
{
	return Math.sqrt(((x2-x1)**2)+((z2-z1)**2));
}
// -----------------------------------------------------------------------------
function updateGame()
{
	//--------------------------------------------------------------------------
	// Задаем локальные переменные смещения
	dx = ((PressRight - PressLeft)*Math.cos(pawn.ry*deg) - (PressBack - PressForward)*Math.sin(pawn.ry*deg))*pawn.vx;
	dz = (-(PressBack - PressForward)*Math.cos(pawn.ry*deg) - (PressRight - PressLeft)*Math.sin(pawn.ry*deg))*pawn.vz;
	//--------------------------------------------------------------------------
	// движение врагов
	for (let id = 0; id < map.setmap[map.level].length; id++)
	{
		if (map.setmap[map.level][id][11] == 10)
		{
			//------------------------------------------------------------------
			// растояние между двумя точками
			// let test = 6**2;//число в квадрате
			// let test = Math.sqrt(36);// квадратный корень
			let dist = distance(map.setmap[map.level][id][0], map.setmap[map.level][id][2], pawn.x, pawn.z);
			// console.log(dist);
			//------------------------------------------------------------------
			if (dist < 700)
			{
				//------------------------------------------------------------------
				// направление движения
				map.setmap[map.level][id][4] = map.setmap[map.level][id][4]+180;
				//------------------------------------------------------------------
				edx = ((0 - 0)*Math.cos(map.setmap[map.level][id][4]*deg) - (0 - 1)*Math.sin(map.setmap[map.level][id][4]*deg))*20;//enemy.vx;
				edz = (-(0 - 1)*Math.cos(map.setmap[map.level][id][4]*deg) - (0 - 0)*Math.sin(map.setmap[map.level][id][4]*deg))*20;//enemy.vz;
				
				map.setmap[map.level][id][0] = map.setmap[map.level][id][0] + edx;
				// enemy.y = enemy.y + edy;
				map.setmap[map.level][id][2] = map.setmap[map.level][id][2] + edz;
			}
			//------------------------------------------------------------------
			// чтобы не убегал далеко
			if (map.setmap[map.level][id][0] < -1500) map.setmap[map.level][id][0] = -1500;
			if (map.setmap[map.level][id][0] > 1500) map.setmap[map.level][id][0] = 1500;
			if (map.setmap[map.level][id][2] < -1500) map.setmap[map.level][id][2] = -1500;
			if (map.setmap[map.level][id][2] > 1500) map.setmap[map.level][id][2] = 1500;
			//------------------------------------------------------------------
			// document.getElementById("debug").innerHTML = " X:["+enemy.x.toFixed(2)+"] z:["+enemy.z.toFixed(2)+"]";
			//------------------------------------------------------------------
		}
	}
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
	chud.setmapcor(pawn.x, pawn.z);
	if (openmap) chud.setbigmappickup(pawn.x, pawn.z);
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
	//--------------------------------------------------------------------------
	// chud.sethp(map.health = 100);
	// chud.setarmor(map.armor = 56);
	// chud.sethudavatar("/game/hud/weapon.png");

	chud.setenemy(map.setmap[map.level][0][12]);
	// chud.setenemyavatar("/game/hud/weapon.png");
	// chud.setenemyname("По русски");

	// chud.setkey(1);
	// chud.setlevel(map.level = 33);
	// chud.setcrystal(map.crystal = 42);

	// chud.setlives(map.lives = 4);
	// chud.setlivesimg("/game/img/img13.jpg");
	// chud.setmapcor(-500, -500);
	//--------------------------------------------------------------------------
	chud.sethudavatar(map.avatar);
	//--------------------------------------------------------------------------
	// respawnSound.play();
	pawn.x = map.spawnx;
	pawn.y = map.spawny;
	pawn.z = map.spawnz;
	pawn.rx = map.spawnrx;
	pawn.ry = map.spawnrx;
}
//---------------------------------------------------------------------
//   К Л А В И А Т У Р А   ////////////////////////////////////////////
//---------------------------------------------------------------------
document.addEventListener("keydown", (event) => {
	//-----------------------------------------------------------------
	if (event.keyCode == 39) map.setmap[map.level][map.objId][0+objMode*3] += 2.1;// ->
	if (event.keyCode == 37) map.setmap[map.level][map.objId][0+objMode*3] -= 2.1;// <-
	if (event.keyCode == 38) map.setmap[map.level][map.objId][2+objMode*3] += 2.1;// ^
	if (event.keyCode == 40) map.setmap[map.level][map.objId][2+objMode*3] -= 2.1;// v
	if (event.keyCode == 34) map.setmap[map.level][map.objId][1+objMode*3] -= 2.1;// pageDown
	if (event.keyCode == 33) map.setmap[map.level][map.objId][1+objMode*3] += 2.1;// PageUp
	//-----------------------------------------------------------------
	if (event.keyCode == 48)// 0
	{
		chud.sethp(32);
	}
	// if (event.keyCode == 49) objId = 1;// 1
	// if (event.keyCode == 50) objId = 2;// 2
	// if (event.keyCode == 51) objId = 3;// 3
	// if (event.keyCode == 52) objId = 4;// 4
	// if (event.keyCode == 53) objId = 5;// 5
	// if (event.keyCode == 54) objId = 6;// 6
	// if (event.keyCode == 55) objId = 7;// 7
	// if (event.keyCode == 56) objId = 8;// 8
	// if (event.keyCode == 57) objId = 9;// 9
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