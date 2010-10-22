Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Object = Fkd.extend(freakdev.event.EventHandler);

/**
 * constructor
 * @param {Integer} x
 * @param {Integer} y
 * @param {Integer} width
 * @param {Integer} height
 */
freakdev.canvas.scene.Object.prototype.init = function(x, y, width, height)
{
	/**
	 * id attribute
	 * @type String
	 */
	this.id = freakdev.utils.Uuid();
	this._constId = freakdev.utils.Uuid();
	
	/**
	 * img tag used to make rendering to canvas easier and faster
	 * @type Image
	 */
	this._imgTag = new Image((width ? width : null), (height ? height : null));
	
	/**
	 * non modified width of the image tag
	 * @type {Integer}
	 */
	this._naturalWidth = 0;
	
	/**
	 * non modified height of the image tag
	 * @type {Integer}
	 */	
	this._naturalHeight = 0;
	
	/**
	 * x position of the object
	 * @type {Integer}
	 */
	this.x = undefined == x ? 0 : x;

	/**
	 * y position of the object
	 * @type {Integer}
	 */	
	this.y = undefined == y ? 0 : y;
	
	/**
	 * whether or not an object is active
	 * @type {Boolean}
	 */	
	this.activeStatus = false;

	/**
	 * whether or not an object has the focus
	 * @type {Boolean}
	 */	
	this.focusStatus = false;

	/**
	 * whether or not an object is visible
	 * @type {Boolean}
	 */	
	this.visibilityStatus = true;

	/**
	 * opacity value of the object
	 * @type {Integer}
	 */	
	this.opacity = 1;

	/**
	 * rotation value of the object
	 * @type {Integer}
	 */	
	this.rotation = 0; // degree
	
	/**
	 * scale for 'x' dimension of the object
	 * @type {Integer}
	 */	
	this.scaleX = 1;
	
	/**
	 * scale for 'y' dimension of the object
	 * @type {Integer}
	 */	
	this.scaleY = 1;
	//this.effectPool = new freakdev.canvas.image.EffectPool();
	
	/**
	 * reference to the container in which the object has been added (eg:a displaygroup, the scene, ...)
	 * @type {freakdev.canvas.scene.Object}
	 */
	this._container = null;
	
	/**
	 * whether or not an object has to render
	 * @type {Boolean}
	 */
	this._needToRender = true;
	
	/**
	 * true when the rendering job is not terminated
	 * @type {Boolean}
	 */
	this._isRendering = false;
	
	this._eventListeners = [];
	
	/**
	 * anchor point for geometric transformations (only used for mouse drag and drop for the moment)
	 * @type Object 
	 */
	this._anchorPoint = {};
	
	
	this.resetAnchorPoint();
};

/**
 * setter for the needToRender flag
 * @param {Boolean} value
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setNeedToRender = function (value)
{
	if (undefined == value)
		value = true;
	
	if (value && null != this._container) {
		this._container.setNeedToRender();
	}
	
	this._needToRender = value;
};

/**
 * reset anchor point to 0, 0
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.resetAnchorPoint = function ()
{
	this._anchorPoint = {x: 0, y: 0};
};

/**
 * define anchor point 
 * @param {Integer} x
 * @param {Integer} y
 * @returns void 
 */
freakdev.canvas.scene.Object.prototype.setAnchorPoint = function (x, y)
{
	this._anchorPoint = {'x': x, 'y': y};
};

/**
 * set the id property (id should be unique)
 * @param {String} value
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setId = function (value) 
{
	this.id = value;
};

/**
 * return the id property
 * @returns {String} id
 */
freakdev.canvas.scene.Object.prototype.getId = function () 
{
	return this.id;
};

freakdev.canvas.scene.Object.prototype._prepareTarget = function (target)
{
	if (this.opacity < 1 || 0 != this.rotation || 1 != this.getScaleX() || 1 != this.getScaleY()) {
		
		target.updateContext('globalAlpha', this.opacity);
		
		target.translateToObjectCenter(this);
		
		tmpX = this.getX(); tmpY = this.getY();
		this.setX(- (parseInt((this.getWidth() / 2))));
		this.setY(- (parseInt((this.getHeight() / 2))));

		target.rotate(this.rotation);
		
		target.scale(this.getScaleX(), this.getScaleY());
	}	
};

