Fkd.createNamespace('freakdev.utils');

freakdev.utils.Dom = {
	/**
	 * get a DOMObject matching the given id attribute 
	 * @param {String} idAttr
	 * @returns {DOMObject} object
	 */
	get: function (idAttr) {
		return document.getElementById(idAttr);
	},
	/**
	 * get a list of DOMNode matching the given name attribute
	 * @param {String} name
	 * @returns {NodeList} object
	 */
	getByTagName: function (name) {
		return document.getElementsByTagName(name);
	}
};

/**
 * a shorthand for freakdev.utils.Dom. Is visible only insode the library
 * @type freakdev.utils.Dom
 */
var DomHelper = freakdev.utils.Dom; 