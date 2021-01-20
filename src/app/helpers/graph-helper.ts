import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { Card } from '../helpers/custom-card';
import { ApiCallsService } from '../services/api-calls.service';
import { JsonCodec } from './json-codec';
declare var mxConstants: any;
declare var mxUtils: any;
declare var mxPerimeter: any;
declare var mxMultiplicity: any;
declare var mxClient: any;
declare var mxEditor: any;
declare var mxConnectionHandler: any;
declare var mxRectangle: any;
declare var mxCellMarker: any;
declare var mxCellState: any;
declare var mxEvent: any;
declare var mxPolyline: any;
declare var mxGraphHandler: any;
declare var $: any;

export class Helper {
	static v1: any;
	static cardId: any = 0;
	static selectedVertices: any = [];
	static graph: any;
	static isVertex: boolean;

	constructor(apiCalls: ApiCallsService) {

	}

	static addAssets(graph) {
		mxClient.link('stylesheet', '../assets/css/mxGraph.css');
		this.graph = graph;
	}
	static deleteMultipleVertices(graph) {
		for (var i = 0; i < this.selectedVertices.length; i++) {
			graph.removeCells([this.selectedVertices[i]]);
		}
	}

	static copyMultipleVertices(graph) {
		for (var i = 0; i < this.selectedVertices.length; i++) {
			Helper.copyVertex(graph, this.selectedVertices[i]);
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
				if (evt.target.id.includes("card-header")) {
					var id = evt.target.id;
					var text = (<HTMLInputElement>document.getElementById("header" + id.match(/\d/g)[0])).innerHTML;
					(<HTMLInputElement>document.getElementById("vertex-title")).value = text;
				}

				if (evt.target.classList.contains("delete")) {
					graph.removeCells([Helper.v1]);

				} else if (evt.target.className === "copy") {
					Helper.copyVertex(graph, Helper.v1);
				}
				else {
					try {
						var className = evt.target.className;
						if (
							$(evt.target).closest(".card").length

							// className.includes("custom-card") || className.includes("header") ||
							// 	className.includes("card-body") || className.includes("card-header")

						) {
							if (evt.ctrlKey === false) {
								this.selectedVertices = [Helper.v1];
								this.setColorToTransparent();
							} else {
								this.selectedVertices.push(Helper.v1);
							}
							document.getElementById("flow" + evt.target.id.match(/\d/g)[0]).style.borderColor = "#74fca1";
						}

					}
					catch (ex) {
						this.setColorToTransparent();
					}
				}
			} catch (ex) {

				// console.log(ex)

			}
		});

	}


	static connectPreview = (graph) => {

		let previous_id = 0;
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('UserObject');

		graph.connectionHandler.isConnectableCell = function (cell) {
			return true;
		};
		mxEdgeHandler.prototype.isConnectableCell = function (cell) {
			return graph.connectionHandler.isConnectableCell(cell);
		};
		graph.addMouseListener(
			{
				mouseDown: function (sender, evt) {

					try {
						Helper.v1 = evt.sourceState.cell;
						Helper.isVertex = true;
						previous_id = evt.sourceState.cell.id;

					} catch (ex) {
						// console.log(ex);
						Helper.isVertex = false;
					}
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
						JsonCodec.getIndividualJson(Helper.v1)

						var t_id = t_id = evt.sourceState.cell.id;
						// if (typeof (Helper.v1.id) === "string") {
						// 	Helper.v1.id = parseInt(Helper.v1.id.match(/\d/g)[0]);
						// }
						if (typeof (t_id) === "string") {
							t_id = parseInt(t_id.match(/\d/g)[0]);
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
		style[mxConstants.STYLE_CURVED] = true;
		// style[mxConstants.STYLE_ROUNDED] = true;
		style[mxConstants.STYLE_STROKEWIDTH] = 2;
		// style[mxConstants.STYLE_EXIT_X] = 1; // center
		// style[mxConstants.STYLE_EXIT_Y] = 0.8; // bottom
		style[mxConstants.STYLE_EXIT_PERIMETER] = 0; // disabled
		style[mxConstants.STYLE_ENTRY_X] = 0; // center
		style[mxConstants.STYLE_ENTRY_Y] = 0; // top
		// style[mxConstants.STYLE_ENTRY_PERIMETER] = 0; // disabled
		style[mxConstants.STYLE_STROKECOLOR] = 'gray';

		mxConstants.EDGE_SELECTION_STROKEWIDTH = 2;
		mxConstants.EDGE_SELECTION_DASHED = false;
		mxConstants.INVALID_COLOR = '#74fca1';

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
		style1[mxConstants.STYLE_FONTFAMILY]

		mxConstants.VERTEX_SELECTION_COLOR = 'none'
		mxConstants.TARGET_HIGHLIGHT_COLOR = 'none';

		mxConstants.VERTEX_SELECTION_STROKEWIDTH = '0';
		style1[mxConstants.VERTEX_SELECTION_STROKEWIDTH] = '0';
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
		mxRectangle.prototype.getCenterX = function () {
			let x = this.x + this.width + 10;
			if (this.view && this.view.graph && this.view.graph.isPart) {
				if (this.view.graph.isPart(this.cell)) {
					x = this.x + this.width - 10;
				}
			}

			return x;
		};
		mxRectangle.prototype.getCenterY = function () {
			let y = this.y + this.height / 2;
			if (this.view && this.view.graph && this.view.graph.isPart) {
				if (!this.view.graph.isPart(this.cell)) {
					y = this.y + this.height - (((this.height) * 0.2));
				}
			}
			return y;
		};

		mxCellMarker.prototype.getMarkerColor = function (evt, state, isValid) { }
		mxConnectionHandler.prototype.livePreview = true;

		graph.connectionHandler.createEdgeState = function (me) {
			var edge = graph.createEdge(null, null, null, null, null, 'edgeStyle=elbowEdgeStyle');
			let style = this.graph.getCellStyle(edge);
			style[mxConstants.STYLE_DASHED] = "false";
			return new mxCellState(this.graph.view, edge, style);
		}
		mxConnectionHandler.prototype.createShape = function () {
			// Creates the edge preview
			var shape = (this.livePreview && this.edgeState != null) ?
				this.graph.cellRenderer.createShape(this.edgeState) :
				new mxPolyline([], mxConstants.INVALID_COLOR);
			shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ?
				mxConstants.DIALECT_VML : mxConstants.DIALECT_SVG;
			shape.scale = this.graph.view.scale;
			shape.pointerEvents = false;
			shape.isDashed = true;
			shape.init(this.graph.getView().getOverlayPane());
			mxEvent.redirectMouseEvents(shape.node, this.graph, null);

			return shape;
		};


		mxGraphHandler.prototype.redrawHandles = function (states) { }
		graph.addListener(mxEvent.CELLS_REMOVED, function (sender, evt) {
			if (evt.getProperty('cells')) {
				let edges = evt.getProperty('cells').filter(m => m.edge);
				if (edges) {
					edges.forEach(edge => {
						Helper.setConnectFillColor(edge.source, "white");
					});
				}
			}
		});
		graph.connectionHandler.addListener(mxEvent.START, function (sender, evt) {

			var sourceState = evt.getProperty('state');
			var source = sourceState.cell;
			Helper.setConnectFillColor(source, "white");
			if (source.edges && source.edges.length > 0) {
				var sourceEdges = source.edges.filter(m => m.source.id == source.id);
				if (sourceEdges && sourceEdges.length > 0) {
					sourceEdges.forEach(sourceEdge => {
						graph.getModel().remove(sourceEdge);
					});
				}
			}
		});

		graph.connectionHandler.addListener(mxEvent.CONNECT, function (sender, evt) {
			var edge = evt.getProperty('cell');
			var source = graph.getModel().getTerminal(edge, true);
			Helper.setConnectFillColor(source, "gray");
		});


	}
	static customTrigger = (text) => {

		var strDigit;
		if (Helper.v1.div.firstChild.id) {
			strDigit = Helper.v1.div.firstChild.id;
		} else {
			strDigit = Helper.v1.div.firstChild.nextElementSibling.id;
		}

		const digit = Helper.digitFromString(strDigit);

		return `<div style="position: relative">		
		<button type="button" style="width:150px; margin-top:15px;" class="btn btn-primary btn-block btn-lg customTrigger`+ digit + `">	` + text + `
		</button>
		<svg height="20" width="20" class="connect-icon" style="position: absolute;	right: .5em; top: 50%; transform: translate(0,-50%);" >
		<circle cx="10" cy="10" r="8" stroke="gray" stroke-width="2" fill="white"></circle>
	  </svg>
		</div>
		
		`;
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


	private static copyVertex(graph: any, vertex: any) {
		let clone = vertex.value.cloneNode(true);
		let clonedvertex = graph.insertVertex(vertex.getParent(), null, clone, (vertex.geometry.x + 30), vertex.geometry.y, vertex.geometry.width, vertex.geometry.height, "rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0", null);
		if (vertex.children && vertex.children.length > 0) {
			vertex.children.forEach((child: any) => {
				let clonedChild = child.value.cloneNode(true);
				graph.insertVertex(clonedvertex, null, clonedChild, child.geometry.x, child.geometry.y, child.geometry.width, child.geometry.height, "resizable=0;constituent=1;movable=0;strokeColor=none;", null);
			});
			let initialMessage = clonedvertex.div.getElementsByClassName('initial-message');
			if (initialMessage && initialMessage.length > 0) {
				initialMessage[0].remove();
			}
			if (vertex.children.length > 1) {
				var childHegiht = 55;
				let flowStarTriggerList = clonedvertex.div.querySelector('.flow-start-trigger-list');
				if (flowStarTriggerList) {
					let flowStarTriggerListHeight = flowStarTriggerList.style.getPropertyValue('height');
					flowStarTriggerListHeight = parseInt(flowStarTriggerListHeight, 10) + (childHegiht * (vertex.children.length - 1));
					flowStarTriggerList.style.setProperty('height', flowStarTriggerListHeight + 'px');
				}
			}
		}
	}

	private static setConnectFillColor(source: any, color: string) {
		let connectIcon = source.div.getElementsByClassName("connect-icon");
		if (connectIcon && connectIcon.length > 0) {
			connectIcon = connectIcon[0];
			connectIcon.children[0].setAttribute("fill", color);
		}
	}

	static customVertex(graph) {
		var cached = true;
		graph.convertValueToString = (cell) => {
			const objJson = JsonCodec.getIndividualJson(cell);
			this.cardId = graph.getChildVertices(graph.getDefaultParent()).length - 1;

			if (cached && cell.div != null) {
				// Uses cached label
				// Helper.bindCellEvents(cell.div, cell, graph);
				return cell.div;
			}
			else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'userobject') {
				// Returns a DOM for the labelalert("Hello");
				var div = document.createElement('div');
				div.innerHTML = cell.getAttribute('label');
				if (this.cardId < 1) {
					div.innerHTML = Card.startingStep(this.cardId++, 'play.png', 'Starting Step');
				} else {
					div.innerHTML = Card.startingStep(this.cardId++, 'messenger.svg', "New Message #" + (this.cardId - 1));
				} mxUtils.br(div);

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
				div.innerHTML = Helper.customTrigger("New Button");
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
		// if (div.getElementsByClassName('btnAddTrigger')[0]) {
		(<any>div.getElementsByClassName('btnAddTrigger')[0]).onclick = (() => {
			var doc = mxUtils.createXmlDocument();
			let triggers = doc.createElement('triggers');

			let initialMessage = cell.div.getElementsByClassName('initial-message');
			if (initialMessage && initialMessage.length > 0) {
				initialMessage[0].remove()
				// cell.div.removeChild(initialMessage[0]);
			}
			let childLength = cell.children ? cell.children.filter((m: any) => !m.style.includes('port')).length : 0;
			var yAxis = 70;
			var childHegiht = 55;

			if (childLength > 0) {
				yAxis = yAxis + (childLength * childHegiht);
				var current = cell.getGeometry();
				current.height = current.height + childHegiht;
				let flowStarTriggerList = cell.div.querySelector('.flow-start-trigger-list');
				let flowStarTriggerListHeight = flowStarTriggerList.style.getPropertyValue('height');

				flowStarTriggerListHeight = parseInt(flowStarTriggerListHeight, 10) + childHegiht;
				flowStarTriggerList.style.setProperty('height', flowStarTriggerListHeight + 'px');
				graph.cellsResized([cell], [current], false);
				graph.refresh();
			}
			var trigger = graph.insertVertex(cell, null, triggers, 85, yAxis, 150, childHegiht, "resizable=0;constituent=1;movable=0;strokeColor=none;", null);


		});
	}


	static addTriggerUsingSidePanel(cell = Helper.v1) {

		var doc = mxUtils.createXmlDocument();
		let triggers = doc.createElement('triggers');

		let initialMessage = cell.div.getElementsByClassName('initial-message');
		if (initialMessage && initialMessage.length > 0) {
			// initialMessage[0].remove()
			// cell.div.removeChild(initialMessage[0]);
		}
		let childLength = cell.children ? cell.children.filter((m: any) => !m.style.includes('port')).length : 0;
		var yAxis = 130;
		var childHegiht = 55;

		// if (childLength > 0) {
		yAxis = yAxis + (childLength * childHegiht);
		var current = cell.getGeometry();
		current.height = current.height + childHegiht;
		let flowStarTriggerList = cell.div.querySelector('.flow-start-trigger-list');
		let flowStarTriggerListHeight = flowStarTriggerList.style.getPropertyValue('height');

		flowStarTriggerListHeight = parseInt(flowStarTriggerListHeight, 10) + childHegiht;
		flowStarTriggerList.style.setProperty('height', flowStarTriggerListHeight + 'px');
		this.graph.cellsResized([cell], [current], false);
		this.graph.refresh();
		// }
		var trigger = this.graph.insertVertex(cell, null, triggers, 85, yAxis, 150, childHegiht, "resizable=0;constituent=1;movable=0;strokeColor=none;", null);

	}


	static digitFromString(str) {
		const digit = parseInt(str.match(/\d/g)[0]);
		return digit;
	}


}
