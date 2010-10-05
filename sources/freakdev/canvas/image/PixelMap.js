Fkd.createNamespace('freakdev.canvas.image');

freakdev.canvas.image.PixelMap = function (width, height)
{
	this.init(width, height);
};

freakdev.canvas.image.PixelMap.prototype.init = function (width, height) 
{
	this.data;
	
	this._pixels;
	
	this.width = width;
	this.height = height;
		
	this.clear();	
};

freakdev.canvas.image.PixelMap.DEFAULT_COLOR = [0,0,0,0];

freakdev.canvas.image.PixelMap.prototype._getPixels = function ()
{
	if (undefined == this._pixels || null == this._pixels)
		this._pixels = [];
	
	return this._pixels;
}

freakdev.canvas.image.PixelMap.prototype.calcIndex = function (x, y, binary)
{
	var coef = 4;
	
	if (undefined == binary || false == binary)
		coef = 1;
	
	return ((this.width * coef) * y) + (x * coef);
};

freakdev.canvas.image.PixelMap.prototype._calcBinaryMap = function ()
{
	for(var i=3, len=this.data.length; i<len; i = i + 5) {
		if (this.data[i])
			this.binaryData.push(1);
		else
			this.binaryData.push(0);
	}
};

freakdev.canvas.image.PixelMap.prototype._genPxKey = function (x, y)
{
	return new String('_').concat(x).concat('_').concat(y);
};

freakdev.canvas.image.PixelMap.prototype.setData = function (data)
{
	this.clear();
	this.data = data;
	this._calcBinaryMap;
};

freakdev.canvas.image.PixelMap.prototype.clear = function ()
{	
	this.data = [];
	this.binaryData = [];
};

freakdev.canvas.image.PixelMap.prototype.getPixelAt = function (x, y)
{
	
	var key = this._genPxKey(x, y);
	var pixels = this._getPixels();
	if (pixels[key])
		return this._getPixels()[key];
	
	var i = this.calcIndex(x, y, true);
	var r, g, b, a;
	
	r = undefined == this.data[i] ? freakdev.canvas.image.PixelMap.DEFAULT_COLOR[0] : this.data[i];
	i++;
	g = undefined == this.data[i] ? freakdev.canvas.image.PixelMap.DEFAULT_COLOR[1] : this.data[i];
	i++;
	b = undefined == this.data[i] ? freakdev.canvas.image.PixelMap.DEFAULT_COLOR[2] : this.data[i];
	i++;
	a = undefined == this.data[i] ? freakdev.canvas.image.PixelMap.DEFAULT_COLOR[3] : this.data[i];
	
	pixels[key] = new freakdev.canvas.image.Pixel(r, g, b, a);
	
	return pixels[key];
};

freakdev.canvas.image.PixelMap.prototype.setPixelAt = function (px, x, y)
{
	var i = this.calcIndex(x, y, false);
	
	var pixels = this._getPixels();
	pixels[this._genPxKey(x, y)] = px;
	
	this.data[i] = px.red;
	this.data[++i] = px.green;
	this.data[++i] = px.blue;
	this.data[++i] = px.alpha;	
};

freakdev.canvas.image.PixelMap.prototype.setImageData = function (imgData)
{
	this.width = imgData.width;
	this.height = imgData.height;
	
	this.setData(imgData.data);
};

//freakdev.canvas.image.PixelMap.prototype.getSubMap = function (x, y, x1, y1)
//{
//	binary = (undefined == binary ? false : binary);
//	
//	startIndex = this.calcIndex(x, y, binary);
//	
//	endIndex = this.calcIndex(x1, y1, binary);
//	
//	if (binary)
//		this.binaryData.slice(startIndex, endIndex);
//	else
//		this.data.slice(startIndex, endIndex + 4);
//};
