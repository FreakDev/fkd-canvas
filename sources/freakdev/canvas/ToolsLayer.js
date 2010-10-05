Fkd.createNamespace('freakdev.canvas');

freakdev.canvas.ToolsLayer = Fkd.extend(freakdev.canvas.Canvas);

freakdev.canvas.ToolsLayer.blueRef = [0,201,255];

freakdev.canvas.ToolsLayer.prototype.init = function () 
{
	freakdev.canvas.ToolsLayer.superClass.init.call(this);
	
	this.isMouseDown;
	this.wasMouseDown;
	this.target;
	this.brushSize;
};

freakdev.canvas.ToolsLayer.prototype.setTarget = function (target)
{
	this.target = target;
	this.resize(target.canvasNode.width, target.canvasNode.height);
};

freakdev.canvas.ToolsLayer.prototype.setBrushSize = function (size)
{
	this.brushSize = parseInt(size);
};

freakdev.canvas.ToolsLayer.prototype.initMouseState = function ()
{
	this.wasMouseDown = this.isMouseDown;
	this.isMouseDown = false;	
};

freakdev.canvas.ToolsLayer.prototype.restaureMouseState = function ()
{
	this.isMouseDown = this.wasMouseDown;	
};

freakdev.canvas.ToolsLayer.prototype.activateMouseTraking = function ()
{
	this.initMouseState();
	this.canvasNode.addEventListener('mousedown', Fkd.createDelegate(this.onMouseDown, this), true);
	this.canvasNode.addEventListener('mouseup', Fkd.createDelegate(this.onMouseUp, this), true);
	this.canvasNode.addEventListener('mousemove', Fkd.createDelegate(this.onMouseMove, this), true);
	this.canvasNode.addEventListener('mouseout', Fkd.createDelegate(this.onMouseOut, this), true);
	this.canvasNode.addEventListener('mouseover', Fkd.createDelegate(this.onMouseOver, this), true);
};

freakdev.canvas.ToolsLayer.prototype.onMouseDown = function (e)
{
	this.Debug.print('Down');
	this.Debug.print(e);
	this.paint(parseInt(e.layerX), parseInt(e.layerY));
	this.isMouseDown = true;
};

freakdev.canvas.ToolsLayer.prototype.onMouseUp = function (e)
{
	this.isMouseDown = false;
};

freakdev.canvas.ToolsLayer.prototype.onMouseMove = function (e)
{
	if (this.isMouseDown)
		this.paint(parseInt(e.layerX), parseInt(e.layerY));
};

freakdev.canvas.ToolsLayer.prototype.onMouseOut = function (e)
{
	this.initMouseState();
};

freakdev.canvas.ToolsLayer.prototype.onMouseOver = function (e)
{
	this.restaureMouseState();
};

freakdev.canvas.ToolsLayer.prototype.paint = function (x, y)
{
	var radgrad = this.getContext().createRadialGradient(x, y, Math.ceil(this.brushSize / 3), x, y, this.brushSize);
	var blue = freakdev.canvas.ToolsLayer.blueRef.join(',');
	radgrad.addColorStop(0, new String('rgba(').concat(blue).concat(',1)'));
	radgrad.addColorStop(0.9, new String('rgba(').concat(blue).concat(',0)'));
	radgrad.addColorStop(1, new String('rgba(').concat(blue).concat(',0)'));
	
	this.getContext().fillStyle = radgrad;
	
	this.getContext().fillRect(0, 0, this.canvasNode.width, this.canvasNode.height);
};

freakdev.canvas.ToolsLayer.prototype.applyFilters = function ()
{
	var imgData = this.getContext().getImageData(0, 0, this.canvasNode.width, this.canvasNode.height);
	var data = imgData.data;

	var targetData = this.target.getContext().getImageData(0, 0, this.canvasNode.width, this.canvasNode.height);
	var tData = targetData.data;	
	
	var ref = freakdev.canvas.ToolsLayer.blueRef;
	
	for (var i = 0, len = data.length; i < len; i++) {
		var indexes = [i, ++i, ++i,++i];;
		var tPx = new freakdev.canvas.image.Pixel(tData[indexes[0]], tData[indexes[1]], tData[indexes[2]]);
		
		if (data[indexes[3]])
			tPx = this.updatePixel(tPx);
		
		tData[indexes[0]] = tPx.red;
		tData[indexes[1]] = tPx.green;
		tData[indexes[2]] = tPx.blue;
	}
	
	this.target.getContext().putImageData(targetData, 0, 0, 0, 0, targetData.width, targetData.height);
	this.getContext().clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
};
