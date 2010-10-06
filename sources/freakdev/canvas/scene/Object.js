Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Object = function ()
{
	this.init.apply(this, arguments);
};

freakdev.canvas.scene.Object.prototype.init = function(x, y, width, height)
{
	this.id = freakdev.utils.Uuid();
	this._imgTag = new Image((width ? width : null), (height ? height : null));
	
	this.x = undefined == x ? 0 : x;
	this.y = undefined == y ? 0 : y;
	this.activeStatus = false;
	this.focusStatus = false;
	this.visibilityStatus = true;
	this.opacity = 1;
	//this.effectPool = new freakdev.canvas.image.EffectPool();
	
	this._container;
	this._needToRender = true;
	
	this._eventListeners = [];
};

freakdev.canvas.scene.Object.prototype.setId = function (value) 
{
	this.id = value;
};

freakdev.canvas.scene.Object.prototype.getId = function () 
{
	return this.id;
};

freakdev.canvas.scene.Object.prototype.renderTo = function (target) 
{
	if (this.isVisible()) {
		if (this._needToRender)
			this.render();
		
		if (this.opacity < 1) {
			target.save();
			target.globalAlpha = this.opacity;
		}		
		
		this._drawToTarget(target);
		
		if (this.opacity < 1)
			target.restore();		
	}
};

freakdev.canvas.scene.Object.prototype._drawToTarget = function (target)
{
	target.drawImage(this.getImgTag(), this.x, this.y, this.getWidth(), this.getHeight());	
}

freakdev.canvas.scene.Object.prototype.needToRender = function ()
{
	this._needToRender = true;
	this._container.needToRender();
};

freakdev.canvas.scene.Object.prototype.isRenderNeeded = function ()
{
	return this._needToRender;
};

freakdev.canvas.scene.Object.prototype.setContainer = function (obj)
{
	this._container = obj;
}

freakdev.canvas.scene.Object.prototype.render = function () 
{
	this._needToRender = false;
	//this.effectPool.apply(this);
};

freakdev.canvas.scene.Object.prototype.isEventHandled = function (eventName)
{
	if (this._eventListeners[eventName])
		return true;
	else 
		return false;
}

freakdev.canvas.scene.Object.prototype.handleEvent = function (e)
{
	if (!e.type)
		throw Error('Invalid event');
	
	if (!this.isEventHandled(e.type))
		return false;
	
	if (this._shouldHandleEvent(e)) {
		for (var j=0,len=this._eventListeners[e.type].length; j<len; j++) {
			Fkd.call_fn_array(this._eventListeners[e.type][j], [e]);
		}
		return true;
	} else {
		return false;
	}
};

freakdev.canvas.scene.Object.prototype.removeEventListeners = function (eventName, listener) 
{
	if (!this.isEventHandled(eventName))
		return
		
	if (listener) {
		this._eventListeners[eventName].splice(indexof(listener, this._eventListeners[eventName]), 1);
		if (0 == this._eventListeners[eventName].length)
			this._eventListeners[eventName] = null;
	} else {
		this._eventListeners[eventName] = null;
	}
};

freakdev.canvas.scene.Object.prototype.addEventListener = function (eventName, listener) 
{
	if (!this.isEventHandled(eventName))
		this._eventListeners[eventName] = [];		
		
	this._eventListeners[eventName].push(listener);
};

freakdev.canvas.scene.Object.prototype._shouldHandleEvent = function (event)
{
	return false;
};

freakdev.canvas.scene.Object.prototype.getWidth = function () 
{
	return this.getImgTag().width;
};

freakdev.canvas.scene.Object.prototype.getHeight = function ()
{
	return this.getImgTag().height;
};

freakdev.canvas.scene.Object.prototype.getX = function () 
{
	return this.x;
};

freakdev.canvas.scene.Object.prototype.getY = function ()
{
	return this.y;
};

freakdev.canvas.scene.Object.prototype.getImgTag = function ()
{
	return this._imgTag;
};

freakdev.canvas.scene.Object.prototype.getOpacity = function ()
{
	return this.opacity;
};

freakdev.canvas.scene.Object.prototype.setOpacity = function (value) 
{
	this.opacity = value;
};

freakdev.canvas.scene.Object.prototype.setImgTag = function (value) 
{
	this._imgTag = value;
};

freakdev.canvas.scene.Object.prototype.setWidth = function (value) 
{
	this.getImgTag().width = value;
};

freakdev.canvas.scene.Object.prototype.setHeight = function (value)
{
	this.getImgTag().height = value;
};

freakdev.canvas.scene.Object.prototype.setX = function (value)
{
	this.x = value;
};

freakdev.canvas.scene.Object.prototype.setY = function (value)
{
	this.y = value;
};

freakdev.canvas.scene.Object.prototype.setActive = function (status)
{
	if (undefined == status)
		status = true;
	
	this.activeStatus = status;
};

freakdev.canvas.scene.Object.prototype.isActive = function ()
{
	return this.activeStatus;
};

freakdev.canvas.scene.Object.prototype.focus = function (status)
{
	if (undefined == status)
		status = true;
	
	this.focusStatus = status;
};

freakdev.canvas.scene.Object.prototype.hasFocus = function ()
{
	return this.focusStatus;
};

freakdev.canvas.scene.Object.prototype.setVisible = function (status)
{
	if (undefined == status)
		status = true;
	
	this.visibilityStatus = status;
};

freakdev.canvas.scene.Object.prototype.isVisible = function ()
{
	return this.visibilityStatus;
};