freakdev.canvas.scene.Object.prototype._restoreTarget = function (target)
{
	if (this.opacity < 1 || 0 != this.rotation || 1 != this.getScaleX() || 1 != this.getScaleY()) {
		
		target.restore(4);
		this.setX(tmpX);
		this.setY(tmpY);
		
	}	
};

/**
 * render if needed and print the content of the object to the given target
 * this méthod is called by the object container during the rendering process
 * @param {freakdev.canvas.Cnavas} target
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.renderTo = function (target) 
{
	var tmpX, tmpY;
	
	if (this.isVisible()) {
		if (this.isRenderNeeded())
			this.render();
			
		this.fireEvent('beforeRenderTo', this);
		
		this._prepareTarget(target);
		
		this._drawToTarget(target);
		
		this._restoreTarget(target);
		
		this.fireEvent('afterRenderTo', this);
	}
};

/**
 * draw the raw content of the object to the target  
 * @param {freakdev.canvas.Canvas} target
 * @returns void
 */
freakdev.canvas.scene.Object.prototype._drawToTarget = function (target)
{
	if (this._naturalWidth > 0 && this._naturalHeight > 0)
		target.getContext().drawImage(this.getImgTag(), 0, 0, this._naturalWidth, this._naturalHeight, this.getX(), this.getY(), this.getWidth(), this.getHeight());
};

/**
 * getter for the needToRender flag
 * @returns {Boolean} needToRender
 */
freakdev.canvas.scene.Object.prototype.isRenderNeeded = function ()
{
	return this._needToRender;
};

/**
 * set the object container
 * this method is automatically called by the container
 * @param {freakdev.canvas.scene.Object} obj
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setContainer = function (obj)
{
	this._container = obj;
};

/**
 * render the object (apply effects)
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.render = function () 
{
	if (this._isRendering)
		return;
	
	this._isRendering = true;
	this.setNeedToRender(false);
	
	//this.effectPool.apply(this);
	
	this._isRendering = false;
};

/**
 * getter fot the is_rendering flag
 * @returns {Boolean} isRendering
 */
freakdev.canvas.scene.Object.prototype.isRendering = function ()
{
	return this._isRendering;
};

freakdev.canvas.scene.Object.prototype.isDomEventHandled = function (eventName)
{
	if (this._eventListeners[eventName])
		return true;
	else 
		return false;
};

freakdev.canvas.scene.Object.prototype.handleDomEvent = function (e)
{
	if (!e.type)
		throw Error('Invalid event');
	
	if (!this.isDomEventHandled(e.type))
		// continue propagation
		return true;
	
	for (var j=0,len=this._eventListeners[e.type].length; j<len; j++) {
		Fkd.call_fn_array(this._eventListeners[e.type][j], [e]);
		if (false === e.canPropagate())
			break;
	}
	return e.canPropagate();
};

freakdev.canvas.scene.Object.prototype.removeEventListeners = function (eventName, listener) 
{
	if (!this.isDomEventHandled(eventName))
		return
		
	if (listener) {
		this._eventListeners[eventName].splice(indexof(listener, this._eventListeners[eventName]), 1);
		if (0 == this._eventListeners[eventName].length)
			delete(this._eventListeners[eventName]);
	} else {
		delete(this._eventListeners[eventName]);
	}
};

freakdev.canvas.scene.Object.prototype.addEventListener = function (eventName, listener) 
{
	var em = freakdev.event.EventManager.getInstance();
	
	if (!this.isDomEventHandled(eventName))
		this._eventListeners[eventName] = [];		
		
	this._eventListeners[eventName].push(listener);
};

freakdev.canvas.scene.Object.prototype._shouldHandleMouseEvent = function (event)
{
	var ctx = event.canvas.getContext();

//	if (0 != this.rotation) {
//		//ctx.save();
//	}
	
	ctx.beginPath();
	ctx.moveTo(this.getX()					, this.getY());
	ctx.lineTo(this.getX() + this.getWidth(), this.getY());
	ctx.lineTo(this.getX() + this.getWidth(), this.getY() + this.getHeight());
	ctx.lineTo(this.getX()					, this.getY() + this.getHeight());	
	ctx.lineTo(this.getX()					, this.getY());
	ctx.closePath();
		
	// debug
	//ctx.stroke();
	
	//debug(event);
	var isPtInPath = ctx.isPointInPath(event.x, event.y);
	
	return isPtInPath;
};

/** 
 * returns width of the object
 * @returns {Integer} width
 */
freakdev.canvas.scene.Object.prototype.getWidth = function () 
{
	return this.getImgTag().width;
};

