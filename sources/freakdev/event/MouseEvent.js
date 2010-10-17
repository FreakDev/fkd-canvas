Fkd.createNamespace('freakdev.event');

freakdev.event.MouseEvent = Fkd.extend(freakdev.event.Event);

freakdev.event.MouseEvent.LEFT_BUTTON;
freakdev.event.MouseEvent.RIGHT_BUTTON;

freakdev.event.MouseEvent.prototype.init = function (domMouseEvent, canvas)
{
	this.canvas = canvas || domMouseEvent.target;
	this.type = domMouseEvent.type;
	
	this.button = (1 == domMouseEvent.type 
					? freakdev.event.MouseEvent.LEFT_BUTTON 
					: freakdev.event.MouseEvent.RIGHT_BUTTON);

	//this.specialKeys;	
		
	this.x = domMouseEvent.layerX - domMouseEvent.target.offsetLeft;
	this.y = domMouseEvent.layerY - domMouseEvent.target.offsetTop;
	
};