var PositionableModel = {
	name : "PositionableModel",
	parent : "SizeableModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("PositionableModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();

		/**
		 * Method setting the position of top left corner of the object. Does
		 * not resize the object making the opposite parameters default if were
		 * set. Faster than calling each method separately.
		 */
		var setOffset = ic["setOffset"] = function(x, y) {
			this["offsetLeft"] = x;
			this["offsetRight"] = x + this.getWidth();
			this["offsetTop"] = y;
			this["offsetBottom"] = y + this.getHeight();
			this.fireChange.call(this, "offset", x, y);
		};

		/**
		 * Sets the position of left border of the object. Does not resize the
		 * object recomputing the opposite parameter.
		 */
		var setOffsetLeft = ic["setOffsetLeft"] = function(offset) {
			this["offsetLeft"] = offset;
			this["offsetRight"] = offset + this.getWidth();
			this.fireChange.call(this, "offsetLeft", offset);
		};

		/**
		 * Sets the position of right border of the object. Does not resize the
		 * object recomputing the opposite parameter.
		 */
		var setOffsetRight = ic["setOffsetRight"] = function(offset) {
			this["offsetRight"] = offset;
			this["offsetLeft"] = offset - this.getWidth();
			this.fireChange.call(this, "offsetRight", offset);
		};

		/**
		 * Sets the position of top border of the object. Does not resize the
		 * object recomputing the opposite parameter.
		 */
		var setOffsetTop = ic["setOffsetTop"] = function(offset) {
			this["offsetTop"] = offset;
			this["offsetBottom"] = offset + this.getHeight();
			this.fireChange.call(this, "offsetTop", offset);
		};

		/**
		 * Sets the position of top bottom border of the object. Does not resize the
		 * object recomputing the opposite parameter.
		 */
		var setOffsetBottom = ic["setOffsetBottom"] = function(offset) {
			this["offsetBottom"] = offset;
			this["offsetTop"] = offset - this.getHeight();
			this.fireChange.call(this, "offsetBottom", offset);
		};

		var getOffsetLeft = ic["getOffsetLeft"] = function() {
			return this["offsetLeft"];
		};

		var getOffsetRight = ic["getOffsetRight"] = function() {
			return this["offsetRight"];
		};

		var getOffsetTop = ic["getOffsetTop"] = function() {
			return this["offsetTop"];
		};

		var getOffsetBottom = ic["getOffsetBottom"] = function() {
			return this["offsetBottom"];
		};
		
		var moveLeft = ic["moveLeft"] = function(x) {
			this.setOffsetLeft(this.offsetLeft - x);
		};
		
		var moveRight = ic["moveRight"] = function(x) {
			this.setOffsetLeft(this.offsetLeft + x);
		};
		
		var moveUp = ic["moveUp"] = function(y) {
			this.setOffsetTop(this.offsetTop + y);
		};
		
		var moveDown = ic["moveDown"] = function(y) {
			this.setOffsetTop(this.offsetTop - y);
		};
		
		/**
		 * Makes the widget fit into the rectangle respecting preferred
		 * position.
		 */
		var fitInRect = ic["fitInRect"] = function(x, y, rectWidth, rectHeight) {
			var width = this.getWidth();
			var height = this.getHeight();			
			var resultX = x + width < rectWidth ? x : (rectWidth - width);
			var resultY = y + height < rectHeight ? y : (rectHeight - height);
			this.setOffset(resultX, resultY);
		};
		
		var invalidatePosition = ic["invalidatePosition"] = function() {
			if(!isNaN(this["offsetLeft"])) this.setOffsetLeft(this["offsetLeft"]);
			else this.setOffsetRight(this["offsetRight"]);
			if(!isNaN(this["offsetTop"])) this.setOffsetTop(this["offsetTop"]);
			else this.setOffsetBottom(this["offsetBottom"]);
		};

		return function() {
			this["setOffset"] = setOffset;
			this["setOffsetLeft"] = setOffsetLeft;
			this["setOffsetRight"] = setOffsetRight;
			this["setOffsetTop"] = setOffsetTop;
			this["setOffsetBottom"] = setOffsetBottom;
			this["getOffsetLeft"] = getOffsetLeft;
			this["getOffsetRight"] = getOffsetRight;
			this["getOffsetTop"] = getOffsetTop;
			this["getOffsetBottom"] = getOffsetBottom;
			this["moveLeft"] = moveLeft;
			this["moveRight"] = moveRight;
			this["moveUp"] = moveUp;
			this["moveDown"] = moveDown;
			this["fitInRect"] = fitInRect;
			this["invalidatePosition"] = invalidatePosition;
			
			this["offsetLeft"] = this["offsetTop"] = 0;
			this["offsetRight"] = this["offsetLeft"] + this.width;
			this["offsetBottom"] = this["offsetTop"] + this.height;
		};
	}
};