var ResizeableModel = {
	name : "ResizeableModel",
	augment : "SizeableModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("ResizeableModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var setOnResizeStartAction = ic["setOnResizeStartAction"] = function(fn) {
			this["onResizeStart"] = fn;
		};
		
		var setOnResizeEndAction = ic["setOnResizeEndAction"] = function(fn) {
			this["onResizeEndCb"] = fn;
		};
		
		var onResizeStart = ic["onResizeStart"] = function() {
			this.onResizeStart && this.onResizeStart();
		};
		
		var onResizeEnd = ic["onResizeEnd"] = function() {
			this.onResizeEnd && this.onResizeEnd();
		};		
		
		var startResizing = ic["startResizing"] = function(x, y) {
			this.beingResized = true;
			this.horizontalResizeEnabled === undefined && (this.horizontalResizeEnabled = true);
			this.verticalResizeEnabled === undefined && (this.verticalResizeEnabled = true);
			
			this.oppositeCornerX = this.movingBorder === "W" ? x + this.width : x - this.width;
			this.oppositeCornerY = y - this.getHeight();
			
			console.log("start resizing: " + this.oppositeCornerX + " : " + this.oppositeCornerY);
			
			this.fireChange.call(this, "startResizing");
		};
		
		var stopResizing = ic["stopResizing"] = function() {
			this.beingResized = false;
			this.oppositeCornerX = undefined;
			this.oppositeCornerY = undefined;
			this.fireChange.call(this, "stopResizing");
			delete this.verticalResizeEnabled;
			delete this.horizontalResizeEnabled;
		};
		
		var setHorizontalResize = ic["setHorizontalResize"] = function(state) {
			this["horizontalResizeEnabled"] = state;
		};
		
		var setVerticalResize = ic["setVerticalResize"] = function(state) {
			this["verticalResizeEnabled"] = state;
		};
		
		var setMovingBorder = ic["setMovingBorder"] = function(border) {
			if(border === "E") {
				this.movingBorder = "E";
			} else if(border === "W") {
				this.movingBorder = "W";
			}			
		};
		
		var getCurrentWidth = ic["getCurrentWidth"] = function(x) {
			if(!this.beingResized) return this.getWidth();
			else return Math.abs(x - this.oppositeCornerX);
		};
		
		var getCurrentHeight = ic["getCurrentHeight"] = function(y) {
			if(!this.beingResized) return this.getHeight();
			else return Math.abs(y - this.oppositeCornerY);
		};
		
		var resize = ic["resize"] = function(x, y) {
			if(this.horizontalResizeEnabled) {
				var prevWidth = this.width;
				var width = this.getCurrentWidth(x);
				if(this["minWidth"] && this["minWidth"] > width) return;				
				this.setWidth(width);
				if(this.movingBorder === "W" && this.moveLeft) {
					this.moveLeft(width - prevWidth);
				}					 
			} 
			if(this.verticalResizeEnabled) {
				var height = this.getCurrentHeight(y);
				if(this["minHeight"] && this["minHeight"] > height) return;
				this.setHeight(height);
			}
		};		
		
		var setMinWidth = ic["setMinWidth"] = function(width) {
			this["minWidth"] = width;
		};
		
		var setMinHeight = ic["setMinHeight"] = function(height) {
			this["minHeight"] = height;
		};
		
		var getMinWidth = ic["getMinWidth"] = function() {
			return this["minWidth"] || 0;
		};
		
		var getMinHeight = ic["getMinHeight"] = function() {
			return this["minHeight"] || 0;
		};
		
		var isResized = ic["isResized"] = function() {
			return this.beingResized;
		};
		
		return function() {
			this["startResizing"] = startResizing;
			this["stopResizing"] = stopResizing;
			this["setOnResizeStartAction"] = setOnResizeStartAction;
			this["setOnResizeEndAction"] = setOnResizeEndAction;
			this["onResizeStart"] = onResizeStart;
			this["onResizeEnd"] = onResizeEnd;
			this["getCurrentWidth"] = getCurrentWidth;
			this["getCurrentHeight"] = getCurrentHeight;
			this["setHorizontalResize"] = setHorizontalResize;
			this["setVerticalResize"] = setVerticalResize;
			this["resize"] = resize;
			this["setMovingBorder"] = setMovingBorder;
			this["setMinHeight"] = setMinHeight;
			this["setMinWidth"] = setMinWidth;
			this["getMinHeight"] = getMinHeight;
			this["getMinWidth"] = getMinWidth;
			this["isResizing"] = false;
		};
	}
};