import { Card } from '../helpers/custom-card';
import { JsonCodec } from './json-codec'
declare var mxConstants: any;
declare var mxUtils: any;
declare var mxCodec: any;
declare var mxPerimeter: any;
declare var mxMultiplicity: any;

export class Helper {
	static verticalDistance: any = 100;
	static connectPreview = (graph) => {
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('UserObject');

		if (graph.connectionHandler.connectImage == null) {
			graph.connectionHandler.isConnectableCell = function (cell) {
				try {
					if (cell.value == "Test") {
						return true;
					}
				} catch (ex) {
				}
				return true;
			};
			mxEdgeHandler.prototype.isConnectableCell = function (cell) {
				return graph.connectionHandler.isConnectableCell(cell);
			};
		}

		graph.setConnectable(true);
		graph.setMultigraph(false);

		// Source nodes needs 1..2 connected Targets
		graph.multiplicities.push(new mxMultiplicity(
			true, "UserObject", null, null, 0, 0, ['Target'],
			'Cannot connect without anchor points!',
			''));

		// Target needs exactly one incoming connection from Source
		graph.multiplicities.push(new mxMultiplicity(
			false, 'Test', null, null, 0, 1, ['Source'],
			'Target Must Have 1 Source',
			'Wrong connection!'));
		// Target needs exactly one incoming connection from Source
		graph.multiplicities.push(new mxMultiplicity(
			false, 'UserObject', null, null, 1, 1, ['Test'],
			'Target Must Have 1 Source',
			'Wrong connection!'));

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
		mxConstants.TARGET_HIGHLIGHT_COLOR = 'none';
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
		Helper.setEdgeStyle(graph);
		new mxRubberband(graph);
		graph.getModel().beginUpdate();
		graph.foldingEnabled = false;
		graph.getModel().endUpdate();
		new mxHierarchicalLayout(graph).execute(graph.getDefaultParent());
		return graph
	}


	static customVertex(graph, addTriggerCallBackFunction: Function) {

		var cached = true;

		graph.convertValueToString = (cell) => {
			if (cached && cell.div != null) {
				// Uses cached label
				return cell.div;
			}
			else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'userobject') {
				// Returns a DOM for the labelalert("Hello");
				var div = document.createElement('div');
				div.innerHTML = cell.getAttribute('label');
				div.innerHTML = Card.startingStep();
				mxUtils.br(div);

				if (cached) {
					// Caches label
					cell.div = div;
				}
				if (div.getElementsByClassName('btnAddTrigger')[0]) {
					div.getElementsByClassName('btnAddTrigger')[0].addEventListener("click", () => {
						addTriggerCallBackFunction();
					});
				}
				return div;
			}
			else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'triggers') {
				// Returns a DOM for the label

				var div = document.createElement('div');
				div.innerHTML = cell.getAttribute('label');
				div.innerHTML = Helper.customTrigger();

				mxUtils.br(div);
				if (cached) {
					// Caches label
					cell.div = div;
				}
				return div;
			}
			return '';
		};
	}

	static loadXml(graph) {
		var xml = `<root>
		<UserObject id="2">
		<mxCell style="rounded=1;whiteSpace=wrap ;autosize=1;resizable=0;" vertex="1" connectable="0" parent="1">
		  <mxGeometry x="230" y="100" width="330" height="177" as="geometry" />
		</mxCell>
	  </UserObject>
	  <mxCell id="3" value="Test" style="port;image=../assets/circle.png;spacingLeft=18" vertex="1" parent="0">
		<mxGeometry x="0.98" y="0.84" width="16" height="16" relative="1" as="geometry" />
	  </mxCell></root>`;
		var doc = mxUtils.parseXml(xml);
		var codec = new mxCodec(xml);
		var elt = doc.documentElement.firstChild;
		var cells = [];
		while (elt != null) {
			cells.push(codec.decodeCell(elt));
			graph.refresh();
			elt = elt.nextSibling;
		}

		// graph.addCells(cells);
	}
	static getJsonModel(graph: any) {
		// debugger;
		const encoder = new JsonCodec();
		const jsonModel = encoder.decode(graph.getModel());
		var jsonNodes = {
			"graph": jsonModel
		}
		return encoder.stringifyWithoutCircular(jsonNodes)
	}

}
