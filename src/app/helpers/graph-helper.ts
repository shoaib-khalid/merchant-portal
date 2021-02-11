import { Injectable } from '@angular/core';
import { Card } from '../helpers/custom-card';
import { JsonCodec } from './json-codec';
import { Subject } from 'rxjs';
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

@Injectable()
export class Helper {
	v1: any;
	cardId: any = 0;
	selectedVertices: any = [];
	graph: any;
	isVertex: boolean;
	copyAction: any;
	vertexType: string;
	constructor() {

	}

	addAssets(graph) {
		mxClient.link('stylesheet', '../assets/css/mxGraph.css');
		this.graph = graph;
	}
	deleteMultipleVertices(graph) {
		for (var i = 0; i < this.selectedVertices.length; i++) {
			this.v1 = this.selectedVertices[i];
			graph.removeCells([this.selectedVertices[i]])[0];
		}
	}

	copyMultipleVertices(graph) {
		for (var i = 0; i < this.selectedVertices.length; i++) {
			this.copyVertex(graph, this.selectedVertices[i]);
		}
	}

	setColorToTransparent() {
		var ele: any = document.getElementsByClassName('flow-start-container');
		for (var i = 0; i < ele.length; i++) {
			ele[i].style.borderColor = "transparent";
		}
	}

	actionOnEvents(graph) {
		var editor = new mxEditor();
		// editor.graph = graph;
		document.addEventListener("click", (evt: any) => {
			try {

				if (evt.target.classList.contains("delete")) {
					graph.removeCells([this.v1]);

				} else if (evt.target.className === "copy") {
					this.copyVertex(graph, this.v1);
				}
				else {
					try {
						if (
							$(evt.target).closest(".card").length

						) {
							if (evt.ctrlKey === false) {
								this.selectedVertices = [this.v1];
								this.setColorToTransparent();
							} else {
								this.selectedVertices.push(this.v1);
							}

							document.getElementById("flow" + evt.target.id.match(/\d/g)[0]).style.borderColor = "#74fca1";
						} else {
							this.setColorToTransparent();
						}
					}
					catch (ex) {
						this.setColorToTransparent();
					}
				}
			} catch (ex) {
			}
		});

	}


