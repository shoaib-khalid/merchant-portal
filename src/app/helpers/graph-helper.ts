import { Card } from '../helpers/custom-card';
import { JsonCodec } from './json-codec'
declare var mxConstants: any;
declare var mxUtils: any;
declare var mxCodec: any;
declare var mxPerimeter: any;
declare var mxMultiplicity: any;
declare var mxClient: any;
declare var mxEditor: any;
declare var mxClipboard: any;
export class Helper {
	static v1: any;
	static verticalDistance: any = 100;

	static addAssets() {
		mxClient.link('stylesheet', '../assets/css/mxGraph.css');
	}

	static deleteEvent(graph) {
		var editor = new mxEditor();
		// editor.graph = graph;
		document.addEventListener("click", (evt: any) => {
			try {
				if (evt.target.id === "delete") {
					graph.getModel().remove(Helper.v1);
				} else if (evt.target.id === "copy") {
					console.log("Inside copy")
					// var cells = new Array();
					// cells = graph.getSelectionCells();
					// // debugger;
					// mxClipboard.copy(graph);
					// mxClipboard.paste(graph);

				}
			} catch (ex) { }
		})
	}

	static connectPreview = (graph) => {

		let previous_id = 0;
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('UserObject');

		if (graph.connectionHandler.connectImage == null) {
			graph.connectionHandler.isConnectableCell = function (cell) {
				try {


					// console.log(cell)

					if (cell.value === "Test") {
						return true;
					}

				} catch (ex) {
				}
				return false;
			};
			mxEdgeHandler.prototype.isConnectableCell = function (cell) {
				return graph.connectionHandler.isConnectableCell(cell);
			};
		}
		graph.addMouseListener(
			{
				mouseDown: function (sender, evt) {

					try {
						Helper.v1 = evt.sourceState.cell;
						previous_id = evt.sourceState.cell.id;
					} catch (ex) { }
				},
				mouseMove: function (sender, evt) {

				},
				mouseUp: function (sender, evt) {
					console.log(evt)
					try {
						var t_id = evt.sourceState.cell.id;
						if (!(t_id === Helper.v1.id) && (evt.sourceState.cell.value != "Test") && (Helper.v1.id < t_id)) {

							
					
							// console.log("Origin edges")
							// console.log(Helper.v1)
							// console.log("Target")
							// console.log(evt.sourceState.cell)
							if(evt.sourceState.cell.edges){
								if(evt.sourceState.cell.edges.length>0){
									return;
								}
							}

							if(Helper.v1.edges){
								for (var i=0;i<Helper.v1.edges.length;i++){
									graph.getModel().remove(Helper.v1.edges[i]);
									// Helper.v1.removeEdge(Helper.v1.edges[i]);
								}
							}
							


							if ((evt.sourceState.cell.value.localName === "InitialMessage")) {
								evt.sourceState.cell = evt.sourceState.cell.parent;
							}

							if ((parseInt(t_id.match(/\d/g)[0]) > Helper.v1.id)) {
								graph.insertEdge(graph.getDefaultParent(), null, '', Helper.v1, evt.sourceState.cell);
							}

						
	
						
						}
					} catch (ex) {

					}
					previous_id = 0;

				}
			});
		graph.setConnectable(true);
		graph.setMultigraph(false);


		graph.multiplicities.push(new mxMultiplicity(
			false, 'Test', null, null, 0, 1, ['Source'],
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


	static customVertex(graph) {
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
						debugger;
						var doc = mxUtils.createXmlDocument();
						let triggers = doc.createElement('triggers');
						let initialMessage = cell.children.find(m => m.id == 'InitialMesssage' + "_" + cell.id);
						graph.removeCells([initialMessage], true);
						let childLength = cell.children.filter((m: any) => !m.style.includes('port')).length;
						var yAxis = 100;
						var childHegiht = 60;
						if (childLength > 0) {
							yAxis = yAxis + (childLength * childHegiht);
						}
						var v2 = graph.insertVertex(cell, null, triggers, 100, yAxis, 135, 40, "resizable=0;constituent=1;movable=0;strokeColor=none;", null);
						var current = cell.getGeometry();
						current.height = current.height + childHegiht;
						if (childLength > 0) {
							graph.cellsResized([cell], [current], false);
						}
						let flowStarTriggerList = cell.div.querySelector('.flow-start-trigger-list');
						let flowStarTriggerListHeight = flowStarTriggerList.style.getPropertyValue('height')

						if (flowStarTriggerListHeight) {
							flowStarTriggerListHeight = parseInt(flowStarTriggerListHeight, 10) + childHegiht;
						} else {
							flowStarTriggerListHeight = childHegiht;
						}
						flowStarTriggerList.style.setProperty('height', flowStarTriggerListHeight + 'px');
						graph.refresh();
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
			else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'initialmessage') {
				// Returns a DOM for the label

				var div = document.createElement('div');
				div.innerHTML = cell.getAttribute('label');
				div.innerHTML = Card.InitialMesssage;

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

}
