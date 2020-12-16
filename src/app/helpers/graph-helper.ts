declare var mxConnectionConstraint: any;
declare var mxConstants: any;
declare var mxUtils: any;
declare var mxCellState: any;
declare var mxPerimeter: any;
declare var mxGraphHandler: any;



export class Helper {

	static connectPreview = (graph) => {

		

		graph.setConnectable(true);
		graph.setMultigraph(false);
		// graph.connectionHandler.createEdgeState = function (me) {
		// 	var edge = graph.createEdge(null, null, null, null, null);

		// 	return new mxCellState(graph.view, edge, this.graph.getCellStyle(edge));
		// };

		// let graphHandler = new mxGraphHandler(graph);
        // graphHandler.htmlPreview = true;

		// Disables floating connections (only use with no connect image)
		// if (graph.connectionHandler.connectImage == null) {
		// 	graph.connectionHandler.isConnectableCell = function (cell) {
		// 		return false;
		// 	};
		// 	mxEdgeHandler.prototype.isConnectableCell = function (cell) {
		// 		return graph.connectionHandler.isConnectableCell(cell);
		// 	};
		// }

		// graph.getAllConnectionConstraints = function (terminal) {
		// 	if (terminal != null && this.model.isVertex(terminal.cell)) {
		// 		return [
		// 		// new mxConnectionConstraint(new mxPoint(0, 0), true),
		// 		// new mxConnectionConstraint(new mxPoint(1, 1), true)
		// 	];
		// 	}

		// 	return null;
		// };

		return graph;

	}

	static setEdgeStyle = (graph) => {
		var style = graph.getStylesheet().getDefaultEdgeStyle();
		style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
		style[mxConstants.STYLE_CURVED] = '1';
	}

	static setVertexStyle = (graph) => {
		var style1 = [];
		style1[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
		style1[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
		style1[mxConstants.STYLE_STROKECOLOR] = 'gray';
		style1[mxConstants.STYLE_ROUNDED] = true;
		style1[mxConstants.STYLE_FILLCOLOR] = 'white';
		style1[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
		style1[mxConstants.STYLE_FONTCOLOR] = 'black	';
		style1[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
		style1[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
		style1[mxConstants.STYLE_FONTSIZE] = '13';
		style1[mxConstants.STYLE_FONTSTYLE] = 1;
		style1[mxConstants.STYLE_FONTFAMILY] = 'Calibri';

        mxConstants.VERTEX_SELECTION_COLOR = 'none'

		graph.getStylesheet().putDefaultVertexStyle(style1);



		var style = new Object();
		style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
		style[mxConstants.STYLE_FONTCOLOR] = '#774400';
		style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
		style[mxConstants.STYLE_PERIMETER_SPACING] = '6';
		style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
		style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
		style[mxConstants.STYLE_FONTSIZE] = '10';
		style[mxConstants.STYLE_FONTSTYLE] = 2;
		style[mxConstants.STYLE_IMAGE_WIDTH] = '16';
		style[mxConstants.STYLE_IMAGE_HEIGHT] = '16';
		graph.getStylesheet().putCellStyle('port', style);
	}

	static graphConfigurations = (graph) => {

		graph.setPanning(true);
		graph.panningHandler.useLeftButtonForPanning = true;
		graph.setAllowDanglingEdges(false);
		graph.panningHandler.select = false;
		graph.view.setTranslate(120, 100);
		graph.setCellsEditable(false);
		graph.isPart = function (cell) {
			return this.getCurrentCellStyle(cell)['constituent'] == '1';
		};
		graph.constrainChildren = false;
		graph.extendParents = false;
		graph.extendParentsOnAdd = false;
		// Redirects selection to parent
		graph.selectCellForEvent = function (cell) {
			if (this.isPart(cell)) {
				cell = this.model.getParent(cell);
			}

			mxGraph.prototype.selectCellForEvent.apply(this, arguments);
		};

		// Overrides method to store a cell label in the model
		var cellLabelChanged = graph.cellLabelChanged;
		graph.cellLabelChanged = function (cell, newValue, autoSize) {
			if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'userobject') {
				// Clones the value for correct undo/redo
				var elt = cell.value.cloneNode(true);
				elt.setAttribute('label', newValue);
				newValue = elt;
			}

			cellLabelChanged.apply(this, arguments);
		};
	}

	static customTrigger = () => {
		return `<br> <button type="button" style="width:150px;"
		class="btn btn-primary btn-block btnAddTrigger btn-lg">Text</button>`;
	}

	static addTrigger() {
		return `<br> <button type="button" class="btn btn-outline-primary btn-block btnAddTrigger">Text</button>`;
	}

	static graphUpdate = (graph) => {
		var parent = graph.getDefaultParent();
		Helper.setEdgeStyle(graph);
		new mxRubberband(graph);
		var parent = graph.getDefaultParent();
		graph.getModel().beginUpdate();
		graph.foldingEnabled = false;
		graph.getModel().endUpdate();
		new mxHierarchicalLayout(graph).execute(graph.getDefaultParent());
		return graph;
	}


}