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
	var fn, scope;
	if (this.fn.scope && this.fn.fn) {
		scope = this.fn.scope;
		fn = this.fn.fn;
	} else {
		scope = window;
		fn = this.fn;
	}
		
	return fn.apply(scope, this.params);
		
};