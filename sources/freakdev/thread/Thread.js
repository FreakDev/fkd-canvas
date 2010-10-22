Fkd.createNamespace('freakdev.thread');

freakdev.thread.Thread = function () 
{
	this.init.apply(this, arguments);
};

freakdev.thread.Thread.prototype.init = function (fn, params, callback)
{
	this.fn = fn;
	this.params = params;
	this.callback = callback;
};

freakdev.thread.Thread.prototype.run = function ()
{		
	return this.fn (this.params);
};