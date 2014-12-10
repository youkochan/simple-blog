/**
 * ver: 0.1
 * by youkochan
 *
 * 分析网页整体结构
 */

(function youkochan(){
	function clearAllNode(parentNode){
		while (parentNode.firstChild) {
			var oldNode = parentNode.removeChild(parentNode.firstChild);
			oldNode = null;
		}
	}

	function buildNewBody(node, level){
		for(var i=0, len=node.childNodes.length; i<= len-1; i++){
			if(node.childNodes[i].nodeType != 3){ // not text node

				var newNode = document.createElement('div');
				var str = "";
				for(var j=0; j<=level-1; j++){str="--"+str;}
				var newText = document.createTextNode(str+node.childNodes[i].tagName);
				
				newNode.appendChild(newText);
				newBody.appendChild(newNode);

				if(node.childNodes[i].childNodes != null)
					buildNewBody(node.childNodes[i], level+1);
			}
		}
	}

	var oldBody = document.body;
	var newBody = document.createElement('body');

	buildNewBody(oldBody, 0);

	clearAllNode(document.body);
	clearAllNode(document.head);

	document.body = newBody;


})();