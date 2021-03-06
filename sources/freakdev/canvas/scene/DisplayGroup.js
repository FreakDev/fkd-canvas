Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.DisplayGroup = Fkd.extend(freakdev.canvas.scene.Object);

/**
 * constructor
 * @param {Integer} x
 * @param {Integer} y
 * @param {Integer} width
 * @param {Integer} height
 */
freakdev.canvas.scene.DisplayGroup.prototype.init = function(x, y, width, height)
{
	/**
	 * atlas of elements that belongs to this display group
	 * @type Array
	 */
	this._atlas = [];
	
	this.targetCanvas = null;
	
	freakdev.canvas.scene.DisplayGroup.superClass.init.call(this, x, y, width, height);
};

/**
 * handle DOM event (mouse, keyboard event, etc...)
 * @param {freakdev.event.Event} e
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.handleDomEvent = function (e)
{
	for (var i=(this._atlas.length - 1); i>=0; i--) {
		var o = this._atlas[i];
		if (false == o.handleDomEvent.call(o, e)) 
			break;
	}	
	
	if (e.canPropagate())
		return freakdev.canvas.scene.DisplayGroup.superClass.handleDomEvent.call(this, e);
	else
		return false;
};

freakdev.canvas.scene.DisplayGroup.prototype._drawToTarget = function (target) { 

	for (var i=0,len=this._atlas.length; i<len; i++) {
		var o = this._atlas[i];
		o.renderTo(this.targetCanvas);
	}
	
};

/**
 * callback for threads in charge of rendering
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype._renderThreadCallback = function ()
{
	var threadBroker = freakdev.thread.Broker.getInstance();

	if (threadBroker.isFinished(this.getId())) {
		this._isRendering = false;
		this.setNeedToRender(false);
		this.renderTo(this.targetCanvas);
	}
};

/**
 * trigger rendering of each child
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.render = function ()
{
	if (this._isRendering)
		return;
	
	var threadBroker = freakdev.thread.Broker.getInstance();

	var threadGroupID = freakdev.utils.Uuid();
	
	for (var i=0,len=this._atlas.length; i<len; i++) {
		var o = this._atlas[i];

    	threadBroker.startThread(Fkd.createDelegate(o.render, o), [], Fkd.createDelegate(this._renderThreadCallback, this), this.getId());
	}
};

freakdev.canvas.scene.DisplayGroup.prototype._prepareTarget = function (target)
{
	if (this.opacity < 1 || 0 != this.rotation || 1 != this.getScaleX() || 1 != this.getScaleY()) {
		
		target.updateContext('globalAlpha', this.opacity);
		
		target.translateToObjectCenter(this);
		
		tmpX = this.getX(); tmpY = this.getY();
		this.setX(- (parseInt((this.getWidth() / 2))));
		this.setY(- (parseInt((this.getHeight() / 2))));

		for (var i=0,len=this._atlas.length; i<len; i++) {
			var o = this._atlas[i];
			o.setX(o.getX() + this.getX());
			o.setY(o.getY() + this.getY());
		}
		
		target.rotate(this.rotation);
		
		target.scale(this.getScaleX(), this.getScaleY());
	}	
};

freakdev.canvas.scene.DisplayGroup.prototype._restoreTarget = function (target)
{
	if (this.opacity < 1 || 0 != this.rotation || 1 != this.getScaleX() || 1 != this.getScaleY()) {
		
		target.restore(4);
		
		this.setX(tmpX);
		this.setY(tmpY);
		
		for (var i=0,len=this._atlas.length; i<len; i++) {
			var o = this._atlas[i];
			o.setX(o.getX() + this.getX());
			o.setY(o.getY() + this.getY());
		}		
		
	}	
};

/**
 * in charge all the rendering process for himself and its child and printing the rendered content on a target (canvas)
 * this method is called during the rendering process managed by the freakdev.canvas.Canvas Object 
 * @param {freakdev.canvas.Canvas} canvas
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.renderTo = function (canvas) 
{	
	if (undefined != canvas)
		this.targetCanvas = canvas;
	
	freakdev.canvas.scene.DisplayGroup.superClass.renderTo.call(this, this.targetCanvas);
};

/**
 * push an element at the end of the children stack (it will overlay all previously added children)
 * @param {freakdev.canvas.scene.Object} o
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.push = function (o)
{
	o.setContainer(this);
	this._atlas.push(o);
};

/**
 * remove the last element of the children stack
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.pop = function ()
{
	var o = this._atlas.pop();
	o.setContainer(null);
};

/**
 * add en element at the top of the children stack (it will be overlayed by all previously added children)
 * @param {freakdev.canvas.scene.Object} o
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.unshift = function (o)
{
	o.setContainer(this);
	this._atlas.unshift(o);
};

/**
 * remove the first element from the children stack
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.shift = function ()
{
	var o = this._atlas.shift();
	o.setContainer(null);
};

/**
 * insert an element at a given place in the children stack
 * @param {freakdev.canvas.scene.Object} o
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.insertAt = function (i, o)
{
	o.setContainer(this);
	this._atlas.splice(i, 0, o);
};

/**
 * remove an element at a given place in the children stack
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.removeAt = function (i)
{
	var o = this._atlas.splice(i, 1);
	o[0].setContainer(null);
};

