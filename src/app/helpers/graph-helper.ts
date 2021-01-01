import { Card } from '../helpers/custom-card';

declare var mxConstants: any;
declare var mxUtils: any;
declare var mxCodec: any;
declare var mxPerimeter: any;
declare var mxMultiplicity: any;
declare var mxClient: any;
declare var mxEditor: any;
export class Helper {
	static v1: any;
	static verticalDistance: any = 100;
	static cardId: any = 0;
	static selectedVertices: any = [];

	static addAssets() {
		mxClient.link('stylesheet', '../assets/css/mxGraph.css');
	}



	static deleteMultipleVertices(graph) {
		for (var i = 0; i < this.selectedVertices.length; i++) {
			graph.getModel().remove(this.selectedVertices[i]);
		}
	}

	static setColorToTransparent() {
		var ele: any = document.getElementsByClassName('flow-start-container');
		for (var i = 0; i < ele.length; i++) {
			ele[i].style.borderColor = "transparent";
		}
	}

	static actionOnEvents(graph) {
		var editor = new mxEditor();
		// editor.graph = graph;
		document.addEventListener("click", (evt: any) => {

			try {
				if (evt.target.classList.contains("delete")) {
					graph.getModel().remove(Helper.v1);
				} else if (evt.target.className === "copy") {
						// console.log(graph.addCell(Helper.v1,graph.getDefaultParent()))
						// graph.refresh();
				} else {
					try {
						var className = evt.target.className;
						if (className.includes("custom-card") || className.includes("header") ||
							className.includes("card-body") || className.includes("card-header")) {

							if (evt.ctrlKey === false) {
								this.selectedVertices = [];
								this.setColorToTransparent();
							} else {
								this.selectedVertices.push(Helper.v1)
							}

							document.getElementById("flow" + evt.target.id.match(/\d/g)[0]).style.borderColor = "#74fca1";
							this.selectedVertices.push(Helper.v1)
						}

					}
					catch (ex) {
						this.setColorToTransparent();
					}
				}
			} catch (ex) { 

				console.log(ex)

			}
		});

	}

	static connectPreview = (graph) => {

		let previous_id = 0;
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('UserObject');

		if (graph.connectionHandler.connectImage == null) {
			graph.connectionHandler.isConnectableCell = function (cell) {
				try {

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
					evt = evt.evt;
					var className = evt.target.className;
					try {
						var targetId = evt.target.id.match(/\d/g)[0];

						if ((className.includes("custom-card") || className.includes("header") ||
							className.includes("card-body") || className.includes("card-header"))
							&& !(document.getElementById("flow" + targetId).style.borderColor === ("rgb(116, 252, 161)"))) {

							document.getElementById("flow" + evt.target.id.match(/\d/g)[0]).style.borderColor = "blue";
						} else {

							this.setColorToTransparent();
						}
					} catch (ex) {
						var ele: any = document.getElementsByClassName('flow-start-container');
						for (var i = 0; i < ele.length; i++) {
							if (ele[i].style.borderColor != "rgb(116, 252, 161)") {
								ele[i].style.borderColor = "transparent";
							}
						}
					}


				},
				mouseUp: function (sender, evt) {

					try {
						var v2 = evt.sourceState.cell;
						var t_id = t_id = evt.sourceState.cell.id;
						if (typeof (Helper.v1.id) === "string") {
							Helper.v1.id = parseInt(Helper.v1.id.match(/\d/g)[0]);
						}
						if (typeof (t_id) === "string") {
							t_id = parseInt(t_id.match(/\d/g)[0]);
						}

						if ((t_id != Helper.v1.id) && (v2.value != "Test") && (t_id - Helper.v1.id != -1)) {

							if ((v2.value.localName === "InitialMessage")) {
								v2 = evt.sourceState.cell.parent;
							}

							// if (v2.edges || v2.children[1].edges) {

							// 	if (v2.children[1].edges[0].target.id === Helper.v1.parent.id) {
							// 		return;
							// 	}
							// }

							if (Helper.v1.edges) {
								for (var i = 0; i < Helper.v1.edges.length; i++) {
									graph.getModel().remove(Helper.v1.edges[i]);
								}
							}

							graph.insertEdge(graph.getDefaultParent(), null, '', Helper.v1, v2);

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
		style1[mxConstants.STYLE_STROKECOLOR] = 'none';
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
				Helper.bindCellEvents(cell.div, cell, graph);
				return cell.div;
			}
			else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'userobject') {
				// Returns a DOM for the labelalert("Hello");
				var div = document.createElement('div');
				div.innerHTML = cell.getAttribute('label');
				div.innerHTML = Card.startingStep(this.cardId++);
				mxUtils.br(div);

				if (cached) {
					// Caches label
					cell.div = div;
				}
				Helper.bindCellEvents(div, cell, graph);
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

	private static bindCellEvents(div: HTMLDivElement, cell: any, graph: any) {
		if (div.getElementsByClassName('btnAddTrigger')[0]) {
			(<any>div.getElementsByClassName('btnAddTrigger')[0]).onclick = (() => {
				debugger;
				var doc = mxUtils.createXmlDocument();
				let triggers = doc.createElement('triggers');
				let initialMessage = cell.children.find(m => m.value.localName === "InitialMessage");
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
				let flowStarTriggerListHeight = flowStarTriggerList.style.getPropertyValue('height');

				if (flowStarTriggerListHeight) {
					flowStarTriggerListHeight = parseInt(flowStarTriggerListHeight, 10) + childHegiht;
				} else {
					flowStarTriggerListHeight = childHegiht;
				}
				flowStarTriggerList.style.setProperty('height', flowStarTriggerListHeight + 'px');
				graph.refresh();
			});
		}
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
