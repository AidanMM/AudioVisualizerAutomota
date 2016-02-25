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
		if(this.currentState > 0)  {
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
	draw: function(ctx, xBound, yBound, xLength, yLength) {
		var xPos = xBound / xLength * this.xIndex;
		var yPos = yBound / yLength * this.yIndex;
		ctx.save();
		/*if(this.currentState ==  1 ) {
			//ctx.fillStyle = "rgba(" + (10*(this.currentState - 1)) + ",0,0,1.0)";
			if(this.yIndex < Math.round(yLength / 2)) {
				ctx.fillStyle = "green";
				ctx.strokeStyle = "green";
				ctx.beginPath();
				ctx.moveTo(Draw.canvas.width/2,0);
				ctx.quadraticCurveTo(xPos, Draw.canvas.height / 4, xPos, yPos);
				ctx.stroke();
			} else {
				ctx.fillStyle = "green";
				ctx.strokeStyle = "blue";
				ctx.beginPath();
				ctx.moveTo(Draw.canvas.width/2,Draw.canvas.height);
				ctx.lineTo(xPos, yPos);
				ctx.stroke();
			}
			//ctx.fillRect(xPos, yPos, xBound / xLength, yBound / yLength);
		} else*/ if(this.currentState >= 1) {
				ctx.strokeStyle = "rgba(" + ( 255 - this.xIndex - 10*(this.currentState - 1)) + ","+ (Math.max(0, this.yIndex - this.xIndex) - this.currentState * 3)  + "," +(this.xIndex - 10*(this.currentState - 1)) + ",1.0)";
			
			if(this.yIndex < Math.round(yLength / 2)) {
				ctx.fillStyle = "green";
				ctx.beginPath();
				ctx.moveTo(Draw.canvas.width/2,0);
				ctx.quadraticCurveTo(xPos , Draw.canvas.height / 4 / this.currentState, xPos, yPos);
				ctx.stroke();
			} else {
				ctx.fillStyle = "green";
				ctx.beginPath();
				ctx.moveTo(Draw.canvas.width/2,Draw.canvas.height);
				ctx.lineTo(xPos, yPos);
				ctx.stroke();
			}
			ctx.fillStyle = "rgba(" + ( 255 - this.xIndex - 10*(this.currentState - 1)) + ","+ (Math.max(0, this.yIndex - this.xIndex) - this.currentState * 3)  + "," +(this.xIndex - 10*(this.currentState - 1)) + ",1.0)";
			ctx.beginPath();
			ctx.arc(xPos, yPos, 2 * Math.min(this.currentState,10), 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();
			if(this.currentState > 10) {
				this.nextState = 0;
				this.currentState = 0;
			}	
		}
		ctx.restore();
	}
})


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
	draw: function(ctx) {
		for(var x = 0; x < this.xSize; x++) {
			for(var y = 0; y < this.ySize; y++) {
				this.automota[x][y].draw(ctx, this.width, this.height, this.xSize, this.ySize);
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
