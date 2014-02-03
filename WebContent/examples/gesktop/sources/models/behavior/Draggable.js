var DraggableModel = {
	name : "DraggableModel",
	augment : "PositionableModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("DraggableModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		/**
		 * Checks if a rectangle el1 is within rectangle el2 judging by their
		 * offsets. These offsets must be relative to same element for 
		 * a comparison to be valid.
		 */
		var isOver = function(upperArea, lowerArea) {		    
		    return ((upperArea.top > lowerArea.top) &&
		             (upperArea.bottom < lowerArea.bottom) &&
		             (upperArea.right < lowerArea.right) &&
		             (upperArea.left > lowerArea.left));
		};		
		
		/**
		 * Even if a mouse is over drag area the whole object might not be.
		 * It sets a rectangle coordinates an object must stay within when
		 * dragging. Origin area coordinates by default.
		 */
		var setDragAreaRect = ic["setDragAreaRect"] = function(x, y, width, height) {
			this.dragAreaRect || (this.dragAreaRect = {});
			this.dragAreaRect.left = x;
			this.dragAreaRect.right = x + width;
			this.dragAreaRect.top = y;
			this.dragAreaRect.bottom = y + height;
		};
		
		/**
		 * Even if a mouse is over drop area the whole object might not be.
		 * It sets a rectangle coordinates an object must stay within when
		 * dropping. Origin area coordinates by default.
		 */
		var setDropAreaRect = ic["setDropAreaRect"] = function(x, y, width, height) {
			this.dropAreaRect || (this.dropAreaRect = {});
			this.dropAreaRect.left = x;
			this.dropAreaRect.right = x + width;
			this.dropAreaRect.top = y;
			this.dropAreaRect.bottom = y + height;
		};		
		
		/**
		 * Anchor by which the object is dragged by has some dimensions which
		 * must be taken into account to preserve dragging point on the anchor.
		 */
		var setAnchorOffset = ic["setAnchorOffset"] = function(x, y) {
			this.anchorOffsetX = x;
			this.anchorOffsetY = y;
		};
		
		/**
		 * Sets a name to be used to extract DOM element the object can fly over.
		 * Origin area by default.
		 */
		var setDragArea = ic["setDragArea"] = function(item) {
			this.dragArea = item;
		};
		
		/**
		 * Sets a name to be used to extract DOM element the object can land on.
		 * Origin area by default.
		 */
		var setDropArea = ic["setDropArea"] = function(item) {
			this.dropArea = item;
		};
		
		/**
		 * Returns a name to be used to extract DOM element the object can fly
		 * over. Origin name if not set.
		 */
		var getDragArea = ic["getDragArea"] = function() {
			return this.dragArea ? this.dragArea() : undefined;
		};		
		
		/**
		 * Returns a name to be used to extract DOM element the object can land
		 * on. Origin name if not set.
		 */
		var getDropArea = ic["getDropArea"] = function() {
			return this.dropArea ? this.dropArea() : undefined;
		};
		
		/**
		 * Sets action to be triggered when dragging starts.
		 */
		var setOnDragStartAction = ic["setOnDragStartAction"] = function(fn) {
			this["onDragStart"] = fn;
		};
		
		/**
		 * Sets action to be triggered when dragging continues.
		 */
		var setOnDragContinueAction = ic["setOnDragContinueAction"] = function(fn) {
			this["onDragContinue"] = fn;
		};
		
		/**
		 * Sets action to be triggered when dragging stops. 
		 */
		var setOnDragEndAction = ic["setOnDragEndAction"] = function(fn) {
			this["onDragEnd"] = fn;
		};
		
		/**
		 * Sets action to be triggered when drag is about to be accepted.
		 */
		var setOnDragAcceptAction = ic["setOnDragAcceptAction"] = function(fn) {
			this["onDragAccept"] = fn;
		};
		
		/**
		 * Sets action to be triggered when drag is about to be rejected.
		 */
		var setOnDragRejectAction = ic["setOnDragRejectAction"] = function(fn) {
			this["onDragReject"] = fn;
		};
		
		/**
		 * Rejects current drag restoring element to its previous state.
		 */
		var rejectDrag = ic["rejectDrag"] = function() {
			if(!this.beingDragged) return;
			var dragX = this.dragStartX;
			var dragY = this.dragStartY;			
			if(this.onDragReject && !this.onDragReject(dragX, dragY)) return;			
			this.setOffsetLeft(dragX);
			this.setOffsetTop(dragY);
			this.fireChange("rejectDrag");
			this.beingDragged = false;
		};
		
		/**
		 * Accepts current drag not taking into account any conditions.
		 */
		var acceptDrag = ic["acceptDrag"] = function() {
			if(!this.beingDragged) return;			
			var dropX = this.offsetLeft + this.dragAreaRect.left - this.dropAreaRect.left;
			var dropY = this.offsetTop + this.dragAreaRect.top - this.dropAreaRect.top;
			if(this.onDragAccept && !this.onDragAccept(dropX, dropY)) return;			
			this.setOffsetLeft(dropX);
			this.setOffsetTop(dropY);
			this.fireChange("acceptDrag");
			this.beingDragged = false;
		};
		
		var setDragPermitRule = ic["setDragPermitRule"] = function(fn) {
			this.dragPermitRule = fn;
		};
		
		var isDraggingAllowed = ic["isDraggingAllowed"] = function(fn) {
			return this.dragPermitRule ? this.dragPermitRule() : true;
		};
		
		/**
		 * Sets on the flag without which dragging is impossible. This condition
		 * is checked first.
		 */
		var assumeDraggable = ic["assumeDraggable"] = function() {
			this.draggable = true;
		};
		
		/**
		 * Sets off the flag without which dragging is impossible. This condition
		 * is checked first.
		 */
		var rejectDraggable = ic["rejectDraggable"] = function() {
			this.draggable = false;
		};
		
		/**
		 * Sets on the flag without which dropping is impossible. This condition
		 * is checked first.
		 */
		var assumeDroppable = ic["assumeDroppable"] = function() {
			this.droppable = true;
		};
		
		/**
		 * Sets off the flag without which dropping is impossible. This condition
		 * is checked first.
		 */
		var rejectDroppable = ic["rejectDroppable"] = function() {
			this.droppable = false;
		};
		
		/**
		 * Returns true if dragging has started or false otherwise.
		 */
		var isBeingDragged = ic["isBeingDragged"] = function() {
			return this.beingDragged || false;
		};
		
		/**
		 * Starts dragging process which will long until it ends or gets 
		 * interrupted.
		 */
		var startDragging = ic["startDragging"] = function() {
			this.beingDragged = true;
			
			this.invalidatePosition();
			
			this.dragStartX = this.getOffsetLeft();
			this.dragStartY = this.getOffsetTop();
			
			this.dragAnchorOffsetLeft = this.anchorOffsetX + this.dragAreaRect.left;
			this.dragAnchorOffsetTop = this.anchorOffsetY + this.dragAreaRect.top;
			
			this.dragRectOffsetLeft = 0;
			this.dragRectOffsetTop = 0;
			this.dragRectOffsetRight = this.dragAreaRect.right - this.width;
			this.dragRectOffsetBottom = this.dragAreaRect.bottom - this.dragAreaRect.top - this.height - this.anchorOffsetY;
			
		
			this.onDragStart && this.onDragStart();
			this.fireChange("startDragging");
		};		
		
		/**
		 * Stops dragging process. Based on current conditions it will decide
		 * whether accept the outcome or not.
		 */
		var stopDragging = ic["stopDragging"] = function() {
			if(!this.droppable) this.rejectDrag();			
			else {
				var objectRect = {};
				objectRect.left = this.dragAreaRect.left + this.offsetLeft;
				objectRect.right = objectRect.left + this.width;
				objectRect.top = this.dragAreaRect.top + this.offsetTop;
				objectRect.bottom = objectRect.top + this.height;
				
				if(!isOver(objectRect, this.dropAreaRect)) this.rejectDrag();
				else this.acceptDrag();
			} 
			
			this.beingDragged = false;
			
			delete this.dragStartX;
			delete this.dragStartY;
			delete this.dragRectOffsetLeft;
			delete this.dragRectOffsetTop;
			delete this.dragRectOffsetRight;
			delete this.dragRectOffsetBottom;
			
			this.onDragEnd && this.onDragEnd();
			this.fireChange("stopDragging");
		};		
		
		/**
		 * Called whenever the object is dragged after dragging starts.
		 * The object coordinates will change unless the object is not within
		 * dragAreaRect.
		 */
		var drag = ic["drag"] = function(x, y) {
//			if(!this.draggable || !this.beingDragged) {
//				console.log("DRAGGABLE: " + this.draggable + ", beeing dragged: " + this.beingDragged);
//				return;
//			}
			var ex = x - this.dragAnchorOffsetLeft;
			var ey = y - this.dragAnchorOffsetTop;
			
			var dragAreaRect = this.dragAreaRect;
			console.log("set drag " + ex + ", " + ey + " drag area left-right-top-bottom: " 
					+ dragAreaRect.left + ", " 
					+ dragAreaRect.right + ", " 
					+ dragAreaRect.top + ", " 
					+ dragAreaRect.bottom);
			
			console.log("offset left: " + this.dragRectOffsetLeft + ", right: " + this.dragRectOffsetRight + ", top: " + this.dragRectOffsetTop + ", bottom: " + this.dragRectOffsetBottom);
			
			if(ex > this.dragRectOffsetLeft && ex < this.dragRectOffsetRight) this.setOffsetLeft(ex);
			if(ey > this.dragRectOffsetTop && ey < this.dragRectOffsetBottom) this.setOffsetTop(ey);
			
			this.onDragContinue && this.onDragContinue();
		};		
		
		return function() {
			this["setDragAreaRect"] = setDragAreaRect;
			this["setDropAreaRect"] = setDropAreaRect;
			this["setAnchorOffset"] = setAnchorOffset;
			this["setDragArea"] = setDragArea;
			this["setDropArea"] = setDropArea;
			this["getDragArea"] = getDragArea;
			this["getDropArea"] = getDropArea;
			this["setOnDragStartAction"] = setOnDragStartAction;
			this["setOnDragContinueAction"] = setOnDragContinueAction;
			this["setOnDragEndAction"] = setOnDragEndAction;
			this["setOnDragAcceptAction"] = setOnDragAcceptAction;
			this["setOnDragRejectAction"] = setOnDragRejectAction;
			this["rejectDrag"] = rejectDrag;
			this["acceptDrag"] = acceptDrag;
			this["assumeDraggable"] = assumeDraggable;
			this["rejectDraggable"] = rejectDraggable;
			this["assumeDroppable"] = assumeDroppable;
			this["rejectDroppable"] = rejectDroppable;
			this["isBeingDragged"] = isBeingDragged;
			this["startDragging"] = startDragging;
			this["stopDragging"] = stopDragging;
			this["setDragPermitRule"] = setDragPermitRule;
			this["isDraggingAllowed"] = isDraggingAllowed;		
			
			this["droppable"] = true;
			this["draggable"] = true;
			
			this["drag"] = drag;			
		};
	}
};