	connectPreview = (graph) => {

		let previous_id = 0;
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('UserObject');

		graph.connectionHandler.isConnectableCell = (cell) => {
			return true;
		};
		mxEdgeHandler.prototype.isConnectableCell = (cell) => {
			return graph.connectionHandler.isConnectableCell(cell);
		};
		graph.addMouseListener(
			{
				mouseDown: (sender, evt) => {

					try {
						this.v1 = evt.sourceState.cell;
						this.isVertex = true;
						previous_id = evt.sourceState.cell.id;
					} catch (ex) {
						this.isVertex = false;
					}
				},
				mouseMove: (sender, evt) => {
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
				mouseUp: (sender, evt) => {

					try {
						var v2 = evt.sourceState.cell;
						JsonCodec.getIndividualJson(this.v1)

						var t_id = t_id = evt.sourceState.cell.id;
						// if (typeof (this.v1.id) === "string") {
						// 	this.v1.id = parseInt(this.v1.id.match(/\d/g)[0]);
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

	setEdgeStyle = (graph) => {
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

	setVertexStyle = (graph) => {
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

	graphConfigurations = (graph) => {
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

		graph.connectionHandler.createEdgeState = (me) => {
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
		graph.addListener(mxEvent.CELLS_REMOVED, (sender, evt) => {
			if (evt.getProperty('cells')) {
				let edges = evt.getProperty('cells').filter(m => m.edge);
				if (edges) {
					edges.forEach(edge => {
						this.setConnectFillColor(edge.source, "white");
					});
				}
			}
		});
		graph.connectionHandler.addListener(mxEvent.START, (sender, evt) => {
			console.log(evt)

			var sourceState = evt.getProperty('state');
			var source = sourceState.cell;
			this.setConnectFillColor(source, "white");
			if (source.edges && source.edges.length > 0) {
				var sourceEdges = source.edges.filter(m => m.source.id == source.id);
				if (sourceEdges && sourceEdges.length > 0) {
					sourceEdges.forEach(sourceEdge => {
						graph.getModel().remove(sourceEdge);
					});
				}
			}
		});

		graph.connectionHandler.addListener(mxEvent.CONNECT, (sender, evt) => {
			var edge = evt.getProperty('cell');
			var source = graph.getModel().getTerminal(edge, true);
			this.setConnectFillColor(source, "gray");
		});


	}
	customTrigger = (text) => {
		var strDigit;
		if (this.v1.div.firstChild.id) {
			strDigit = this.v1.div.firstChild.id;
		} else {
			strDigit = this.v1.div.firstChild.nextElementSibling.id;
		}
		const digit = this.digitFromString(strDigit);

		return `<div style="position: relative">		
		<button type="button" style="width:200px; overflow: hidden;text-overflow: ellipsis;margin-top:15px;" class="btn btn-primary btn-block btn-lg customTrigger`+ digit + `">	` + text + `
		</button>
		<svg height="20" width="20" class="connect-icon" style="position: absolute;	right: .5em; top: 50%; transform: translate(0,-50%);" >
		<circle cx="10" cy="10" r="8" stroke="gray" stroke-width="2" fill="white"></circle>
	  </svg>
		</div>
		
		`;
	}

	graphUpdate = (graph) => {
		this.setEdgeStyle(graph);
		new mxRubberband(graph);
		graph.getModel().beginUpdate();
		graph.foldingEnabled = false;
		graph.getModel().endUpdate();
		new mxHierarchicalLayout(graph).execute(graph.getDefaultParent());
		return graph
	}


	private copyVertex(graph: any, vertex: any) {
		var parent = graph.getDefaultParent();
		var vertices = graph.getChildVertices(parent);
		this.copyAction = true;
		let clone = vertex.value.cloneNode(true);
		let clonedDiv = null;
		if (vertex.div) {
			clonedDiv = $(vertex.div).clone(true)[0];
			const idNumber = vertices.length;
			clonedDiv.childNodes[1].id = "flow" + idNumber;
			clonedDiv.childNodes[1].childNodes[5].childNodes[5].id = 'card-body' + idNumber;
			clonedDiv.childNodes[1].childNodes[5].childNodes[3].id = "card-header" + idNumber;
			clonedDiv.childNodes[1].childNodes[5].childNodes[3].childNodes[3].childNodes[1].id = 'header' + idNumber;
			clonedDiv.childNodes[1].childNodes[5].childNodes[5].childNodes[1].id = "initial-message" + idNumber;
		}
		let clonedvertex = graph.insertVertex(vertex.getParent(), null, clone, (vertex.geometry.x + 30), vertex.geometry.y + 50, vertex.geometry.width, vertex.geometry.height, "rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0", null);
		if (clonedDiv) {
			clonedvertex.div = clonedDiv;
		}
		if (vertex.children && vertex.children.length > 0) {
			vertex.children.forEach((child: any) => {
				let clone = child.value.cloneNode(true);
				let clonedChildDiv = null;
				if (child.div) {
					clonedChildDiv = $(child.div).clone(true)[0];
				}
				let clonedChild = graph.insertVertex(clonedvertex, null, clone, child.geometry.x, child.geometry.y, child.geometry.width, child.geometry.height, "resizable=0;constituent=1;movable=0;strokeColor=none;", null);
				if (clonedChildDiv) {
					clonedChild.div = clonedChildDiv;
					clonedChildDiv.childNodes[0].childNodes[1].className = "btn btn-primary btn-block btn-lg customTrigger" + vertices.length;
				}
			});
			let initialMessage = clonedvertex.div.getElementsByClassName('initial-message');
			if (initialMessage && initialMessage.length > 0) {
				// initialMessage[0].remove();
			}
			if (vertex.children.length > 1) {
				var childHegiht = 0;
				let flowStarTriggerList = clonedvertex.div.querySelector('.flow-start-trigger-list');
				if (flowStarTriggerList) {
					let flowStarTriggerListHeight = flowStarTriggerList.style.getPropertyValue('height');
					flowStarTriggerListHeight = parseInt(flowStarTriggerListHeight, 10) + (childHegiht * (vertex.children.length - 1));
					flowStarTriggerList.style.setProperty('height', flowStarTriggerListHeight + 'px');
				}
			}
		}
		graph.refresh();
	}

	setConnectFillColor(source: any, color: string) {
		let connectIcon = source.div.getElementsByClassName("connect-icon");
		if (connectIcon && connectIcon.length > 0) {
			connectIcon = connectIcon[0];
			connectIcon.children[0].setAttribute("fill", color);
		}
	}

	customVertex(graph) {
		var cached = true;
		graph.convertValueToString = (cell) => {
			const objJson = JsonCodec.getIndividualJson(cell);
			this.cardId = graph.getChildVertices(graph.getDefaultParent()).length - 1;

			if (cached && cell.div != null) {
				// Uses cached label
				// this.bindCellEvents(cell.div, cell, graph);
				return cell.div;
			}
			else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'userobject') {
				// Returns a DOM for the labelalert("Hello");
				var div = document.createElement('div');
				div.innerHTML = cell.getAttribute('label');
				if (this.cardId < 1) {
					div.innerHTML = Card.startingStep(this.cardId++, 'play.png', 'Starting Step');
				} else {
					switch (this.vertexType) {
						case "TEXT_MESSAGE":
							div.innerHTML = Card.startingStep(this.cardId++, 'messenger.svg', "Message #" + (this.cardId - 1));
							break;
						case "ACTION":
							div.innerHTML = Card.action(this.cardId++, 'action.svg', "Action #" + (this.cardId - 1));
							break;
						case "CONDITION":
							div.innerHTML = Card.condition(this.cardId++, 'condition.svg', "Condition #" + (this.cardId - 1));
							break;
						case "IMMEDIATE_TEXT_MESSAGE":
							div.innerHTML = Card.quickReply(this.cardId++, 'reply.svg', "Quick Reply #" + (this.cardId - 1));
							break;
						case "HANDOVER":
							div.innerHTML = Card.handOver(this.cardId++, 'hand.svg', "Hand over #" + (this.cardId - 1));

							break;
						default:
					}
				} mxUtils.br(div);

				if (cached) {
					// Caches label
					cell.div = div;
				}
				this.bindCellEvents(div, cell, graph);
				return div;
			}
			else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'triggers') {
				// Returns a DOM for the label

				var div = document.createElement('div');
				div.innerHTML = cell.getAttribute('label');
				div.innerHTML = this.customTrigger("New Button");
				mxUtils.br(div);
				if (cached) {
					// Caches label
					cell.div = div;
				}
				return div;
			} else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'conditions') {
				// Returns a DOM for the label

				var div = document.createElement('div');
				div.innerHTML = cell.getAttribute('label');
				div.innerHTML = Card.conditionLine;
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

	private bindCellEvents(div: HTMLDivElement, cell: any, graph: any) {
		// if (div.getElementsByClassName('btnAddTrigger')[0]) {
		// (<any>div.getElementsByClassName('btnAddTrigger')[0]).onclick = (() => {
		// 	var doc = mxUtils.createXmlDocument();
		// 	let triggers = doc.createElement('triggers');

		// 	let initialMessage = cell.div.getElementsByClassName('initial-message');
		// 	if (initialMessage && initialMessage.length > 0) {
		// 		initialMessage[0].remove()
		// 		// cell.div.removeChild(initialMessage[0]);
		// 	}
		// 	let childLength = cell.children ? cell.children.filter((m: any) => !m.style.includes('port')).length : 0;
		// 	var yAxis = 70;
		// 	var childHegiht = 55;

		// 	if (childLength > 0) {
		// 		yAxis = yAxis + (childLength * childHegiht);
		// 		var current = cell.getGeometry();
		// 		current.height = current.height + childHegiht;
		// 		let flowStarTriggerList = cell.div.querySelector('.flow-start-trigger-list');
		// 		let flowStarTriggerListHeight = flowStarTriggerList.style.getPropertyValue('height');

		// 		flowStarTriggerListHeight = parseInt(flowStarTriggerListHeight, 10) + childHegiht;
		// 		flowStarTriggerList.style.setProperty('height', flowStarTriggerListHeight + 'px');
		// 		graph.cellsResized([cell], [current], false);
		// 		graph.refresh();
		// 	}
		// 	var trigger = graph.insertVertex(cell, null, triggers, 85, yAxis, 150, childHegiht, "resizable=0;constituent=1;movable=0;strokeColor=none;", null);


		// });
	}


	addTriggerUsingSidePanel(cell = this.v1) {

		var doc = mxUtils.createXmlDocument();
		let triggers = doc.createElement('triggers');

		let initialMessage = cell.div.getElementsByClassName('initial-message');
		if (initialMessage && initialMessage.length > 0) {
			// initialMessage[0].remove()
			// cell.div.removeChild(initialMessage[0]);
		}
		let childLength = cell.children ? cell.children.filter((m: any) => !m.style.includes('port')).length : 0;
		var yAxis = 160;
		var childHegiht = 55;

		yAxis = yAxis + (childLength * childHegiht);
		var current = cell.getGeometry();
		current.height = current.height + childHegiht;
		let flowStarTriggerList = cell.div.querySelector('.flow-start-trigger-list');
		let flowStarTriggerListHeight = flowStarTriggerList.style.getPropertyValue('height');

		flowStarTriggerListHeight = parseInt(flowStarTriggerListHeight, 10) + childHegiht;
		flowStarTriggerList.style.setProperty('height', flowStarTriggerListHeight + 'px');
		this.graph.cellsResized([cell], [current], false);
		this.graph.refresh();
		var trigger = this.graph.insertVertex(cell, null, triggers, 85, yAxis, 150, childHegiht, "resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;", null);

	}


	addConditionUsingSidePanel(cell = this.v1) {
		var doc = mxUtils.createXmlDocument();
		let triggers = doc.createElement('conditions');

		let childLength = cell.children ? cell.children.filter((m: any) => !m.style.includes('port')).length : 0;
		var yAxis = 160;
		var childHegiht = 30;

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
		var trigger = this.graph.insertVertex(cell, null, triggers, 85, yAxis, 70, childHegiht, "resizable=0;constituent=1;movable=0;strokeColor=none;", null);

	}


	digitFromString(str) {
		const digit = parseInt(str.match(/\d/g)[0]);
		return digit;
	}





}
