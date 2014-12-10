/**
 * ver: 0.3
 * by youkochan
 *
 * 分析网页整体结构，加入图形化功能，以及一些更新
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

	function drawv3 (data) {
		var m = [20, 120, 20, 120],
    		w = 1280 - m[1] - m[3],
    		h = 800 - m[0] - m[2],
    		i = 0,
    		root;

		var tree = d3.layout.tree()
    		.size([h, w]);

		var diagonal = d3.svg.diagonal()
    		.projection(function(d) { return [d.y, d.x]; });

		var vis = d3.select("body").append("svg:svg")
    		.attr("width", w + m[1] + m[3])
    		.attr("height", h + m[0] + m[2])
  			.append("svg:g")
    		.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

		root = data;
		root.x0 = h / 2;
		root.y0 = 0;

		function toggleAll(d) {
			if (d.children) {
				d.children.forEach(toggleAll);
				toggle(d);
			}
		}

		// Initialize the display to show a few nodes.
		// root.children.forEach(toggleAll);
		
		update(root);

		function update(source) {
  			var duration = d3.event && d3.event.altKey ? 5000 : 500;

  			// Compute the new tree layout.
  			var nodes = tree.nodes(root).reverse();

  			// Normalize for fixed-depth.
  			nodes.forEach(function(d) { d.y = d.depth * 80; });

  			// Update the nodes…
  			var node = vis.selectAll("g.node")
      			.data(nodes, function(d) { return d.id || (d.id = ++i); });

  			// Enter any new nodes at the parent's previous position.
  			var nodeEnter = node.enter().append("svg:g")
      			.attr("class", "node")
      			.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      			.on("click", function(d) { toggle(d); update(d); });

  			nodeEnter.append("svg:circle")
      			.attr("r", 1e-6)
      			.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  			nodeEnter.append("svg:text")
      			.attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      			.attr("dy", ".35em")
      			.attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      			.text(function(d) { return d.name; })
      			.style("fill-opacity", 1e-6);

  			// Transition nodes to their new position.
  			var nodeUpdate = node.transition()
      			.duration(duration)
      			.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  			nodeUpdate.select("circle")
      			.attr("r", 4.5)
      			.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  			nodeUpdate.select("text")
      			.style("fill-opacity", 1);

  			// Transition exiting nodes to the parent's new position.
  			var nodeExit = node.exit().transition()
      			.duration(duration)
      			.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      			.remove();

  			nodeExit.select("circle")
      			.attr("r", 1e-6);

  			nodeExit.select("text")
      			.style("fill-opacity", 1e-6);

  			// Update the links…
  			var link = vis.selectAll("path.link")
      			.data(tree.links(nodes), function(d) { return d.target.id; });

  			// Enter any new links at the parent's previous position.
  			link.enter().insert("svg:path", "g")
      			.attr("class", "link")
      			.attr("d", function(d) {
        			var o = {x: source.x0, y: source.y0};
        			return diagonal({source: o, target: o});
 				})
    			.transition()
    			.duration(duration)
    			.attr("d", diagonal);

  				// Transition links to their new position.
  			link.transition()
      			.duration(duration)
      			.attr("d", diagonal);

  			// Transition exiting nodes to the parent's new position.
  			link.exit().transition()
      			.duration(duration)
      			.attr("d", function(d) {
        			var o = {x: source.x, y: source.y};
        			return diagonal({source: o, target: o});
      			})
      			.remove();

  			// Stash the old positions for transition.
  			nodes.forEach(function(d) {
    			d.x0 = d.x;
    			d.y0 = d.y;
  			});
		}

		// Toggle children.
		function toggle(d) {
  			if (d.children) {
    			d._children = d.children;
    			d.children = null;
  			} else {
    			d.children = d._children;
    			d._children = null;
  			}
		}
	}

	function buildData(node){ // 从body开始深度优先便利
		var data = {};

		data["name"] = node.tagName == undefined ? "ANNOTATION" : node.tagName;

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

		drawv3(data);
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