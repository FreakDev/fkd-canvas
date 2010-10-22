Fkd.createNamespace('freakdev.canvas.scene');

/**
 * Abstract Class
 */
freakdev.canvas.scene.Shape = Fkd.extend(freakdev.canvas.scene.Object);

freakdev.canvas.scene.Shape.prototype.init = function()
{
	this._isMask = false;
	
	freakdev.canvas.scene.Shape.superClass.init.apply(this, arguments);
};

freakdev.canvas.scene.Shape.prototype.renderTo = function (canvas) 
{	
	if (undefined != canvas)
		this.targetCanvas = canvas;
	
	var ctx = this.targetCanvas.getContext('2d');
	
	if (!this.isMask()) {
		freakdev.canvas.scene.Shape.superClass.renderTo.call(this, this.targetCanvas);
	}
	else {
		ctx.beginPath();
		this.draw();
		ctx.closePath();
		ctx.save();
		ctx.clip();
	}
		
};

// abstract
freakdev.canvas.scene.Shape.prototype.draw = function ()
{
	throw new Error('should be implemented by the children class');
};

freakdev.canvas.scene.Shape.prototype.isMask = function ()
{
	return this._isMask;
};

freakdev.canvas.scene.Shape.prototype.setAsMask = function ()
{
	this._isMask = true;
	var em = freakdev.event.EventManager.getInstance();
	this._container.attachEvent('afterRenderTo', Fkd.createDelegate(function () {
		this.targetCanvas.restore();
	}, this));
	
};