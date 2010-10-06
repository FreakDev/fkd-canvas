Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.DisplayGroup = Fkd.extend(freakdev.canvas.scene.Object);

freakdev.canvas.scene.DisplayGroup.prototype.init = function(x, y, width, height)
{
	this._atlas = [];
	
	freakdev.canvas.scene.DisplayGroup.superClass.init.call(this, x, y, width, height);
};

freakdev.canvas.scene.DisplayGroup.prototype._drawToTarget = function (target)
{	
	for (var i=0,len=this._atlas.length; i<len; i++) {
		var o = this._atlas[i];
		o.renderTo(target);
	}
};

freakdev.canvas.scene.DisplayGroup.prototype.render = function ()
{
	var threadBroker = freakdev.thread.Broker.getInstance();

	var threadGroupID = freakdev.utils.Uuid();
	
	for (var i=0,len=this._atlas.length; i<len; i++) {
		var o = this._atlas[i];

    	threadBroker.startThread({fn:o.render, scope:o}, [], null, threadGroupID);
	}
	
	// wait for all process to be finnished
	while(!threadBroker.isFinnished(threadGroupID)) { }
}

freakdev.canvas.scene.DisplayGroup.prototype.push = function (o)
{
	o.setContainer(this);
	this._atlas.push(o);
};

freakdev.canvas.scene.DisplayGroup.prototype.pop = function ()
{
	var o = this._atlas.pop();
	o.setContainer(null);
};

freakdev.canvas.scene.DisplayGroup.prototype.unshift = function (o)
{
	o.setContainer(this);
	this._atlas.unshift(o);
};

freakdev.canvas.scene.DisplayGroup.prototype.shift = function ()
{
	var o = this._atlas.shift();
	o.setContainer(null);
};

freakdev.canvas.scene.DisplayGroup.prototype.insertAt = function (i, o)
{
	o.setContainer(this);
	this._atlas.splice(i, 0, o);
};

freakdev.canvas.scene.DisplayGroup.prototype.removeAt = function (i)
{
	var o = this._atlas.splice(i, 1);
	o[0].setContainer(null);
};

