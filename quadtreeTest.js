

var clickAction = "insert";

document.getElementById("mode-insert").onclick = function(){
	clickAction = "insert";
};

document.getElementById("mode-nearest").onclick = function(){
	clickAction = "nearest";
};

/*document.getElementById("mode-delete").onclick = function(){
	clickAction = "delete";
};*/


var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var container = document.getElementById("canvasContainer");
var infobox = document.getElementById("infobox");

canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

var quadtree = new Quadtree(canvas.width, canvas.height);
quadtree.doRender(canvas, context);

canvas.onclick = function(e){
	if(clickAction == "insert"){
		quadtree.insert({
			 x: e.clientX - container.offsetLeft
			,y: e.clientY - container.offsetTop
		});
		quadtree.doRender(canvas, context, infobox);
	} else if(clickAction == "nearest"){
		var nearest = quadtree.getNearest(
			 e.clientX - container.offsetLeft
			,e.clientY - container.offsetTop
		);
		//quadtree.doRender(canvas, context, infobox);
		context.fillStyle = "#0000FF";
		context.fillRect(~~nearest.point.x-2, ~~nearest.point.y-2, 4, 4);
	}
};

document.getElementById("add100PointsButton").onclick = function(){
	addRandomPoints(1000);
};

document.getElementById("add1000PointsButton").onclick = function(){
	addRandomPoints(1000);
};

document.getElementById("add10000PointsButton").onclick = function(){
	addRandomPoints(10000);
};

document.getElementById("add100000PointsButton").onclick = function(){
	addRandomPoints(100000);
};

document.getElementById("add1000000PointsButton").onclick = function(){
	addRandomPoints(1000000);
};

function addRandomPoints(count){
	for(var i = 0; i < count; i++){
		quadtree.insert({
			 x: Math.random() * canvas.width
			,y: Math.random() * canvas.height
		});
	}
	quadtree.doRender(canvas, context, infobox);
}

document.getElementById("redrawButton").onclick = function(){
	quadtree.doRender(canvas, context, infobox);
};

document.getElementById("clearButton").onclick = function(){
	quadtree = new Quadtree(canvas.width, canvas.height);
	quadtree.doRender(canvas, context);
};
















