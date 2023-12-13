//------------------------------------------------------------------------------
class cHud
{
	//--------------------------------------------------------------------------
	constructor() {}
	//--------------------------------------------------------------------------
	sethp(hp)
	{
		document.getElementById("hud-hp-count").innerHTML = hp;
		document.getElementById("hud-hp-progress").style.width = hp*2+'px';
	}

	setarmor(armor)
	{
		document.getElementById("hud-armor-count").innerHTML = armor;
		document.getElementById("hud-armor-progress").style.width = armor*2+'px';
	}

	setenemy(hp)
	{
		document.getElementById("enemy-hp-count").innerHTML = hp;
		document.getElementById("enemy-hp-progress").style.width = hp*3+'px';
	}

	setcrystal(count)
	{
		document.getElementById("hud-crystal-count").innerHTML = count;
		document.getElementById("hud-crystal-progress").style.width = count*2+'px';
	}

	setkey(count)
	{
		if (count == 0) document.getElementById("hud-key").style.height = '0px';
		else document.getElementById("hud-key").style.height = '64px';
	}

	setlevel(count)
	{
		document.getElementById("level-count").innerHTML = count;
	}

	setweapon(count)
	{
		document.getElementById("weapon-count").innerHTML = count;
		document.getElementById("hud-weapon-progress").style.height = count*20+'px';
	}

	setweaponall(count)
	{
		document.getElementById("weapon-countall").innerHTML = count;
	}

	sethudavatar(patch)
	{
		document.getElementById("hud-avatar").style.backgroundImage = 'url('+patch+')';
	}

	setenemyavatar(patch)
	{
		document.getElementById("enemy-avatar").style.backgroundImage = 'url('+patch+')';
	}

	setenemyname(name)
	{
		document.getElementById("enemy-name").innerHTML = name;
	}

	setlives(count)
	{
		document.getElementById("hud-lives").style.width = count*30+'px';
	}

	setlivesimg(patch)
	{
		document.getElementById("lives-img").style.backgroundImage = 'url('+patch+')';
	}

	setmapcor(x, y)
	{
		document.getElementById("map").style.backgroundPosition = x+"px "+y+"px";
	}

	setbigmappickup(x, y)
	{
		document.getElementById("big-map-pickup").style.left = x+"px";
		document.getElementById("big-map-pickup").style.top = y+"px";
	}
	//--------------------------------------------------------------------------
}
//------------------------------------------------------------------------------
