var WidgetUtils = (function(JVCApi) {
	
	var desktop = JVCApi.inject("DesktopController").model;
	var contentPane = JVCApi.inject("ContentPaneController").model;
	var launchPane = JVCApi.inject("LaunchPaneController").model;
	var menuToolbar = JVCApi.inject("MenuToolbarController").model;
	var navToolbar = JVCApi.inject("NavToolbarController").model;	
		
	
	var distributeEvenlyHorizontalFull = function(attr) {
		var attr = attr || {};
		var activeWorkspace = contentPane.getActiveWorkspace();
		var availWidth = activeWorkspace.getWidth();
		var availHeight = activeWorkspace.getHeight();
		
		var widgetCount = 0;
		activeWorkspace.walkThroughWidgets(function(widget) {
			widgetCount++;
		});
		
		if(widgetCount < 0) return;
		attr.margin && (equalWidth += 2*attr.margin);
		var equalWidth = availWidth / widgetCount;
		
		var hAlignmentBaseline = 0;
		activeWorkspace.walkThroughWidgets(function(widget) {
			widget.setWidth(equalWidth);
			widget.setHeight(availHeight);
			widget.setOffsetTop(attr.marginTop || 0);
			widget.setOffsetLeft(hAlignmentBaseline);
			hAlignmentBaseline += equalWidth;
		});				
	};
	
	var distributeEvenlyHorizontal = function(attr) {
		var attr = attr || {};
		var activeWorkspace = contentPane.getActiveWorkspace();
		var availWidth = activeWorkspace.getWidth();
		
		var widgetCount = 0;
		activeWorkspace.walkThroughWidgets(function(widget) {
			widgetCount++;
		});
		
		if(widgetCount < 0) return;
		attr.margin && (equalWidth += 2*attr.margin);
		var equalWidth = availWidth / widgetCount;
		
		var hAlignmentBaseline = 0;
		activeWorkspace.walkThroughWidgets(function(widget) {
			widget.setWidth(equalWidth);
			widget.setOffsetLeft(hAlignmentBaseline);
			hAlignmentBaseline += equalWidth;
		});				
	};
	
	var distributeEvenlyVertical = function(attr) {
		var attr = attr || {};
		var activeWorkspace = contentPane.getActiveWorkspace();
		var availHeight = activeWorkspace.getHeight();
		
		var widgetCount = 0;
		activeWorkspace.walkThroughWidgets(function(widget) {
			widgetCount++;
		});
		
		if(widgetCount < 0) return;
		attr.margin && (equalWidth += 2*attr.margin);
		var equalHeight = availHeight / widgetCount;
		
		var vAlignmentBaseline = 0;
		activeWorkspace.walkThroughWidgets(function(widget) {
			widget.setHeight(equalHeight);
			widget.setOffsetTop(vAlignmentBaseline);
			vAlignmentBaseline += equalHeight;
		});				
	};
	
	var distributeCascade = function(attr) {
		var attr = attr || {};
		var activeWorkspace = contentPane.getActiveWorkspace();
		var availHeight = activeWorkspace.getHeight();
		var availWidth = activeWorkspace.getWidth();
		
		var widgetCount = 0;
		activeWorkspace.walkThroughWidgets(function(widget) {
			widgetCount++;
			widget.deactivate();
		});
		
		var stepX = 35;
		var stepY = 35; 
		
		var width = availWidth - widgetCount * stepX;
		var height = availHeight - widgetCount * stepY;
		
		
		var cbaselineX = 0;
		var cbaselineY = 0;
		
		activeWorkspace.walkThroughWidgets(function(widget) {
			widget.setHeight(height);
			widget.setWidth(width);
			widget.setOffset(cbaselineX, cbaselineY);	
			
			widget.activate();

			cbaselineX += stepX;
			cbaselineY += stepY;
		});				
	};	
	
	var removeUnused = function(attr) {
		var attr = attr || {};
		contentPane.walkThroughWorkspaces(function(workspace) {
			if(workspace.getWidgetCount() == 0) contentPane.removeWorkspace(workspace);
		});
	};
	
	
	/**
	 * Returns functions to be applied inside a launcher dresser.
	 */
	return {
		"distributeEvenlyHorizontal" : distributeEvenlyHorizontal,
		"distributeEvenlyVertical" : distributeEvenlyVertical,
		"distributeEvenlyHorizontalFull" : distributeEvenlyHorizontalFull,
		"distributeCascade" : distributeCascade,
		"removeUnused" : removeUnused
	};
	
});