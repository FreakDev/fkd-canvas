Fkd.createNamespace('freakdev.canvas');

freakdev.canvas.Canvas = function ()
{	
	this.init.apply(this, arguments);
};

freakdev.canvas.Canvas.CLICK = 'click';
freakdev.canvas.Canvas.DBLCLICK = 'dblclick';

freakdev.canvas.Canvas.MOUSE_DOWN = 'mousedown';
freakdev.canvas.Canvas.MOUSE_MOVE = 'mousemove';
freakdev.canvas.Canvas.MOUSE_OUT = 'mouseout';
freakdev.canvas.Canvas.MOUSE_OVER = 'mouseover';
freakdev.canvas.Canvas.MOUSE_UP = 'mouseup';

freakdev.canvas.Canvas.KEY_DOWN = 'keydown';
freakdev.canvas.Canvas.KEY_PRESS = 'keypress';
freakdev.canvas.Canvas.KEY_UP = 'keyup';

freakdev.canvas.Canvas.EVENTS = ['click', 'dblclick', 'mousedown', 
                                 'mousemove', 'mouseout', 'mouseover', 
                                 'mouseup', 'keydown', 'keypress', 'keyup'];

freakdev.canvas.Canvas.prototype.init = function (domCanvasId)
{	
		
	// shorthands
	this.Dom = freakdev.utils.Dom;
	this.Debug = freakdev.utils.Debug;	

	this.insertedToDom = false;
	
	this.canvasNode;
	this.getCanvas(undefined != domCanvasId ? domCanvasId : false);

	this._autoRenderTimer;
	this._isRendering;
	
	this.scene;	
	this._initScene();
	this._initEvent();
};

freakdev.canvas.Canvas.prototype._initScene = function ()
{
	this.scene = new freakdev.canvas.scene.Scene(this.getCanvas());
	this.scene.setId('scene');
};

freakdev.canvas.Canvas.prototype._initEvent = function ()
{
	for (var i in freakdev.canvas.Canvas.EVENTS) {
		this.getCanvas().addEventListener(freakdev.canvas.Canvas.EVENTS[i], Fkd.createDelegate(this.scene.handleEvent, this.scene), true);
	}
};

freakdev.canvas.Canvas.prototype.getCanvas = function (idAttr)
{
	if (!this.canvasNode) {
		if (idAttr) {
			this.canvasNode = this.Dom.get(idAttr);
			this.insertedToDom = true;
		} else {
			this.canvasNode = document.createElement('canvas');
		}
	}
	return this.canvasNode;
};

freakdev.canvas.Canvas.prototype.getContext = function ()
{
	return this.getCanvas().getContext('2d');
};

freakdev.canvas.Canvas.prototype.resize = function (width, height)
{
	this.getCanvas().width = width;
	this.getCanvas().height = height;
	
	this._initScene();
};

freakdev.canvas.Canvas.prototype.query = function (queryString)
{
	
};

freakdev.canvas.Canvas.prototype.render = function ()
{
	this._isRendering = true;
	
	if (this.scene.isRenderNeeded()) {
		this.scene.renderTo(this.getContext());
	}
	
	if (!this.insertedToDom) {
		this.insertedToDom = true;
		var pNode;
		if (arguments.length)
			pNode = this.Dom.get(arguments[0]);
			
		if (!pNode)
			pNode = this.Dom.getByTagName('body').item(0);

		pNode.appendChild(this.getCanvas());
	}

	this._isRendering = false;
};

freakdev.canvas.Canvas.prototype.runAutoRender = function (fps)
{
	if (undefined == fps)
		fps = 40;
	
	var interval = parseInt(1000 / fps);
	
	this._autoRenderTimer = setInterval(Fkd.createDelegate(this.render, this), interval);
};

freakdev.canvas.Canvas.prototype.stopAutoRender = function () 
{
	clearInterval(this._autoRenderTimer);
};

