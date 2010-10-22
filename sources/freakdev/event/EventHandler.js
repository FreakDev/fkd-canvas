Fkd.createNamespace('freakdev.event');

freakdev.event.EventHandler = function ()
{
	this.init.apply(this, arguments);
};

freakdev.event.EventHandler.prototype.init = function (name)
{	
	this._eventManager = freakdev.event.EventManager.getInstance();
	this._constUID = generateUuid();
};

freakdev.event.EventHandler.prototype.getConstId = function () 
{
	return this._constUID;
};

freakdev.event.EventHandler.prototype.attachEvent = function(eventName, callback)
{
	this._eventManager.addEventListener(eventName, callback, this);
};

freakdev.event.EventHandler.prototype.detachEvent = function(eventName, callback)
{
	this._eventManager.addEventListener(eventName, this, callback);
};

freakdev.event.EventHandler.prototype.fireEvent = function(event, params)
{
	this._eventManager.fireEvent(event, this);
};

freakdev.event.EventHandler.prototype.fireEventAsync = function(event, params)
{
	var threadBroker = freakdev.thread.Broker.getInstance();
	
	threadBroker.startThread(this._eventManager.fireEvent, [event, this]);
};