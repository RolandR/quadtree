
/*

	========================================================================

	Point-Region Quad Tree
	
	Copyright (C) 2017 Roland Rytz <roland@draemm.li>
	Licensed under the GNU Affero General Public License Version 3
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as
	published by the Free Software Foundation, either version 3 of the
	License, or (at your option) any later version.
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
	For more information, see:
	https://draemm.li/various/quadtree/LICENSE
	
	========================================================================

*/


function Quadtree(width, height){

	/*
		+------+------+
		| NW,0 | NE,1 |
		+------+------+
		| SW,2 | SE,3 |
		+------+------+
	*/

	var depth = 0;
	var count = 0;

	var root = {
		 centerX: width/2
		,centerY: height/2
		,level: 0
		,parent: null
	};

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
				count++;
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
				depth = Math.max(depth, node.level+1);
				count--;
				insertTo(node.content, node);
				insertTo(value, node);
				node.content = null;
			}
		}
	}

	function getNearest(x, y){
		var best = {
			 distance: height+width
			,point: null
		}
		return nearest(x, y, best, root, width, height);
	}

	function getNearestNeighbor(point){
		var best = {
			 distance: height+width
			,point: null
		}
		return nearest(point.x, point.y, best, root, width, height, true);
	}

	function nearest(x, y, best, node, width, height, getNeighbor) {
		
		var left = node.centerX - width/2;
		var right = node.centerX + width/2;
		var top = node.centerY - height/2;
		var bottom = node.centerY + height/2;
		
		// exclude node if point is farther away than best distance in either axis
		if (x < left - best.distance || x > right + best.distance || y < top - best.distance || y > bottom + best.distance) {
			return best;
		}

		if(node.internal){
			best = nearest(x, y, best, node.children[0], width/2, height/2, getNeighbor);
			best = nearest(x, y, best, node.children[1], width/2, height/2, getNeighbor);
			best = nearest(x, y, best, node.children[2], width/2, height/2, getNeighbor);
			best = nearest(x, y, best, node.children[3], width/2, height/2, getNeighbor);
		} else {
			if(node.leaf){
				var point = node.content;
				var distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
				if (distance < best.distance) {
					if(!(getNeighbor && distance === 0)){
						best.distance = distance;
						best.point = point;
					}
				}
			} else {
				return best;
			}
		}

		return best;
	}

	function remove(value){
		removeDown(value, root);
	}

	function removeDown(value, node){
		if(node.internal){
			if(value.x > node.centerX){
				if(value.y > node.centerY){
					// SE
					removeDown(value, node.children[3]);
				} else {
					// NE
					removeDown(value, node.children[1]);
				}
			} else {
				if(value.y > node.centerY){
					// SW
					removeDown(value, node.children[2]);
				} else {
					// NW
					removeDown(value, node.children[0]);
				}
			}
		} else {
			if(node.leaf){
				node.leaf = false;
				node.content = null;
				count--;
				removeUp(node.parent);
			}
		}
	}

	function removeUp(node){
		if(!node){
			return;
		}
		if(node.children[0].internal || node.children[1].internal || node.children[2].internal || node.children[3].internal){
			return;
		} 
		var childrenCount = 0;
		var childContent = null;
		
		if(node.children[0].leaf){
			childContent = node.children[0].content;
			childrenCount++;
		}
		if(node.children[1].leaf){
			childContent = node.children[1].content;
			childrenCount++;
		}
		if(node.children[2].leaf){
			childContent = node.children[2].content;
			childrenCount++;
		}
		if(node.children[3].leaf){
			childContent = node.children[3].content;
			childrenCount++;
		}

		if(childrenCount > 1){
			return;
		} else if(childrenCount == 1){
			node.internal = false;
			node.leaf = true;
			node.content = childContent;
			node.children = null;
			depth = null;
			removeUp(node.parent);
		} else if(childrenCount == 0){
			node.internal = false;
			node.leaf = false;
			node.content = null;
			node.children = null;
			depth = null;
			removeUp(node.parent);
		}
	}

	function doRender(canvas, context, infoBox){
		context.strokeStyle = "#666666";
		context.fillStyle = "#FFAA00";
		context.clearRect(0, 0, canvas.width, canvas.height);
		if(count > 100000){
			fastRender(root, width, height, context);
		} else {
			render(root, width, height, context);
		}
		if(infoBox){
			var depthText = depth;
			if(depth === null){
				depthText = "???"
			}
			infoBox.innerHTML = "Depth: "+depthText+"<br>Points: "+count;
		}
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
				context.fillRect(~~(node.content.x)-1, ~~(node.content.y)-1, 2, 2);
			}
		}
	}

	function fastRender(node, width, height, context){
		if(node.internal){
			fastRender(node.children[0], width/2, height/2, context);
			fastRender(node.children[1], width/2, height/2, context);
			fastRender(node.children[2], width/2, height/2, context);
			fastRender(node.children[3], width/2, height/2, context);
		} else {
			if(node.leaf){
				context.fillRect(~~(node.content.x), ~~(node.content.y), 1, 1);
			}
		}
	}

	return {
		 insert: insert
		,doRender: doRender
		,getNearest: getNearest
		,getNearestNeighbor: getNearestNeighbor
		,remove: remove
		,getCount: function(){
			return count;
		}
	};
	
}











