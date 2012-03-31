/****
Segura markup parser JavaScript implementation.

Copyright(C) 2012 Alexander Forselius

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*****/
function QmlNode () {
   this.children = [];
   this.tag = "";
   this.content = "";
   this.type = "";
}
var QmlMode = {
	IDLE : 0,
	ENTITY : 1,
	SPACE : 2,
	CONTENT : 3
};
/********
QML Document object
@class
********/
function QmlDocument(text) {
   this.text = null;
   this.documentElement = new QmlNode();
   /**********
   Parses a file
   @function 
   **********/
   this.parse = function (text) {
		var inString = false;
		var currentNode = this.documentElement;
		for(var i = 0; i < text.length; i++) {
			var token = text.charAt(i);
			
			switch(token) {
				case '"':
					inString = !inString;
					break;
				// All value tokens
				case '@':
				case '^':
				case '¤':
				case '$':
				case '§':
				case '%':
				case '*':
					if(mode == QmlMode.SPACE) {
						currentNode.type = token;
					
						// TODO add things here
						mode = QmlMode.CONTENT;
					}
					break;
				case '#': 
					// create new child
					var child = new QmlNode();
					if (currentNode != null) {
						currentNode.children.push(child);
						child.parent = currentNode.parent;
					}
					this.currentNode = child;
					child.type = token;
					
					break;
				default:
					switch(mode) {
						case QmlMode.CONTENT:	
							currentNode.tag += token;
						case QmlMode.SPACE:
							break;
						case QmlMode.IDLE:
							break;
						case QmlNode.ENTIY:
							if(token == ' ' && (!inString)) {
								mode = QmlMode.SPACE;
								break;
							}
							currentNode.content += (token);
							break;
					}
					break;
                
           }
       }
   };
}