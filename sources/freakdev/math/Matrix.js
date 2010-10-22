Fkd.createNamespace('freakdev.math');

freakdev.math.Matrix = function ()
{
	this.init.apply(this, arguments);
};

freakdev.math.Matrix.prototype.init = function (data) 
{
	if (typeof data != 'array')
		throw new Error('Invalid Data');
};