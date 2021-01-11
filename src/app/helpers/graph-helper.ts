import { Card } from '../helpers/custom-card';
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
declare var mxLog: any;


export class Helper {
	static v1: any;
	static verticalDistance: any = 100;
	static cardId: any = 0;
	static selectedVertices: any = [];
	static graph:any;

	static addAssets(graph) {
		mxClient.link('stylesheet', '../assets/css/mxGraph.css');
		this.graph=graph;
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

				if (evt.target.id.includes("card-header")) {

					var id = evt.target.id;
					var text = (<HTMLInputElement>document.getElementById("header" + id.match(/\d/g)[0])).innerHTML;
					(<HTMLInputElement>document.getElementById("vertex-title")).value = text;
					document.getElementById("sideNavTest").click();
					
				}

				if (evt.target.classList.contains("delete")) {
					graph.getModel().remove(Helper.v1);
				} else if (evt.target.className === "copy") {
					// console.log(graph.addCell(Helper.v1,graph.getDefaultParent()))
					// graph.refresh();
				}

				else {
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

						// if ((t_id != Helper.v1.id) && (v2.value != "Test") && (t_id - Helper.v1.id != -1)) {

						// 	if ((v2.value.localName === "InitialMessage")) {
						// 		v2 = evt.sourceState.cell.parent;
						// 	}

						// 	// if (v2.edges || v2.children[1].edges) {

						// 	// 	if (v2.children[1].edges[0].target.id === Helper.v1.parent.id) {
						// 	// 		return;
						// 	// 	}
						// 	// }

						// 	if (Helper.v1.edges) {
						// 		for (var i = 0; i < Helper.v1.edges.length; i++) {
						// 			graph.getModel().remove(Helper.v1.edges[i]);
						// 		}
						// 	}

						// 	graph.insertEdge(graph.getDefaultParent(), null, '', Helper.v1, v2);

						// }
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

			// var target = graph.getModel().getTerminal(edge, false);

			// var style = graph.getCellStyle(edge);
			// var sourcePortId = style[mxConstants.STYLE_SOURCE_PORT];
			// var targetPortId = style[mxConstants.STYLE_TARGET_PORT];

			// mxLog.show();
			// mxLog.debug('connect', edge, source.id, target.id, sourcePortId, targetPortId);
		});

		// var highlight = new mxCellTracker(graph, '#3bbdfe');
		// mxConnectionHandler.prototype.connectImage = new mxImage('../../assets/arrow-circle-right.svg', 25, 25);
		// mxConnectionHandler.prototype.connectImage = new mxImage('', 25, 25);
	}
	static customTrigger = (text) => {
		return `<div style="position: relative">		
		<button type="button" style="width:150px; margin-top:15px;" class="btn btn-primary btn-block btnAddTrigger btn-lg">	` + text + `
		
		
		
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
			if (cached && cell.div != null) {
				// Uses cached label
				Helper.bindCellEvents(cell.div, cell, graph);
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
				div.innerHTML = Helper.customTrigger("test");

				mxUtils.br(div);
				if (cached) {
					// Caches label
					cell.div = div;
				}
				return div;
			}
			// else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'initialmessage') {
			// 	// Returns a DOM for the label

			// 	var div = document.createElement('div');
			// 	div.innerHTML = cell.getAttribute('label');
			// 	div.innerHTML = Card.InitialMesssage;

			// 	mxUtils.br(div);
			// 	if (cached) {
			// 		// Caches label
			// 		cell.div = div;
			// 	}
			// 	return div;
			// }
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


		static addTriggerUsingSidePanel(cell=Helper.v1){
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
				this.graph.cellsResized([cell], [current], false);
				this.graph.refresh();
			}
			var trigger = this.graph.insertVertex(cell, null, triggers, 85, yAxis, 150, childHegiht, "resizable=0;constituent=1;movable=0;strokeColor=none;", null);

		}
	// }
}
