//------------------------------------------------------------------------------
class LoadTexture
{
	constructor() {}
	
	//------------------------------------------------------------------------------
	//
	// Инициализируйте текстуру и загрузите изображение.
	// Когда загрузка изображения завершится, скопируйте его в текстуру.
	//
	loadTexture(gl, url)
	{
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Потому что изображения должны загружаться через Интернет
		// им может потребоваться некоторое время, пока они не будут готовы.
		// До тех пор поместите один пиксель в текстуру, чтобы мы могли
		// используйте его немедленно. Когда загрузка изображения завершится
		// мы обновим текстуру в соответствии с содержимым изображения.
		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1;
		const height = 1;
		const border = 0;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;
		const pixel = new Uint8Array([0, 0, 255, 255]);// непрозрачный синий
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
						width, height, border, srcFormat, srcType,
						pixel);

		const image = new Image();
		image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
						srcFormat, srcType, image);

			// WebGL 1 предъявляет разные требования к мощности двух изображений
			// против отсутствия мощности 2 изображений, поэтому проверьте, является ли изображение
			// степень 2 в обоих измерениях.
			if (isPowerOf2(image.width) && isPowerOf2(image.height))
			{
				// Да, это степень 2. Генерируйте mips.
				gl.generateMipmap(gl.TEXTURE_2D);
			}
			else
			{
				// Нет, это не степень 2. Поверните mips и установите
				// обертывание для закрепления на краю
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}
		};
		image.src = url;

		return texture;
	}
}
//------------------------------------------------------------------------------
function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}
//------------------------------------------------------------------------------