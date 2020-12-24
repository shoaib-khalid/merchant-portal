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
declare var mxOutline:any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('graphContainer') graphContainer: ElementRef;
  @ViewChild('outlineContainer') outlineContainer: ElementRef;
  
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
      debugger;
      this.v1 = this.graph.insertVertex(parent, null, obj, 230, 100, 330, 177, "rounded=1;whiteSpace=wrap ;autosize=1;resizable=0;", null);
      this.graph.insertVertex(this.v1, 'InitialMesssage' + "_" + this.v1.id, initialMessage, 100, 30, 135, 40, "resizable=0;constituent=1;movable=0;", null);
      var port = this.graph.insertVertex(this.v1, null, 'Test', 0.98, 0.84, 16, 16,
        'port;image=../assets/circle.png;spacingLeft=18', true);

      if (flag) {
        this.v1.setConnectable(true);
      } else {
        this.v1.setConnectable(false);
        flag = true;
      }
      var port = this.graph.insertVertex(this.v1, null, 'Test', 0.90, 0.90, 16, 16,
        'port;image=../assets/circle.png;spacingLeft=18', true);
    }
    this.zoomOut = () => { this.graph.zoomOut(); }
    this.zoomIn = () => { this.graph.zoomIn(); }
    //End callback functions

    //Graph configurations
    this.graph = new mxGraph(this.graphContainer.nativeElement);

    var outln = new mxOutline(this.graph, this.outlineContainer.nativeElement);

    var outline = document.getElementById('outlineContainer');
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

          if (undoManager.history[this.redoPointer].changes[0].child.value != "Test" && undoManager.history[this.redoPointer].changes[0].child.value != null) {
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
    var initialMessage = doc.createElement('InitialMessage');
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
    Helper.customVertex(this.graph);

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
    this.graph.getModel().endUpdate();
    new mxHierarchicalLayout(this.graph).execute(this.graph.getDefaultParent());
  }
  addStep() { }
  zoomOut() { }
  zoomIn() { }
  addTrigger() {
  }
  undo() {

  }
  redo() {

  }
  showJson() {
    let json = JsonCodec.getJson(this.graph);
    mxUtils.popup(json, true);
  }
  loadJson() {
    let json = `{
      "mxGraphModel":{"root":{"mxCell":[{"@id":"0"},{"@id":"1","@parent":"0"},{"@id":"3","@value":"Test","@style":"port;image=../assets/circle.png;spacingLeft=18","@vertex":"1","@parent":"2","mxGeometry":{"@x":"0.98","@y":"0.84","@width":"16","@height":"16","@relative":"1","@as":"geometry"}},{"@id":"4","@value":"Test","@style":"port;image=../assets/circle.png;spacingLeft=18","@vertex":"1","@parent":"2","mxGeometry":{"@x":"0.9","@y":"0.9","@width":"16","@height":"16","@relative":"1","@as":"geometry"}},{"@id":"6","@value":"Test","@style":"port;image=../assets/circle.png;spacingLeft=18","@vertex":"1","@parent":"5","mxGeometry":{"@x":"0.98","@y":"0.84","@width":"16","@height":"16","@relative":"1","@as":"geometry"}},{"@id":"7","@value":"Test","@style":"port;image=../assets/circle.png;spacingLeft=18","@vertex":"1","@parent":"5","mxGeometry":{"@x":"0.9","@y":"0.9","@width":"16","@height":"16","@relative":"1","@as":"geometry"}},{"@id":"8","@edge":"1","@parent":"1","@source":"3","@target":"5","mxGeometry":{"@relative":"1","@as":"geometry"}}],"UserObject":[{"@id":"2","mxCell":{"@style":"rounded=1;whiteSpace=wrap ;autosize=1;resizable=0;","@vertex":"1","@connectable":"0","@parent":"1","mxGeometry":{"@x":"20","@y":"50","@width":"330","@height":"177","@as":"geometry"}}},{"@id":"5","mxCell":{"@style":"rounded=1;whiteSpace=wrap ;autosize=1;resizable=0;","@vertex":"1","@parent":"1","mxGeometry":{"@x":"460","@y":"10","@width":"330","@height":"177","@as":"geometry"}}}],"triggers":[{"@id":"9","mxCell":{"@style":"resizable=0;constituent=1;movable=0;","@vertex":"1","@parent":"2","mxGeometry":{"@x":"100","@y":"30","@width":"135","@height":"40","@as":"geometry"}}},{"@id":"10","mxCell":{"@style":"resizable=0;constituent=1;movable=0;","@vertex":"1","@parent":"5","mxGeometry":{"@x":"100","@y":"30","@width":"135","@height":"40","@as":"geometry"}}}]}}
      }`
    JsonCodec.loadJson(this.graph, json)
  }
}