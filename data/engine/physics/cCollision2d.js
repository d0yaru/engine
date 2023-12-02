//------------------------------------------------------------------------------
class Collision2d
{
	constructor() {}
	//--------------------------------------------------------------------------
	// ---------------------------------------------------------------
	//   П Р О В Е Р К А   К О Л Л И З И И   /////////////////////////
	// ---------------------------------------------------------------
	collision2d()// коллизия с прямоугольниками
	{	
		onGround = false;
		
		for(let i = 0; i < obj.length; i++)
		{
			// рассчитываем координаты игрока в системе координат прямоугольника
			let x0 = (pawn.x - obj[i][0]);
			let y0 = (pawn.y - obj[i][1]);
			let z0 = (pawn.z - obj[i][2]);
			
			if ((x0**2 + y0**2 + z0**2 + dx**2 + dy**2 + dz**2) < (obj[i][6]**2 + obj[i][7]**2))
			{
				let x1 = x0 + dx;
				let y1 = y0 + dy;
				let z1 = z0 + dz;
			
				let point0 = coorTransform(x0,y0,z0,obj[i][3],obj[i][4],obj[i][5]);
				let point1 = coorTransform(x1,y1,z1,obj[i][3],obj[i][4],obj[i][5]);
				let normal = coorReTransform(0,0,1,obj[i][3],obj[i][4],obj[i][5]);
			
				// Условие коллизии и действия при нем
				if (Math.abs(point1[0])<(obj[i][6]+90)/2 && Math.abs(point1[1])<(obj[i][7]+90)/2 && Math.abs(point1[2]) < 50)
				{
					point1[2] = Math.sign(point0[2])*50;
					let point2 = coorReTransform(point1[0],point1[1],point1[2],obj[i][3],obj[i][4],obj[i][5]);
					let point3 = coorReTransform(point1[0],point1[1],0,obj[i][3],obj[i][4],obj[i][5]);
					dx = point2[0] - x0;
					dy = point2[1] - y0;
					dz = point2[2] - z0;
					if (Math.abs(normal[1]) > 0.8)
					{
						if (point3[1] < point2[1]) onGround = true;
					}
					else dy = y1 - y0;
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
