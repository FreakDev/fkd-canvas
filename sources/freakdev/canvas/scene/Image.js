Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Image = Fkd.extend(freakdev.canvas.scene.Object);
/**
 * constructor
 * @param {String} domId - id attribute of an image tag
 * @param {Integer} x 
 * @param {Integer} y
 */
freakdev.canvas.scene.Image.prototype.init = function(domId, x, y)
{
	x = undefined == x ? 0 : x;
	y = undefined == y ? 0 : y;
	
	if (domId) {
		var node = freakdev.utils.Dom.get(domId);
		if (node) {
			freakdev.canvas.scene.Image.superClass.init.call(this, x, y);
			this.setImgTag(node);
			return;
		}
	}
	
	throw new Error('invalid tag');
};
