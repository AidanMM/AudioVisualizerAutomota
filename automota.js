!function() {
automotaBase = {
	currentState: 0,
	nextState: 0,
	xIndex: -1,
	yIndex: -1,
	neighbors: [],
	numNeighbors: 8 ,
	draw: function(ctx) {},
	calculateNextGeneration: function() {
		//Count living neighbors	
		var living = 0;
		for(var i = 0; i < this.numNeighbors; i++) {
			if(this.neighbors[i] != null && this.neighbors[i].currentState > 0) {
				living++;
			}
		}
		if(this.currentState > 0) {
			if(living < 2) {
				this.nextState = 0;
			}else if(living == 2 || living == 3) {
				this.nextState = this.currentState + 1;
			}else if(living > 3) {
				this.nextState = 0;
			}
		} else if(this.currentState == 0 && living == 3) {
			this.nextState = 1;
		}
	},
	update: function() {
		this.currentState = this.nextState;
		this.nextState = 0;
	},
}

Automota = Object.assign( automotaBase, {
	create: function(x,y) {
		var self = Object.create(this);
		self.xIndex = x;
		self.yIndex = y;
		return self;
	},
	draw: function(ctx, xBound, yBound, xLength, yLength, lineWidth, style, rs, dl, dc) {
		var xPos = xBound / xLength * this.xIndex;
		var yPos = yBound / yLength * this.yIndex;
		//var lineStyle = "cubic";
		//var lineStyle="quadratic";
		var lineWidth = lineWidth;
		var radiusScale= rs;
		var lineStyle;
		var drawLines=dl;
		var drawCircles=dc;
		if(style=="random") {
				var rando = Math.floor((Math.random()*3)+1);
				switch(rando)
				{
					case 1:
					lineStyle="straight";
					break;
					
					case 2:
					lineStyle="quadratic";
					break;
					
					case 3:
					lineStyle="cubic";
					break;
				}
			}
			else {
				lineStyle= style;
			}
		
		ctx.save();
		if(this.currentState >= 1) {
			ctx.strokeStyle = "rgba(" + ( 255 - this.xIndex - 10*(this.currentState - 1)) + ","
				+ (Math.max(0, this.yIndex - this.xIndex) - this.currentState * 3)  + "," 
				+ (this.xIndex - 10*(this.currentState - 1)) + ",1.0)";
			ctx.lineWidth=lineWidth;

			if(drawLines) {
				if(this.yIndex < Math.round(yLength / 2)) {
					ctx.fillStyle = "green";
					ctx.beginPath();

					if(lineStyle=="straight"){
						 drawStraightLine(ctx, Draw.canvas.width/2, 0, xPos, yPos);
					}
					if(lineStyle=="quadratic"){
						 drawQuadraticCurve(ctx, Draw.canvas.width/2, 0, xPos,Draw.canvas.height / 4 / this.currentState, xPos, yPos );
					}
					if(lineStyle=="cubic"){
						 drawCubicCurve(ctx, Draw.canvas.width/2, 0, Draw.canvas.width/2, Draw.canvas.height/4, xPos, Draw.canvas.height/4/this.currentState, xPos, yPos );
					}

				} else {
					ctx.fillStyle = "green";
				
					var yFlip = Draw.canvas.height -(Draw.canvas.height / 4 / this.currentState);
					var cpYFlip = Draw.canvas.height - (Draw.canvas.height/4);
					if(lineStyle=="straight"){ 
						drawStraightLine(ctx, Draw.canvas.width/2, Draw.canvas.height, xPos, yPos);
					}
					if(lineStyle=="quadratic"){
						drawQuadraticCurve(ctx, Draw.canvas.width/2, Draw.canvas.height, xPos , yFlip ,xPos, yPos);
					}
					if(lineStyle=="cubic"){
						drawCubicCurve(ctx, Draw.canvas.width/2, Draw.canvas.height, Draw.canvas.width/2, cpYFlip, xPos, yFlip, xPos, yPos); 
					}
				}
			}
				
			if(drawCircles) {
				ctx.fillStyle = "rgba(" + ( 255 - this.xIndex - 10*(this.currentState - 1)) + ","+ (Math.max(0, this.yIndex - this.xIndex) - this.currentState * 3)  + "," +(this.xIndex - 10*(this.currentState - 1)) + ",1.0)";
				ctx.beginPath();
				ctx.arc(xPos, yPos, 2 * Math.min(this.currentState*radiusScale,10*radiusScale), 0, Math.PI * 2);
				ctx.fill();
				ctx.closePath();
			}
			if(this.currentState > 10) {
				this.nextState = 0;
				this.currentState = 0;
			}	
		}
		ctx.restore();
	}
})

function drawQuadraticCurve(ctx, originX, originY, cpX, cpY, targetX, targetY) {
	ctx.beginPath();
	ctx.moveTo(originX, originY);
	ctx.quadraticCurveTo(cpX , cpY, targetX, targetY);
	ctx.stroke();
}

function drawStraightLine(ctx, originX, originY, targetX, targetY) {
	ctx.beginPath();
	ctx.moveTo(originX,originY);
	ctx.lineTo(targetX, targetY);
	ctx.stroke();
}

function drawCubicCurve(ctx, originX, originY, cp1X, cp1Y, cp2X, cp2Y, targetX, targetY) {
	ctx.beginPath();
	ctx.moveTo(originX, originY);
	ctx.bezierCurveTo(cp1X, cp1Y,cp2X, cp2Y, targetX, targetY);
	ctx.stroke();
}

colonyBase = {
	automota: [],
	xSize: -1,
	ySize: -1,
	width: 100,
	height: 100,
	init: function(width, height, xSize, ySize) {
		this.xSize = xSize;
		this.ySize = ySize;
		this.width = width;
		this.height = height;
		this.automota = new Array(xSize);
		for(var x = 0; x < xSize; x++) {
			this.automota[x] = new Array(ySize);
			for(var y = 0; y < ySize; y++) {
				this.automota[x][y] = Automota.create(x,y);
			}
		}
		this.assignNeighbors();
	},
	assignNeighbors: function() {
		for(var x = 0; x < this.xSize; x++) {
			for(var y = 0; y < this.ySize; y++) {
				this.automota[x][y].neighbors = new Array(8);
			 	this.automota[x][y].neighbors[0] = x - 1 >0 ?  this.automota[x - 1][y - 1] : null;
				this.automota[x][y].neighbors[1] = y - 1 > 0 ? this.automota[x][y - 1] : null ;
				this.automota[x][y].neighbors[2] = x + 1 < this.xSize && y - 1 > 0 ? this.automota[x + 1][y - 1] : null;
				this.automota[x][y].neighbors[3] = x - 1 > 0 ? this.automota[x - 1][y] : null;
				this.automota[x][y].neighbors[4] = x + 1 < this.xSize ? this.automota[x + 1][y] : null;
				this.automota[x][y].neighbors[5] = x - 1 > 0 && y + 1 < this.ySize ? this.automota[x - 1][y + 1] : null;
				this.automota[x][y].neighbors[6] = y + 1 < this.ySize ?  this.automota[x][y + 1] : null;
				this.automota[x][y].neighbors[7] = x + 1 < this.xSize && y + 1 < this.ySize ? this.automota[x + 1][y + 1] : null;
			}
		}
	},
	update: function() {
		for(var x = 0; x < this.xSize; x++) {
			for(var y = 0; y < this.ySize; y++) {
				this.automota[x][y].calculateNextGeneration();
			}
		}
		for(var x = 0; x < this.xSize; x++) {
			for(var y = 0; y < this.ySize; y++) {
				this.automota[x][y].update();
			}
		}
	},
	draw: function(ctx, lineWidth, lineStyle, radiusScale, drawLines, drawCircles) {
		
		for(var x = 0; x < this.xSize; x++) {
			for(var y = 0; y < this.ySize; y++) {
				this.automota[x][y].draw(ctx, this.width, this.height, this.xSize, this.ySize, lineWidth, lineStyle, radiusScale, drawLines, drawCircles);
			}
		}
	},
	print: function() {
		for(var x = 0; x < this.xSize; x++) {
			for(var y = 0; y < this.ySize; y++) {
				console.log(this.automota[x][y]);
			}
		}	
	},
	randomizeState: function() {
		for(var x = 0; x < this.xSize; x++) {
			for(var y = 0; y < this.ySize; y++) {
				Math.random() > 0.7 ?  this.automota[x][y].currentState = 1 : this.automota[x][y].currentState = 0 ;
			}
		}		
	},
	clearState: function() {
		for(var x = 0; x < this.xSize; x++) {
			for(var y = 0; y < this.ySize; y++) {
				this.automota[x][y].currentState = 0;
			}
		}	
	}
}

Colony = Object.create(colonyBase);

Object.assign( Colony, {
	create: function(width, height, xSize, ySize){
		var self = Object.create(this);
		self.init(width, height, xSize, ySize);
		return self;
	}
})

}()
