Fkd.createNamespace('freakdev.canvas');

freakdev.canvas.Canvas = function ()
{	
	this.init.apply(this, arguments);
};

/**
 * constructor
 * @param {String} [optional] domCanvasId - the id attribute of a already existing canvas node
 */
freakdev.canvas.Canvas.prototype.init = function (domCanvasId)
{	
	/**
	 * is the canvas domobject has already been inserted to DOM
	 * @type {Boolean}
	 */
	this.insertedToDom = false;
	
	/**
	 * a placeholder dom node for the canvas element
	 * @type {DOMNode}
	 */
	this._domPlaceholder = null;	
	
	/**
	 * DOM node
	 * @type {DOMNode} 
	 */
	this.canvasNode = null;

	/**
	 * reference to the render timer
	 * @type {Integer?}
	 */
	this._autoRenderTimer = null;
	
	/**
	 * is the canvas beeing rendering itself
	 * @type {Boolean}
	 */
	this._isRendering = false;
	
	/**
	 * Frame per seconds
	 * @type {Integer}
	 */
	this._fps = 100;
	
	/**
	 * the scene
	 * @type {freakdev.canvas.scene.Scene}
	 */
	this.scene = null;	
	
	this.getCanvas(undefined != domCanvasId ? domCanvasId : false);
	this._initScene();
	this._initEvent();
};

/**
 * initialize scene object
 * @returns void
 */
freakdev.canvas.Canvas.prototype._initScene = function ()
{
	this.scene = new freakdev.canvas.scene.Scene(this);
	this.scene.setId('scene');
};

/** 
 * initialize DOMEvent handled by this canvas
 * @returns void
 */
freakdev.canvas.Canvas.prototype._initEvent = function ()
{
	var eventListener = Fkd.createDelegate(function (event) {
		var e = freakdev.event.EventManager.getInstance().domEventFactory(event, this);
		(Fkd.createDelegate(this.scene.handleEvent, this.scene))(e);
	}, this);
	
	for (var i in freakdev.event.DOM_EVENTS) {
		this.getCanvas().addEventListener(freakdev.event.DOM_EVENTS[i], eventListener, true);
	}
};

/**
 * Deprecated
 */
freakdev.canvas.Canvas.prototype.propagateEvent = function (event)
{
	this.scene.handleEvent.call(this, event);
};

/**
 * get or create DOMNode 
 * @param {String} idAttr id given, this function will get the canvas DOMNode with a matching id attribute 
 * @returns {DOMNode} canvasNode;
 */
freakdev.canvas.Canvas.prototype.getCanvas = function (idAttr)
{
	if (!this.canvasNode) {
		if (idAttr) {
			this.canvasNode = DomHelper.get(idAttr);
			this.insertedToDom = true;
		} else {
			this.canvasNode = document.createElement('canvas');
		}
	}
	return this.canvasNode;
};

/**
 * get the context from the canvas DOMNode object
 * @returns
 */
freakdev.canvas.Canvas.prototype.getContext = function ()
{
	return this.getCanvas().getContext('2d');
};

/**
 * resize the canvas
 * @param {Integer} width
 * @param {Integer} height
 * @returns void
 */
freakdev.canvas.Canvas.prototype.resize = function (width, height)
{
	this.getCanvas().width = width;
	this.getCanvas().height = height;
	
	this.scene.resize(width, height);
};

/**
 * [not implemented yet] returns an object which has been added to the scene's object tree 
 * @param {String} queryString
 * @returns {freakdev.canvas.scene.Object}
 */
freakdev.canvas.Canvas.prototype.query = function (queryString)
{
	
};

freakdev.canvas.Canvas.prototype.setDomPlaceholder = function (ph) 
{
	if ('string' == typeof ph)
		ph = DomHelper.get(ph);
	
	if (null == ph)
		ph = DomHelper.getByTagName('body').item(0);
	
	this._domPlaceholder = ph;
};

freakdev.canvas.Canvas.prototype.getDomPlaceholder = function ()
{
	return this._domPlaceholder;
};

/**
 * render the scene, insert the canvas to the dom if needed
 * if canvas node is not already present in the dom, it try 
 * to append it to the dom node passed in arguments or if 
 * none were given, it append it to the body
 * @returns void
 */
