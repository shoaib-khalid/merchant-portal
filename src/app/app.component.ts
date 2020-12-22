import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Helper } from './helpers/graph-helper';
import { JsonCodec } from './helpers/json-codec';

declare var mxUtils: any;
declare var mxGraphModel: any;
declare var mxCodecRegistry: any;
declare var mxConstants: any;
declare var mxGraphHandler: any;
declare var mxEvent: any;
declare var mxUndoManager: any;
declare var mxCodec: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('graphContainer') graphContainer: ElementRef;
  public anchorPosition: boolean = true;
  graph: any;
  v1: any;
  triggers: any;
  redoPointer: any;
  constructor() { }

  ngAfterViewInit() {
    this.redoPointer = 0;
    var flag = false;
    //Callback functions
    this.addStep = () => {
      this.v1 = this.graph.insertVertex(parent, null, obj, 230, 100, 330, 240, "rounded=1;whiteSpace=wrap ;autosize=1;resizable=0;", null);
      var port = this.graph.insertVertex(this.v1, null, 'Test', 0.98, 0.84, 16, 16,
        'port;image=../assets/circle.png;spacingLeft=18', true);

      if (flag) {
        this.v1.setConnectable(true);
      } else {
        this.v1.setConnectable(false);
        flag = true;
      }
    }
    this.zoomOut = () => { this.graph.zoomOut(); }
    this.zoomIn = () => { this.graph.zoomIn(); }
    //End callback functions

    //Graph configurations
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    mxGraphHandler.prototype.guidesEnabled = true;
    // Uses the port icon while connections are previewed
    this.graph.connectionHandler.getConnectImage = function (state) {
      return new mxImage(state.style[mxConstants.STYLE_IMAGE], 16, 16);
    };
    var undoManager = new mxUndoManager();
    var listener = (sender, evt) => {
      this.redoPointer++;
      undoManager.undoableEditHappened(evt.getProperty('edit'));
    };

    this.undo = () => {
      if (this.redoPointer < 1) {
        return;
      }
      try {
        if (undoManager.history[this.redoPointer - 1].changes[0].child.value === "Test") {
          undoManager.undo();
          undoManager.undo();
          this.redoPointer--;
          this.redoPointer--;

        } else {
          this.redoPointer--;
          undoManager.undo();
        }

      } catch (ex) {
        this.redoPointer--;
        undoManager.undo();
      }
    }
    this.redo = () => {
      if (this.redoPointer < undoManager.history.length) {

        try {

          if (undoManager.history[this.redoPointer].changes[0].child.value.localName === "UserObject") {
            undoManager.redo();
            undoManager.redo();
            this.redoPointer++;
            this.redoPointer++;

          } else {
            undoManager.redo();
            this.redoPointer++;

          }
        } catch (ex) {
          this.redoPointer++;
          undoManager.redo();
        }
      }
    }

    this.graph.getModel().addListener(mxEvent.UNDO, listener);
    this.graph.getView().addListener(mxEvent.UNDO, listener);
    this.graph.connectionHandler.targetConnectImage = true;
    Helper.graphConfigurations(this.graph);
    Helper.setVertexStyle(this.graph);

    //For edge connections
    this.graph = Helper.connectPreview(this.graph);

    var doc = mxUtils.createXmlDocument();
    var obj = doc.createElement('UserObject');
    this.triggers = doc.createElement('triggers');
    var cached = true;
    if (cached) {
      // Ignores cached label in codec
      mxCodecRegistry.getCodec(mxCell).exclude.push('div');

      // Invalidates cached labels
      this.graph.model.setValue = function (cell, value) {
        cell.div = null;
        mxGraphModel.prototype.setValue.apply(this, arguments);
      };
    }
    Helper.customVertex(this.graph, this.addTrigger.bind(this))

    // Overrides method to create the editing value
    var getEditingValue = this.graph.getEditingValue;
    this.graph.getEditingValue = function (cell) {
      if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'userobject') {
        return cell.getAttribute('label');
      }
    };

    var parent = this.graph.getDefaultParent();
    Helper.setEdgeStyle(this.graph);
    new mxRubberband(this.graph);
    this.graph.getModel().beginUpdate();

    this.graph.foldingEnabled = false;
    // Helper.loadXml(this.graph);
    // this.loadJson();
    this.graph.getModel().endUpdate();
    new mxHierarchicalLayout(this.graph).execute(this.graph.getDefaultParent());
  }
  addStep() { }
  zoomOut() { }
  zoomIn() { }
  addTrigger() {
    // function(parent, id, value, x, y, width, height, style, relative)
    var v2 = this.graph.insertVertex(this.v1, null, this.triggers, 100, 30, 135, 40, "resizable=0;constituent=1;movable=0;", null);
    // div.getElementsByClassName('btnAppend')[0].prepend(v2);
    //   this.verticalDistance = this.verticalDistance+50;
  }
  undo() { }
  redo() { }
  showJson() {
    var json = Helper.getJsonModel(this.graph);
    console.log(json);
  }

  loadJson(){
    JsonCodec.render(JSON.parse(
      `
      {
        "graph": [
            {
                "value": {},
                "geometry": {
                    "x": 100,
                    "y": 100,
                    "width": 330,
                    "height": 177,
                    "relative": false,
                    "TRANSLATE_CONTROL_POINTS": true,
                    "alternateBounds": null,
                    "sourcePoint": null,
                    "targetPoint": null,
                    "points": null,
                    "offset": null
                },
                "style": "rounded=1;whiteSpace=wrap ;autosize=1;resizable=0;",
                "id": "2",
                "vertex": true,
                "connectable": false,
                "parent": "1",
                "source": null,
                "target": null,
                "mxObjectId": "mxCell#6",
                "div": {},
                "children": [
                    {
                        "value": "Test",
                        "geometry": {
                            "x": 0.98,
                            "y": 0.84,
                            "width": 16,
                            "height": 16,
                            "relative": true
                        },
                        "style": "port;image=../assets/circle.png;spacingLeft=18",
                        "id": "3",
                        "vertex": true,
                        "connectable": true,
                        "parent": "2",
                        "source": null,
                        "target": null,
                        "mxObjectId": "mxCell#7",
                        "edges": [
                            {
                                "value": null,
                                "geometry": {
                                    "x": 0,
                                    "y": 0,
                                    "width": 0,
                                    "height": 0,
                                    "relative": true
                                },
                                "style": null,
                                "id": "6",
                                "edge": true,
                                "parent": "1",
                                "source": "3",
                                "target": "4",
                                "mxObjectId": "mxCell#11"
                            }
                        ]
                    }
                ]
            },
            {
                "value": "Test",
                "geometry": {
                    "x": 0.98,
                    "y": 0.84,
                    "width": 16,
                    "height": 16,
                    "relative": true
                },
                "style": "port;image=../assets/circle.png;spacingLeft=18",
                "id": "3",
                "vertex": true,
                "connectable": true,
                "parent": "2",
                "source": null,
                "target": null,
                "mxObjectId": "mxCell#7",
                "edges": [
                    {
                        "value": null,
                        "geometry": {
                            "x": 0,
                            "y": 0,
                            "width": 0,
                            "height": 0,
                            "relative": true
                        },
                        "style": null,
                        "id": "6",
                        "edge": true,
                        "parent": "1",
                        "source": "3",
                        "target": "4",
                        "mxObjectId": "mxCell#11"
                    }
                ]
            },
            {
                "value": {},
                "geometry": {
                    "x": 550,
                    "y": 110,
                    "width": 330,
                    "height": 177,
                    "relative": false,
                    "TRANSLATE_CONTROL_POINTS": true,
                    "alternateBounds": null,
                    "sourcePoint": null,
                    "targetPoint": null,
                    "points": null,
                    "offset": null
                },
                "style": "rounded=1;whiteSpace=wrap ;autosize=1;resizable=0;",
                "id": "4",
                "vertex": true,
                "connectable": true,
                "parent": "1",
                "source": null,
                "target": null,
                "mxObjectId": "mxCell#8",
                "div": {},
                "children": [
                    {
                        "value": "Test",
                        "geometry": {
                            "x": 0.98,
                            "y": 0.84,
                            "width": 16,
                            "height": 16,
                            "relative": true
                        },
                        "style": "port;image=../assets/circle.png;spacingLeft=18",
                        "id": "5",
                        "vertex": true,
                        "connectable": true,
                        "parent": "4",
                        "source": null,
                        "target": null,
                        "mxObjectId": "mxCell#9",
                        "edges": [
                            {
                                "value": null,
                                "geometry": {
                                    "x": 0,
                                    "y": 0,
                                    "width": 0,
                                    "height": 0,
                                    "relative": true
                                },
                                "style": null,
                                "id": "9",
                                "edge": true,
                                "parent": "1",
                                "source": "5",
                                "target": "7",
                                "mxObjectId": "mxCell#15"
                            }
                        ]
                    }
                ],
                "edges": [
                    {
                        "value": null,
                        "geometry": {
                            "x": 0,
                            "y": 0,
                            "width": 0,
                            "height": 0,
                            "relative": true
                        },
                        "style": null,
                        "id": "6",
                        "edge": true,
                        "parent": "1",
                        "source": "3",
                        "target": "4",
                        "mxObjectId": "mxCell#11"
                    }
                ]
            },
            {
                "value": "Test",
                "geometry": {
                    "x": 0.98,
                    "y": 0.84,
                    "width": 16,
                    "height": 16,
                    "relative": true
                },
                "style": "port;image=../assets/circle.png;spacingLeft=18",
                "id": "5",
                "vertex": true,
                "connectable": true,
                "parent": "4",
                "source": null,
                "target": null,
                "mxObjectId": "mxCell#9",
                "edges": [
                    {
                        "value": null,
                        "geometry": {
                            "x": 0,
                            "y": 0,
                            "width": 0,
                            "height": 0,
                            "relative": true
                        },
                        "style": null,
                        "id": "9",
                        "edge": true,
                        "parent": "1",
                        "source": "5",
                        "target": "7",
                        "mxObjectId": "mxCell#15"
                    }
                ]
            },
            {
                "value": null,
                "geometry": {
                    "x": 0,
                    "y": 0,
                    "width": 0,
                    "height": 0,
                    "relative": true
                },
                "style": null,
                "id": "6",
                "edge": true,
                "parent": "1",
                "source": "3",
                "target": "4",
                "mxObjectId": "mxCell#11"
            },
            {
                "value": {},
                "geometry": {
                    "x": 270,
                    "y": 380,
                    "width": 330,
                    "height": 177,
                    "relative": false,
                    "TRANSLATE_CONTROL_POINTS": true,
                    "alternateBounds": null,
                    "sourcePoint": null,
                    "targetPoint": null,
                    "points": null,
                    "offset": null
                },
                "style": "rounded=1;whiteSpace=wrap ;autosize=1;resizable=0;",
                "id": "7",
                "vertex": true,
                "connectable": true,
                "parent": "1",
                "source": null,
                "target": null,
                "mxObjectId": "mxCell#12",
                "div": {},
                "children": [
                    {
                        "value": "Test",
                        "geometry": {
                            "x": 0.98,
                            "y": 0.84,
                            "width": 16,
                            "height": 16,
                            "relative": true
                        },
                        "style": "port;image=../assets/circle.png;spacingLeft=18",
                        "id": "8",
                        "vertex": true,
                        "connectable": true,
                        "parent": "7",
                        "source": null,
                        "target": null,
                        "mxObjectId": "mxCell#13"
                    }
                ],
                "edges": [
                    {
                        "value": null,
                        "geometry": {
                            "x": 0,
                            "y": 0,
                            "width": 0,
                            "height": 0,
                            "relative": true
                        },
                        "style": null,
                        "id": "9",
                        "edge": true,
                        "parent": "1",
                        "source": "5",
                        "target": "7",
                        "mxObjectId": "mxCell#15"
                    }
                ]
            },
            {
                "value": "Test",
                "geometry": {
                    "x": 0.98,
                    "y": 0.84,
                    "width": 16,
                    "height": 16,
                    "relative": true
                },
                "style": "port;image=../assets/circle.png;spacingLeft=18",
                "id": "8",
                "vertex": true,
                "connectable": true,
                "parent": "7",
                "source": null,
                "target": null,
                "mxObjectId": "mxCell#13"
            },
            {
                "value": null,
                "geometry": {
                    "x": 0,
                    "y": 0,
                    "width": 0,
                    "height": 0,
                    "relative": true
                },
                "style": null,
                "id": "9",
                "edge": true,
                "parent": "1",
                "source": "5",
                "target": "7",
                "mxObjectId": "mxCell#15"
            }
        ]
    }
      `
      ),this.graph)
  }

}