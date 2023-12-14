//------------------------------------------------------------------------------
class Collision2d
{
	constructor() {}
	//--------------------------------------------------------------------------
	// ---------------------------------------------------------------
	//   П Р О В Е Р К А   К О Л Л И З И И   /////////////////////////
	// ---------------------------------------------------------------
	collision2d()// коллизия с прямоугольниками ( 50, 90, 2, 0.8)
	{	
		onGround = false;
		
		for(let i = 0; i < map.setmap[map.level].length; i++)
		{
			if (map.setmap[map.level][i][12])
			{
				// рассчитываем координаты игрока в системе координат прямоугольника
				let x0 = (pawn.x - map.setmap[map.level][i][0]);
				let y0 = (pawn.y - map.setmap[map.level][i][1]);
				let z0 = (pawn.z - map.setmap[map.level][i][2]);
				
				if ((x0**2 + y0**2 + z0**2 + dx**2 + dy**2 + dz**2) < (map.setmap[map.level][i][6]**2 + map.setmap[map.level][i][7]**2))
				{
					//----------------------------------------------------------
					if (map.setmap[map.level][i][11]) map.collisionAction(i);
					//----------------------------------------------------------
					let x1 = x0 + dx;
					let y1 = y0 + dy;
					let z1 = z0 + dz;
				
					let point0 = coorTransform(x0,y0,z0,map.setmap[map.level][i][3],map.setmap[map.level][i][4],map.setmap[map.level][i][5]);
					let point1 = coorTransform(x1,y1,z1,map.setmap[map.level][i][3],map.setmap[map.level][i][4],map.setmap[map.level][i][5]);
					let normal = coorReTransform(0,0,1,map.setmap[map.level][i][3],map.setmap[map.level][i][4],map.setmap[map.level][i][5]);
				
					// Условие коллизии и действия при нем
					if (Math.abs(point1[0])<(map.setmap[map.level][i][6]+90)/2 && Math.abs(point1[1])<(map.setmap[map.level][i][7]+90)/2 && Math.abs(point1[2]) < 50)// 50 => 2 высота игрока
					{
						point1[2] = Math.sign(point0[2])*50;// 50 => 2 высота игрока
						let point2 = coorReTransform(point1[0],point1[1],point1[2],map.setmap[map.level][i][3],map.setmap[map.level][i][4],map.setmap[map.level][i][5]);
						let point3 = coorReTransform(point1[0],point1[1],0,map.setmap[map.level][i][3],map.setmap[map.level][i][4],map.setmap[map.level][i][5]);
						dx = point2[0] - x0;
						dy = point2[1] - y0;
						dz = point2[2] - z0;
						if (Math.abs(normal[1]) > 0.8)
						{
							if (point3[1] < point2[1]) onGround = true;
							// if (map.setmap[map.level][i][11] > 0) console.log(` >> [ ${map.setmap[map.level][i][11]} ]`);// земля
						}
						else dy = y1 - y0;
					}
				}
			}
		}
	}
	//------------------------------------------------------------------------------
	////////////////////////////////////////////////////////////////////////////////
	//------------------------------------------------------------------------------
	//--------------------------------------------------------------------------
}
//------------------------------------------------------------------------------
function coorTransform(x0,y0,z0,rxc,ryc,rzc)
{
	let x1 =  x0;
	let y1 =  y0*Math.cos(rxc*deg) + z0*Math.sin(rxc*deg);
	let z1 = -y0*Math.sin(rxc*deg) + z0*Math.cos(rxc*deg);
	let x2 =  x1*Math.cos(ryc*deg) - z1*Math.sin(ryc*deg);
	let y2 =  y1;
	let z2 =  x1*Math.sin(ryc*deg) + z1*Math.cos(ryc*deg);
	let x3 =  x2*Math.cos(rzc*deg) + y2*Math.sin(rzc*deg);
 	let y3 = -x2*Math.sin(rzc*deg) + y2*Math.cos(rzc*deg);
	let z3 =  z2;
	return [x3,y3,z3];
}

function coorReTransform(x3,y3,z3,rxc,ryc,rzc)
{
	let x2 =  x3*Math.cos(rzc*deg) - y3*Math.sin(rzc*deg);
	let y2 =  x3*Math.sin(rzc*deg) + y3*Math.cos(rzc*deg);
	let z2 =  z3
	let x1 =  x2*Math.cos(ryc*deg) + z2*Math.sin(ryc*deg);
	let y1 =  y2;
	let z1 = -x2*Math.sin(ryc*deg) + z2*Math.cos(ryc*deg);
	let x0 =  x1;
	let y0 =  y1*Math.cos(rxc*deg) - z1*Math.sin(rxc*deg);
	let z0 =  y1*Math.sin(rxc*deg) + z1*Math.cos(rxc*deg);
	return [x0,y0,z0];
};
//------------------------------------------------------------------------------
