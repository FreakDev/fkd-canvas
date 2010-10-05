Fkd.createNamespace('freakdev.canvas.image');

// Abstract
freakdev.canvas.image.Transformation = function () {
	
	// check if sub instance have implemented following method
	var methods = [
	    'apply'
	];
	
	for (var i in methods) {
		if (undefined == this[methods[i]])
			throw Error (new String('Sub Class of freakdev.canvas.image.filter.FilterAbstract must implements ').concat(methods[i]));
	}
	
}