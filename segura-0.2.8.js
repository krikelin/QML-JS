/****
Segura markup parser JavaScript implementation.

Copyright(C) 2012 Alexander Forselius

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:
*****/
/***
@module Models
**/
models = function() {}
models.prototype = new Object();
/***
An event
***/
models.prototype.Event = function(type, callback) {
	this._type = type;
	this._callback = callback;
	this.__defineGetter__("type", function () {
		return this._type;
	});
	this.__defineGetter__("callback", function () {
		return this._callback;
	});
	
	
};
/**
An observable
***/
models.prototype.Observable = function () {
	this._observers = [];
	this.__defineGetter__("observers", function () {
		return this._observers;
	});
	this.observe = function(type, callback) {	
		var event = new models.Event(type, callback);
		this.observers.push(event);
	};
	this.notify = function(event, data) {
		for(var i = 0; i < this._observers.length; i++) {
			var observer = this._observers[i];
			console.log(observer);
			if(observer.type == event) {
				observer.callback(data); // Fire the callback	
			}
		}
	};
};
var models = new models();
models.EVENT = {
	NEWNODE : 1,
	STRING : 2
};

function QmlNode () {
	this._children = [];
	this._parent = null;
	this._tag = "";
	this._adjective = "";
	this._content = "";
	this._attribute = "";
	this.__defineGetter__("attribute", function() {
		return this._attribute;
	});
	this.__defineSetter__("attribute", function (val) {
		this._attribute = val;
	});
	
	this._type = "";
	this.__defineGetter__("type", function () {
		return this._type;
	});
	this.__defineSetter__("type", function (val) {
		 this._type = val;
	});
	this.__defineGetter__("children", function () {
		return this._children;
	});
	this.__defineGetter__("tag", function() {
		return this._tag;
	});
	this.__defineGetter__("content", function() {
		return this._content;
	});
	this.__defineSetter__("tag", function(val) {
		this._tag = val;
		console.log("C");
		this.node.innerHTML = "<b> " + this._tag + "</b>" + this._content + "</b>";
		console.log(this.node);
	});
	this.__defineSetter__("content", function(val) {
		this._content = val;
		this.node.innerHTML = "<b> " + this._tag + "</b>" + this._content + "</b>";
		console.log(this.node);
	});
	this.__defineGetter__("data", function() {
		var rootData = {};
		var curData = {};
		var curObject = this;
		this.it = 0;
		
		var curData = rootData;
		var i = 0;
		while(true) {
			
			if(curObject.children.length < 1 || curObject.it >  curObject.children.length - 1) {
				if(typeof curObject.parent == "undefined") {
					break;
				}
				curObject = curObject.parent;
				curData = curData["parent"];
				continue;
			} else {
				
				if(curObject["it"] === undefined || isNaN(curObject["it"])) {
					
					curObject.it = 0;
				
				}
				curObject = curObject.children[curObject.it];			
				curObject.it++;
			}
		
			curData[curObject.tag] = curObject.content;
			
			
			
			
		}
		return curData;
	});
   
	this.node = document.createElement("li");
   
}
var QmlMode = {
	IDLE : 0,
	ENTITY : 1,
	SPACE : 2,
	ATTRIBUTE: 3,
	CONTENT : 4
};
/***
QMLEventArgs
@class
*/
function QmlEventArgs(node, level) {
	
	this._node = node;
	this._level = level;
	this.__defineGetter__("level", function () {
		return this._level;
	});
	this.__defineGetter__("node", function () {
		return this._node;
	});
}
QmlDocument.prototype = new models.Observable();
/********
QML Document object
@class
********/
function QmlDocument(text, callback) {
	this._text = text;
	this.documentElement = new QmlNode();
	
	this.__defineGetter__("text", function () {
		return this._text;
	});
	this.__defineSetter__("text", function (val) {
		this._text = val;
		this.parse();
	});
	this._callback = callback;
	this.__defineGetter__("callback", function () {
		return this._callback;
	});
	this.__defineSetter__("callback", function (val) {
		this._callback = val;
	});
	var level = 0;
	/**********
	Parses a file
	@function 
	@param callback A callback raised when entering a level, allows for event integration
	**********/
	this.parse = function () {
		var currentAttributes = [];
		var currrentAttribute = "";
		var text = this._text;
		var inString = false;
		var preMode = 0;
		var mode = QmlMode.IDLE;
		var currentNode = this.documentElement;
		currentNode.parent = this;
		for(var i = 0; i < text.length; i++) {
			
			var token = text.charAt(i);
			
			switch(token) {
			case '"':
				inString = !inString;
				break;
			// All value tokens
			case ':':
				// Attribute case
				if (!inString) {
					if(currentNode != null) {
						preMode = mode; 				// Set pre mode to fall back to after attribute is ended
						mode = QmlMode.ATTRIBUTE;		// Set mode to attribute						
					}
				}
				break;
			case '@':
			case '^':
			case '¤':
			case '$':
			case '§':
			case '%':
			case '*':
				if(mode == QmlMode.SPACE) {
					currentNode.type = token;
		
					console.log("F");
					// TODO add things here
					mode = QmlMode.CONTENT;
				}
				break;
			case '#': 
				level++;
				mode = QmlMode.ENTITY;
				
				// create new child
				var child = new QmlNode();
				child.attribute = this.currentAttribute;
				currentAttribute = "";
				if (currentNode != null) {
						
					currentNode._children.push(child);
					child._parent = currentNode;
				}
				currentNode = child;
				child.type = token;
			//	console.log("D");
				//console.log(mode);
				break;
			default:
			//	console.log(mode);
				console.log("CF " +mode);
				switch(mode) {
					case QmlMode.ATTRIBUTE:
						if((token == ' ') && !inString) {
							mode = preMode;
							break;
						}
						currentAttribute += token;
						break;
					case QmlMode.ENTITY:
						console.log(token + mode);
				//		console.log("sF");
						if((token == ' ' || token == ',' || token == '.') && !inString) {
							mode = QmlMode.SPACE;
							console.log(mode);
							console.log(token);
							
							break;
						}
						
						currentNode.tag += token;
						
						break;
					case QmlMode.CONTENT:	
						console.log("CONTENT");
						if((token == '.' || token == ' ' || token == ',') && !inString) {
							// End the content
						
							if(currentNode != null) {
								console.log("PARENT");
								
								// Raise callback
								var qmlEventArgs = new QmlEventArgs(currentNode, level);
								this.notify(models.EVENT.NEWNODE, qmlEventArgs);
								level--;	
								
								currentNode = currentNode._parent;
								
							}
							mode = QmlMode.IDLE;
							break;
						}
						currentNode.content += (token);
						
						break;
					case QmlMode.SPACE:
						
						break;
					case QmlMode.IDLE:
					
						break;
					
						
				
				}
			
			}
		}
	};
}