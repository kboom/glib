var SlideableModel = {
	name : "SlideableModel",
	augment : "PositionableModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("SlideModel");		
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var startSliding = ic["startSliding"] = function(x, y) {
			this._isSliding = true;
			
			var sliderRect = this._sliderRect;
			this.dragAnchorOffsetLeft = x - this.getOffsetLeft();
			this.dragAnchorOffsetTop = y - this.getOffsetTop();
		};
		
		var stopSliding = ic["stopSliding"] = function() {
			this._isSliding = false;
			delete this.dragAnchorOffsetLeft;
			delete this.dragAnchorOffsetTop;
			delete this.sliderRect;
		};
		
		var slide = ic["slide"] = function(x, y) {
			if(!this._isSliding) return;
			var sliderRect = this._sliderRect;
			var position;
			var distance;
			var length;
			
			if(this._slidingDirection === "H") {	
				var cx = x - this.dragAnchorOffsetLeft;
				var offsetLeft = this.getOffsetLeft();
				length = sliderRect.width;
				position = cx - sliderRect.left;
				distance = position - offsetLeft;
					
				if(position < 0 || position > sliderRect.width) return;
				this.setOffsetLeft(position);
			} else {
				var cy = y - this.dragAnchorOffsetLeft;
				var offsetTop = this.getOffsetTop();
				length = sliderRect.height;
				position = cy - sliderRect.top;
				distance = position - offsetTop;
					
				if(position < 0 || position > sliderRect.height) return;
				this.setOffsetTop(position);
			}
			
			var scale = position / length;			
			this._slideCallback && this._slideCallback(scale, position);			
		};
		
		var setSliderRect = ic["setSliderLineDimensions"] = function(x, y, width, height) {
			this._sliderRect || (this._sliderRect = {});
			this._sliderRect.left = x;
			this._sliderRect.width = width;
			this._sliderRect.top = y;
			this._sliderRect.height = height;
		};
		
		var setOnSlideAction = ic["setOnSlideAction"] = function(fn) {
			this._slideCallback = fn;
		};
		
		var setSlidingDirection = ic["setSlidingDirection"] = function(direction) {
			this._slidingDirection = direction;
		};
		
		return function() {
			this["startSliding"] = startSliding;
			this["stopSliding"] = stopSliding;
			this["slide"] = slide;
			this["setSliderRect"] = setSliderRect;
			this["setOnSlideAction"] = setOnSlideAction;
			this["setSlidingDirection"] = setSlidingDirection;
			
			this["_slidingDirection"] = "H";
		};
	}
};
