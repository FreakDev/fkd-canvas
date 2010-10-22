Fkd.createNamespace('freakdev.thread');

// design pattern singleton

// private
freakdev.thread.Broker = function () 
{
    this.init.apply(this, arguments);
};

freakdev.thread.Broker.instance = null;

freakdev.thread.Broker.getInstance = function ()
{
	if (!freakdev.thread.Broker.instance)
		freakdev.thread.Broker.instance = new freakdev.thread.Broker();
	
	return freakdev.thread.Broker.instance;
};

freakdev.thread.Broker.prototype.init = function () 
{
	this.nbStarted = 0;
	this.threads = [];
	this.threadStack = [];
};

freakdev.thread.Broker.prototype.startThread = function (fn, params, callback, groupID)
{
//	if (fn)
//		throw new Error('No fn given');	
	
	if (undefined == groupID)
		groupID = new Date().getTime();
	
	groupID = groupID.toString();
	
	if (undefined == params)
		params = [];
	
	if (undefined == callback)
		callback = function () {};
	
	var t = new freakdev.thread.Thread(fn, params, callback);
		
	if (undefined == this.threads[groupID] || null == this.threads[groupID]) {
		this.threads[groupID] = [t];
		this.threadStack.push(groupID);
	}		
	else
		this.threads[groupID].push(t);
		
	var script = document.createElement("script");
	script.src  = "data:text/javascript,";
	script.onload = Fkd.createDelegate(function () {
		document.body.removeChild(script);
		this.processStack();
	}, this);
	document.getElementsByTagName('body').item(0).appendChild(script);
	
};

freakdev.thread.Broker.prototype.processStack = function ()
{
	
	this.nbStarted++;
	
	var groupID = this.threadStack[0];	
	
	if (!this.threads[groupID])
		return; 
	
	var t = this.threads[groupID].shift();
	
	var r = t.run();
		
	this.nbStarted--;
	
	if (0 == this.threads[groupID].length) {
		delete(this.threads[groupID]);
		this.threadStack.splice(0, 1);
	}
	
	t.callback(r);
};

freakdev.thread.Broker.prototype.isFinished = function (groupID)
{
	var r = (this.threadStack.indexOf(groupID.toString()) == -1 ? true : false);
	return r;
};
