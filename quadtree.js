
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var container = document.getElementById("canvasContainer");

canvas.width = container.clientWidth;
canvas.height = container.clientHeight;



function Quadtree(width, height){

	/*
		+------+------+
		| NW,0 | NE,1 |
		+------+------+
		| SW,2 | SE,3 |
		+------+------+
	*/

	var root = {
		 internal: true
		,centerX: width/2
		,centerY: height/2
		,level: 0
		,parent: null
	};

	root.children = [
		{
			 parent: root
			,level: 1
			,centerX: root.centerX - width /4
			,centerY: root.centerY - height/4
		},
		{
			 parent: root
			,level: 1
			,centerX: root.centerX + width /4
			,centerY: root.centerY - height/4
		},
		{
			 parent: root
			,level: 1
			,centerX: root.centerX - width /4
			,centerY: root.centerY + height/4
		},
		{
			 parent: root
			,level: 1
			,centerX: root.centerX + width /4
			,centerY: root.centerY + height/4
		}
	];

	function insert(value){
		insertTo(value, root);
	}

	function insertTo(value, node){
		if(node.internal){
			if(value.x > node.centerX){
				if(value.y > node.centerY){
					// SE
					insertTo(value, node.children[3]);
				} else {
					// NE
					insertTo(value, node.children[1]);
				}
			} else {
				if(value.y > node.centerY){
					// SW
					insertTo(value, node.children[2]);
				} else {
					// NW
					insertTo(value, node.children[0]);
				}
			}
		} else {
			if(!node.leaf){
				node.leaf = true;
				node.content = value;
			} else {
				if(node.content.x == value.x && node.content.y == value.y){
					return false;
				}
				node.leaf = false;
				node.internal = true;
				node.children = [
					{
						 parent: node
						,level: node.level + 1
						,centerX: node.centerX - width /Math.pow(2, node.level+2)
						,centerY: node.centerY - height/Math.pow(2, node.level+2)
					},
					{
						 parent: node
						,level: node.level + 1
						,centerX: node.centerX + width /Math.pow(2, node.level+2)
						,centerY: node.centerY - height/Math.pow(2, node.level+2)
					},
					{
						 parent: node
						,level: node.level + 1
						,centerX: node.centerX - width /Math.pow(2, node.level+2)
						,centerY: node.centerY + height/Math.pow(2, node.level+2)
					},
					{
						 parent: node
						,level: node.level + 1
						,centerX: node.centerX + width /Math.pow(2, node.level+2)
						,centerY: node.centerY + height/Math.pow(2, node.level+2)
					}
				];
				insertTo(node.content, node);
				insertTo(value, node);
				node.content = null;
			}
		}
	}

	function doRender(){
		context.strokeStyle = "#FFFFFF";
		context.fillStyle = "#FF0000";
		context.clearRect(0, 0, canvas.width, canvas.height);
		render(root, width, height, context);
	}
	
	function render(node, width, height, context){
		if(node.internal){
			
			context.beginPath();
			context.moveTo(~~(node.centerX)+0.5, ~~(node.centerY-height/2)+0.5);
			context.lineTo(~~(node.centerX)+0.5, ~~(node.centerY+height/2)+0.5);
			context.stroke();
			
			context.beginPath();
			context.moveTo(~~(node.centerX - width/2)+0.5, ~~(node.centerY)+0.5);
			context.lineTo(~~(node.centerX + width/2)+0.5, ~~(node.centerY)+0.5);
			context.stroke();

			render(node.children[0], width/2, height/2, context);
			render(node.children[1], width/2, height/2, context);
			render(node.children[2], width/2, height/2, context);
			render(node.children[3], width/2, height/2, context);
			
		} else {
			if(node.leaf){
				context.beginPath();
				context.arc(~~(node.content.x)+0.5, ~~(node.content.y)+0.5, 2, 0, 2*Math.PI);
				context.fill();
			}
		}
	}

	return {
		 insert: insert
		,doRender: doRender
	};
	
}

var quadtree = new Quadtree(canvas.width, canvas.height);
quadtree.doRender();

canvas.onclick = function(e){
	quadtree.insert({
		 x: e.layerX
		,y: e.layerY
	});
	quadtree.doRender();
}











