/**
 * ver: 0.2
 * by youkochan
 *
 * 分析网页整体结构，加入图形化功能
 * 借鉴了 http://bl.ocks.org/mbostock/4063550
 */

(function youkochan(){
	function loadScript(sScriptSrc, callbackfunction)   
	{
		//gets document head element  
		var oHead = document.getElementsByTagName('head')[0];  
    	if(oHead) 
    	{  
    		//creates a new script tag        
    		var oScript = document.createElement('script');  
        	
        	//adds src and type attribute to script tag  
        	oScript.setAttribute('src',sScriptSrc);  
        	oScript.setAttribute('type','text/javascript');  
        	
        	//calling a function after the js is loaded (IE)  
        	var loadFunction = function()  
            {
            	if (this.readyState == 'complete' || this.readyState == 'loaded')  
            	{  
                    callbackfunction();   
                }  
            };  
        	
        	oScript.onreadystatechange = loadFunction;  
        	
        	//calling a function after the js is loaded (Firefox)  
       		oScript.onload = callbackfunction;  

        	//append the script tag to document head element          
        	oHead.appendChild(oScript);  
    	}  
	}  

	function clearAllNode(parentNode) {
		while (parentNode.firstChild) {
			var oldNode = parentNode.removeChild(parentNode.firstChild);
			oldNode = null;
		}
	}

	function draw (root) {
		var diameter = 960;

		var tree = d3.layout.tree()
		    .size([360, diameter / 2 - 120])
		    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

		var diagonal = d3.svg.diagonal.radial()
		    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

		var svg = d3.select("body").append("svg")
		    .attr("width", diameter)
		    .attr("height", diameter - 150)
		  	.append("g")
		    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

		var nodes = tree.nodes(root),
	      	links = tree.links(nodes);

	  	var link = svg.selectAll(".link")
	      	.data(links)
	    	.enter().append("path")
	      	.attr("class", "link")
	      	.attr("d", diagonal);

	  	var node = svg.selectAll(".node")
	      	.data(nodes)
	    	.enter().append("g")
	      	.attr("class", "node")
	      	.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

	  	node.append("circle")
	      	.attr("r", 4.5);

	  	node.append("text")
	      	.attr("dy", ".31em")
	      	.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
	      	.attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
	      	.text(function(d) { return d.name; });

	    d3.select(self.frameElement).style("height", diameter - 150 + "px");
	}

	function buildData(node){ // 从body开始深度优先便利
		var data = {};

		data["name"] = node.tagName;

		if(node.childNodes != null){
			var children = new Array();
			for(var i=0, len=node.childNodes.length; i<= len-1; i++){
				if(node.childNodes[i].nodeType != 3){ // not text node
					children.push(buildData(node.childNodes[i]));
				}
			}
			if(children.length != 0)
				data["children"] = children;
		}

		return data;
	}

	function afterLoad(){

		var data = buildData(oldBody);
		clearAllNode(oldBody);

		document.body = newBody;
		
		var data1 = {
			"name" : "test",
			"children" : [
				{"name": "AgglomerativeCluster", "size": 3938},
      			{"name": "CommunityStructure", "size": 3812},
      			{"name": "HierarchicalCluster", "size": 6714},
      			{"name": "MergeEdge", "size": 743}
			]
		};

		draw(data);
		clearAllNode(document.head);

		var graphStyle = document.createElement('style');
		graphStyle.type = "text/css";

		try{
			graphStyle.appendChild(document.createTextNode(".node circle {fill: #fff; stroke: steelblue; stroke-width: 1.5px;}.node {font: 10px sans-serif;} .link {fill: none; stroke: #ccc; stroke-width: 1.5px;} body {text-align: center;};"));
		} catch (ex) {
			graphStyle.styleSheet.cssText = ".node circle {fill: #fff; stroke: steelblue; stroke-width: 1.5px;}.node {font: 10px sans-serif;} .link {fill: none; stroke: #ccc; stroke-width: 1.5px;} body {text-align: center;};";
		}
		document.head.appendChild(graphStyle);

	}

	var oldBody = document.body;
	var newBody = document.createElement('body');
	
	loadScript('http://d3js.org/d3.v3.min.js', afterLoad);
})();