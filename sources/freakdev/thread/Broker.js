Fkd.createNamespace('freakdev.thread');

// design pattern singleton

// private
freakdev.thread.Broker = function () 
{
    this.init.apply(this, arguments);
};

freakdev.thread.Broker.instance;

freakdev.thread.Broker.getInstance = function ()
{
	if (!freakdev.thread.Broker.instance)
		freakdev.thread.Broker.instance = new freakdev.thread.Broker();
	
	return freakdev.thread.Broker.instance;
};

freakdev.thread.Broker.prototype.init = function () 
{
	this.maxSimul = 10;
	this.nbStarted = 0;
	this.threads = [];
	this.threadStack = [];
	this.timerID;
	this.timerOn = false;
};



freakdev.thread.Broker.prototype.setMaxSimultaneous = function (value) 
{
	this.maxSimul = parseInt(value);
};

freakdev.thread.Broker.prototype.startTimer = function ()
{
	this.timerOn = true;
	this.timerID = setInterval(Fkd.createDelegate(this.processStack, this), 1);
};

freakdev.thread.Broker.prototype.stopTimer = function ()
{
	this.timerOn = false;
	clearInterval(this.timerID);
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
	
	if (!this.timerOn)
		this.startTimer();
};

freakdev.thread.Broker.prototype.processStack = function ()
{
	if (this.nbStarted >= this.maxSimul)
		return;
	
	this.nbStarted++;
	
	if (!this.threadStack[0]) {
		this.stopTimer();
		return;
	}
	
	var groupID = this.threadStack[0];	
	
	if (!this.threads[groupID])
		return; 
	
	var t = this.threads[groupID].shift();
	
	var r = t.run();
	
	if (t.callback.scope && t.callback.fn) {
		scope = t.callback.scope;
		fn = t.callback.fn;
	} else {
		scope = window;
		fn = t.callback;
	}	
	
	this.nbStarted--;
	
	if (0 == this.threads[groupID].length) {
		this.threads[groupID] = null;
		this.threadStack.splice(0, 1);
	}
	
	if (0 == this.threadStack.length) {
		this.stopTimer();
	}
	
	fn.call(scope, r);
};

freakdev.thread.Broker.prototype.isFinnished = function (groupID) 
{
	var r = (this.threadStack.indexOf(groupID.toString()) == -1 ? true : false);
	return r;
};
