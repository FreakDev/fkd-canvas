Fkd.createNamespace('freakdev.event');

freakdev.event.CLICK = 'click';
freakdev.eventDBLCLICK = 'dblclick';

freakdev.event.MOUSE_DOWN = 'mousedown';
freakdev.event.MOUSE_MOVE = 'mousemove';
freakdev.event.MOUSE_OUT = 'mouseout';
freakdev.event.MOUSE_OVER = 'mouseover';
freakdev.event.MOUSE_UP = 'mouseup';
freakdev.event.MOUSE_WHEEL = 'mousewheel';

freakdev.event.KEY_DOWN = 'keydown';
freakdev.event.KEY_PRESS = 'keypress';
freakdev.event.KEY_UP = 'keyup';

freakdev.event.DRAG = 'drag';
freakdev.event.DRAG_END = 'dragend';
freakdev.event.DRAG_ENTER = 'dragenter';
freakdev.event.DRAG_LEAVE = 'dragleave';
freakdev.event.DRAG_OVER = 'dragover';
freakdev.event.DRAG_START = 'dragstart';
freakdev.event.DROP = 'drop';

freakdev.event.DOM_EVENTS = ['mousedown', 'mousemove', 'mouseout', 'mouseover', 
                             'mouseup', 'mousewheel', 'keydown', 'keypress', 
                             'keyup', 'drag', 'dragend', 'dragenter', 'dragleave', 
                             'dragover','dragstart', 'drop'];

freakdev.event.EventManager = function () 
{
	this.init.apply(this, arguments);
};

freakdev.event.EventManager.prototype.init = function ()
{
	this._eventListeners = [];
};

freakdev.event.EventManager.instance = null;

freakdev.event.EventManager.getInstance = function ()
{
	if (null == freakdev.event.EventManager.instance) {
		freakdev.event.EventManager.instance = new freakdev.event.EventManager();
	}
	
	return freakdev.event.EventManager.instance;
};

freakdev.event.EventManager.prototype.addEventListeners = function (er)
{
	
};

freakdev.event.EventManager.prototype.domEventFactory = function (domEvent, canvas)
{
	if ('mouse' == domEvent.type.substr(0, 5)) {
		return new freakdev.event.MouseEvent(domEvent, canvas);
	} else if ('key' == domEvent.type.subtr(0, 3)) {
		//return new freakdev.event.KeyEvent(domEvent, canvas);
	} else if ('drop' == domEvent.type.subtr(0, 4) || 'drop' == domEvent.type.subtr(0, 4)) {
		//return new freakdev.event.DragEvent(domEvent, canvas);
	}
};

freakdev.event.EventManager.prototype.fireEvent = function (event)
{
	for (var i, er; er = this.eventReceiver[i]; i++) {
		if (!er.propagateEvent(event))
			return false;
	}
	
	return true;	
};
