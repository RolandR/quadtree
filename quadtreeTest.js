

var clickAction = "insert";

document.getElementById("mode-insert").onclick = function(){
	clickAction = "insert";
};

document.getElementById("mode-nearest").onclick = function(){
	clickAction = "nearest";
};

document.getElementById("mode-delete").onclick = function(){
	clickAction = "delete";
};


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
	}
}