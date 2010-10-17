Fkd.createNamespace('freakdev.utils');

freakdev.utils.Matrix = function ()
{
	this.init.apply(this, arguments);
};

freakdev.utils.Matrix.prototype.init = function (data) 
{
	if (typeof data != 'array')
		throw new Error('Invalid Data');
};