Fkd.createNamespace('freakdev.math');

freakdev.math.Point = function ()
{
	this.init.apply(this, arguments);
};

freakdev.math.Point.prototype.init = function (x, y)
{
	this.x = x;
	this.y = y;
}