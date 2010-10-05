Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.DisplayGroup = Fkd.extend(freakdev.canvas.scene.Object);

freakdev.canvas.scene.DisplayGroup.prototype.init = function(x, y, width, height)
{
	this._atlas = [];
	
	freakdev.canvas.scene.DisplayGroup.superClass.init.call(this, x, y, width, height);
};

freakdev.canvas.scene.DisplayGroup.prototype.renderTo = function(target)
{
	this.needToBeRendered = false;	
	if (this.isVisible()) {
		for (var i=0,len=this._atlas.length; i<len; i++) {
			var o = this._atlas[i];
			o.renderTo(target);
		}
	}	
};

freakdev.canvas.scene.DisplayGroup.prototype.push = function (o)
{
	this._atlas.push(o);
};

freakdev.canvas.scene.DisplayGroup.prototype.pop = function ()
{
	this._atlas.push(o);
};

freakdev.canvas.scene.DisplayGroup.prototype.unshift = function (o)
{
	this._atlas.unshift(o);
};

freakdev.canvas.scene.DisplayGroup.prototype.shift = function ()
{
	this._atlas.shift();
};

freakdev.canvas.scene.DisplayGroup.prototype.insertAt = function (i, o)
{
	this._atlas.splice(i, 0, o);
};

freakdev.canvas.scene.DisplayGroup.prototype.removeAt = function (i)
{
	this._atlas.splice(i, 1);
};

