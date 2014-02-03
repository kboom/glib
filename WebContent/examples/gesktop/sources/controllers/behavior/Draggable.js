var DraggableController = {
	name : "DraggableController",
	parent : "PositionableController",
	definition : function(System) {
		var log = System["logger"].createLog("DraggableController");

		/*
		 * View -> Model
		 */

		/*
		 * Model -> View
		 */

		return function() {
			var model = this["model"];
			var view = this["view"];

			var handle = view["dragHandle"];

			model.registerChangeListener("onDismiss", function() {
				handle.off("mousedown.drag");
			});
			
			model.registerChangeListener("onSummon", function() {
				handle.on("mousedown.drag", function(e) {
					view["root"].trigger("click");
					if(!model.isDraggingAllowed()) return;
					var documentView = $(document);
					var rootView = view["root"];
					
					var originView = rootView.parent();
					var routeView = model.getDragArea() || originView;
					var destinationView = model.getDropArea() || originView;

					var rootOffset = rootView.offset();
					var anchorOffsetX = e.clientX - rootOffset.left;
					var anchorOffsetY = e.clientY - rootOffset.top;
					model.setAnchorOffset(anchorOffsetX, anchorOffsetY);

					var routeOffset = routeView.offset();
					var routeOffsetX = routeOffset.left;
					var routeOffsetY = routeOffset.top;
					var routeWidth = routeView.width();
					var routeHeight = routeView.height();
					model.setDragAreaRect(routeOffsetX, routeOffsetY,
							routeWidth, routeHeight);

					var destinationOffset = destinationView.offset();
					var destinationOffsetX = destinationOffset.left;
					var destinationOffsetY = destinationOffset.top;
					var destinationWidth = destinationView.width();
					var destinationHeight = destinationView.height();
					model.setDropAreaRect(destinationOffsetX,
							destinationOffsetY, destinationWidth,
							destinationHeight);			

					var positionType = rootView.css("position");
					
					var acceptDragListener = model.registerChangeListener("acceptDrag", function() {
						rootView.detach();
						rootView.css({ position : positionType });
						rootView.appendTo(destinationView);
						//alert(destinationView.html());
					});
					
					var rejectDragListener = model.registerChangeListener("rejectDrag", function() {
						rootView.detach();
						rootView.css({ position : positionType });
						rootView.appendTo(originView);	
						//alert(originView.html());
					});
					
					var startDraggingListener = model.registerChangeListener("startDragging", function() {
						rootView.detach();
						rootView.css({ position: "absolute" });
						rootView.appendTo(routeView);
					});					
					
					routeView.on("mouseenter.drag", function(e) {						
						if(e.target !== routeView[0]) return;
						console.log("ENTERED ROUTE");
						model.assumeDraggable();
					});

					routeView.on("mouseleave.drag", function(e) {
						if(e.target !== routeView[0]) return;
						console.log("LEFT ROUTE");
						model.rejectDraggable();
					});

					destinationView.on("mouseenter.drag", function(e) {
						if(e.target !== destinationView[0]) return;
						console.log("ENTERED DEST");
						model.assumeDroppable();
					});

					destinationView.on("mouseleave.drag", function(e) {
						if(e.target !== destinationView[0]) return;
						console.log("LEFT DEST");
						//model.rejectDroppable();
					});

					documentView.on("mousemove.drag", function(e) {
						model.drag(e.pageX, e.pageY);
					});

					documentView.on("mouseup.drag", function() {
						documentView.off("mouseup.drag");
						routeView.off("mouseleave.drag");
						destinationView.off("mouseleave.drag");
						routeView.off("mouseenter.drag");
						destinationView.off("mouseenter.drag");
						documentView.off("mousemove.drag");
						
						model.stopDragging();
						
						model.dismissChangeListener("acceptDrag", acceptDragListener);
						model.dismissChangeListener("rejectDrag", rejectDragListener);
						model.dismissChangeListener("startDragging", startDraggingListener);
					});

					model.startDragging();
				});
			});

		};
	}
};