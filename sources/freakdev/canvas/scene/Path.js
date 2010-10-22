Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Path = Fkd.extend(freakdev.canvas.scene.Shape);

freakdev.canvas.scene.Path.prototype.init = function (points)
{
	freakdev.canvas.scene.Path.superClass.init.call(this);
	
	this._points = (undefined == points ? [] : points);
	
	/**
	 * internal canvas used for rendergin purpose only
	 * @type DOMCanvasNode
	 */
	this._canvas = document.createElement('canvas');
	
	/**
	 * pointer to store which points have been already rendered
	 * @type Integer
	 */
	this._renderIndex = 0;
	
	this.targetCanvas = null;
	
};

freakdev.canvas.scene.Path.setTarget = function (canvas) 
{
	this.targetCanvas = canvas;
};

freakdev.canvas.scene.Path.prototype.beginPath = function ()
{
	this.targetCanvas.getContext('2d').beginPath();
};

freakdev.canvas.scene.Path.prototype.closePath = function ()
{
	this.targetCanvas.getContext('2d').closePath();
};

freakdev.canvas.scene.Path.prototype.draw = function (pts, ctx)
{
	if (undefined == ctx)
		ctx = this.targetCanvas.getContext('2d');

	if (undefined == pts)
		pts = this._points;	
	
	if (pts.length) {
		ctx.moveTo(pts[0].x, pts[0].y);
		for (var i=1,len=pts.length; i<len; i++) {
			ctx.lineTo(pts[i].x, pts[i].y);
		}
	}
};

freakdev.canvas.scene.Path.prototype.render = function ()
{
	if (this._isRendering)
		return;
	
	this._isRendering = true;
	this.setNeedToRender(false);
	
	var ctx = this._canvas.getContext('2d');
		
	var tmpPt = this._points.slice(this._renderIndex);
	this._renderIndex = this._points.length > 2 ? this._points.length - 1 : 0;
	
	if (tmpPt.length) {
		this.draw(tmpPt, ctx);
		ctx.stroke();
		
		var img = new Image();
		
		img.onload = Fkd.createDelegate(function () {
			this.setImgTag(img);
			this._isRendering = false;
		}, this);
		img.src = this._canvas.toDataURL();
	}
	
	delete(ctx); delete(tmpPt);
	
};

freakdev.canvas.scene.Path.prototype.push = function (pt)
{
	this.setNeedToRender();
	
	this._points.push(pt);	
};

freakdev.canvas.scene.Path.prototype.setContainer = function (container)
{
	freakdev.canvas.scene.Path.superClass.setContainer.call(this, container);
	
	if (this._container) {
		this.setWidth(this._container.getWidth());
		this.setHeight(this._container.getHeight());
		this.setX(this._container.getX());
		this.setY(this._container.getY());
	}		
};

freakdev.canvas.scene.Path.prototype.setWidth = function (w) 
{
	this._canvas.width = w;
};

freakdev.canvas.scene.Path.prototype.setHeight = function (h) 
{
	this._canvas.height = h;
};
