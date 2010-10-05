Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Scene = Fkd.extend(freakdev.canvas.scene.DisplayGroup);

freakdev.canvas.scene.Scene.prototype.init = function (target)
{	
	this.targetCanvas = target;
	
	freakdev.canvas.scene.Scene.superClass.init.call(this, 0, 0, this.targetCanvas.width, this.targetCanvas.height);	
};

freakdev.canvas.scene.Scene.prototype.render = function () 
{
	freakdev.canvas.scene.Scene.superClass.renderTo(this.targetCanvas.getContext('2d'));
};