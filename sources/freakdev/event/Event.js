Fkd.createNamespace('freakdev.event');

freakdev.event.Event = function ()
{
	this.init.apply(this, arguments);
};

freakdev.event.Event.prototype.init = function (name)
{	
	this._name = name;
	this._allowPropagation = true;
};

freakdev.event.Event.prototype.getName = function () 
{
	return this._name;
};

freakdev.event.Event.prototype.stopPropagation = function () 
{
	this._allowPropagation = false;
	return false;
};

freakdev.event.Event.prototype.canPropagate = function () 
{
	return this._allowPropagation;
};