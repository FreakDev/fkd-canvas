Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Scene = Fkd.extend(freakdev.canvas.scene.DisplayGroup);

/**
 * constructor
 * @param {freakdev.canvas.Canvas} target - Canvas object in which the scene will be rendered 
 */
freakdev.canvas.scene.Scene.prototype.init = function (target)
{	
	freakdev.canvas.scene.Scene.superClass.init.call(this, 0, 0, target.width, target.height);
	
	this.targetCanvas = target;
};

/**
 * in charge of rendering the scene
 * @param {freakdev.canvas.Canvas} [optional] canvas - set the target 
 * @returns void
 */
freakdev.canvas.scene.Scene.prototype.renderTo = function (canvas) 
{
	if (undefined != canvas)
		this.targetCanvas = canvas;
	
	ctx = this.targetCanvas.getContext();
	
	ctx.clearRect(0, 0, this.targetCanvas.getCanvas().width, this.targetCanvas.getCanvas().height);
	
	for (var i=0,len=this._atlas.length; i<len; i++) {
		var o = this._atlas[i];
		o.renderTo(this.targetCanvas);
	}
};

freakdev.canvas.scene.Scene.prototype.setVisible = function (status) { throw new Error('Can\'t change visibility status of the scene'); };

/**
 * resize the scene, this method is automatically called by the canvas 
 * @param {Integer} width
 * @param {Integer} height
 * @returns void
 */
freakdev.canvas.scene.Scene.prototype.resize = function (width, height)
{
	this.setWidth(width);
	this.setHeight(height);
};