/** 
 * returns height of the object
 * @returns {Integer} height
 */
freakdev.canvas.scene.Object.prototype.getHeight = function ()
{
	return this.getImgTag().height;
};

/** 
 * returns x of the object
 * @returns {Integer} x
 */
freakdev.canvas.scene.Object.prototype.getX = function () 
{
	return this.x;
};

/** 
 * returns y of the object
 * @returns {Integer} y
 */
freakdev.canvas.scene.Object.prototype.getY = function ()
{
	return this.y;
};

/** 
 * returns image tag of the object
 * @returns {Integer} imgTag
 */
freakdev.canvas.scene.Object.prototype.getImgTag = function ()
{
	return this._imgTag;
};

/** 
 * returns opacity of the object
 * @returns {Integer} opacity
 */
freakdev.canvas.scene.Object.prototype.getOpacity = function ()
{
	return this.opacity;
};

/** 
 * returns rotation angle in degree of the object
 * @returns {Integer} rotation
 */
freakdev.canvas.scene.Object.prototype.getRotation = function ()
{
	return this.rotation;
};

/** 
 * returns scale of the object - the two dimensions are return in the 'x' and 'y' property of a simple JS object
 * @returns {Object} scale
 */
freakdev.canvas.scene.Object.prototype.getScale = function ()
{
	return {'x' : this.scaleX, 'y' : this.scaleY};
};

/** 
 * returns scale on X axis of the object
 * @returns {Integer} scale
 */
freakdev.canvas.scene.Object.prototype.getScaleX = function ()
{
	return this.scaleX;
};

/** 
 * returns scale on Y axis of the object
 * @returns {Integer} scale
 */
freakdev.canvas.scene.Object.prototype.getScaleY = function ()
{
	return this.scaleY;
};

/** 
 * returns whether or not the object is active (not implemented yet)
 * @returns {Boolean} focusStatus
 */
freakdev.canvas.scene.Object.prototype.isActive = function ()
{
	return this.activeStatus;
};

/** 
 * returns whether or not the object has focus (not implemented yet)
 * @returns {Boolean} focusStatus
 */
freakdev.canvas.scene.Object.prototype.hasFocus = function ()
{
	return this.focusStatus;
};

/** 
 * returns whether or not the object is visible
 * @returns {Boolean} visibilityStatus
 */
freakdev.canvas.scene.Object.prototype.isVisible = function ()
{
	return this.visibilityStatus;
};




/** 
 * set opacity of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setOpacity = function (value) 
{
	this.opacity = value;
};

/** 
 * set rotation of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setRotation = function (value) 
{
	this.rotation = value;
};

/** 
 * set scale on x axys of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setScaleX = function (value) 
{
	this.scaleX = parseFloat(value);
	var oldWidth = this.getWidth();
	this.setWidth(this._naturalWidth * this.getScaleX());
	this.setX(this.getX() - (this.getWidth() - oldWidth) / 2);
};

/** 
 * set scale on y axys of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setScaleY = function (value) 
{
	this.scaleY = parseFloat(value);
	var oldHeight = this.getHeight();
	this.setHeight(this._naturalHeight * this.getScaleY());
	this.setY(this.getY() - (this.getHeight() - oldHeight) / 2);
};

/** 
 * set scale of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setScale = function (value) 
{
	this.setScaleX(parseFloat(value));
	this.setScaleY(parseFloat(value));
};

/** 
 * set image tag of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setImgTag = function (value) 
{
	this._imgTag = value;
	this._naturalWidth = this._imgTag.width;
	this._naturalHeight = this._imgTag.height;
};

/** 
 * set width of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setWidth = function (value) 
{
	this.getImgTag().width = value;
};

/** 
 * set height of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setHeight = function (value)
{
	this.getImgTag().height = value;
};

/** 
 * set x of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setX = function (value)
{
	this.x = value;
};

/** 
 * set y of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setY = function (value)
{
	this.y = value;
};

/** 
 * set active of the object (not implemented yet)
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setActive = function (status)
{
	if (undefined == status)
		status = true;
	
	this.activeStatus = status;
};

/** 
 * set focud on the object (not implemented yet)
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.focus = function (status)
{
	if (undefined == status)
		status = true;
	
	this.focusStatus = status;
};

/** 
 * set visibility of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setVisible = function (status)
{
	if (undefined == status)
		status = true;
	
	this.visibilityStatus = status;
};