freakdev.canvas.Canvas.prototype.render = function ()
{
	this._isRendering = true;
	
		if (!this.scene.isRendering()) {
	
		if (this.scene.isRenderNeeded()) {
			this.scene.renderTo(this);
		}
	}
	
	if (!this.insertedToDom) {
		this.insertedToDom = true;
		var pNode;
		if (arguments.length)
			pNode = this.setDomPlaceholder(arguments[0]);
		else
			pNode = this.getDomPlaceholder();
			
		if (!pNode)
			pNode = DomHelper.getByTagName('body').item(0);

		pNode.appendChild(this.getCanvas());
	}

	this._isRendering = false;
};

/**
 * wrapper for method CanvasRenderingContext2D.save()
 * @returns void
 */
freakdev.canvas.Canvas.prototype.save = function () 
{
	this.getContext().save();
};

/**
 * wrapper for method CanvasRenderingContext2D.restore()
 * if nb is given the restore function  will be called nb times
 * @param {Integer} nb
 * @returns void
 */
freakdev.canvas.Canvas.prototype.restore = function (nb) 
{
	if (undefined == nb)
		var nb = 1;

	for (var i=0; i<nb; i++) {
		this.getContext().restore();
	}
};

/**
 * generic setter for CanvasRenderingContext2D property
 * @param {String} field - the name of the property
 * @param {Mixed} value - the value to assign
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.updateContext = function (field, value, autoSave)
{
	if (false !== autoSave)
		this.save();
		
	var ctx = this.getContext();
	ctx[field] = value;
	
};

/**
 * wrapper for method CanvasRenderingContext2D.translate()
 * @param {Integer} x
 * @param {Integer} y
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.translateTo = function (x, y, autoSave) 
{
	if (false !== autoSave)
		this.save();	
	
	var ctx = this.getContext();
	ctx.translate(x, y);
};

/**
 * call the translateTo method with the coord of the given object "center" 
 * @param {freakdev.canvas.scene.Object} object
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.translateToObjectCenter = function (object, autoSave) 
{	
	var x = object.getX() + parseInt(object.getWidth() / 2);
	var y = object.getY() + parseInt(object.getHeight() / 2);
	
	this.translateTo(x, y, autoSave);
};

/**
 * wrapper for method rotate()
 * @param {Integer} angle - in degree
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.rotate = function (angle, autoSave)
{
	if (false !== autoSave)
		this.save();
	
	var ctx = this.getContext();
	ctx.rotate(angle * Math.PI / 180);
};

/**
 * wrapper for method scale()
 * @param {Integer} scale - the same scale will be applied to width and height
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.scale = function (scale, autoSave)
{
	this.scaleXY(scale, scale, autoSave);
};

/**
 * wrapper for method scale()
 * @param {Integer} scaleX
 * @param {Integer} scaleY
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.scaleXY = function (scaleX, scaleY, autoSave) 
{
	if (false !== autoSave)
		this.save();
	
	var ctx = this.getContext();
	ctx.scale(scaleX, scaleY);
};

/**
 * starts rendering at regular intervals (fps)
 * @param {Integer} fps - the value of fps can be set here the default (if it has never been set anywhere else) value is 100 fps
 * @returns void
 */
freakdev.canvas.Canvas.prototype.startAutoRender = function (fps)
{
	if (undefined != fps)
		this.setFps(fps);
	
	var interval = parseInt(1000 / this.getFps());
	
	this._autoRenderTimer = setInterval(Fkd.createDelegate(this.render, this), interval);
};

/**
 * change fps value
 * @param {Integer} fps - the value of fps can be set here the default (if it has never been set anywhere else) value is 100 fps
 * @returns void
 */
freakdev.canvas.Canvas.prototype.setFps = function (fps)
{
	this._fps = fps;
};

/**
 * get the fps
 * @param {Integer} fps
 * @returns {Integer}
 */
freakdev.canvas.Canvas.prototype.getFps = function ()
{
	return this._fps;
};


/**
 * stop auto rendering (at regular interval)
 * @returns
 */
freakdev.canvas.Canvas.prototype.stopAutoRender = function () 
{
	clearInterval(this._autoRenderTimer);
};


