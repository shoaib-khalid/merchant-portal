import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Helper } from './helpers/graph-helper';
import { JsonCodec } from './helpers/json-codec';

declare var mxUtils: any;
declare var mxGraphHandler: any;
declare var mxEvent: any;
declare var mxUndoManager: any;

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

    Helper.addAssets();
    this.redoPointer = 0;
    //Callback functions
    this.addStep = () => {
      this.v1 = this.graph.insertVertex(parent, null, obj, 230, 100, 330, 240, "rounded=1;whiteSpace=wrap ;autosize=1;resizable=0;", null);
      var port = this.graph.insertVertex(this.v1, null, 'Test', 0.98, 0.84, 16, 16,
        'port;image=../assets/circle.png;spacingLeft=18', true);
    }
    this.zoomOut = () => { this.graph.zoomOut(); }
    this.zoomIn = () => { this.graph.zoomIn(); }
    //End callback functions

    //Graph configurations
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    mxGraphHandler.prototype.guidesEnabled = true;
    
    var undoManager = new mxUndoManager();
    Helper.deleteEvent(this.graph,undoManager);
    var listener = (sender, evt) => {
      // console.log(evt)
      this.redoPointer++;
      console.log("Redo Pointer in listener: "+this.redoPointer)
      undoManager.undoableEditHappened(evt.getProperty('edit'));
    };

    this.undo = () => {

      if (this.redoPointer < 1) {
        return;
      }
      

      console.log("Redo Pointer before undo: "+this.redoPointer);
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
      console.log("After undo: ")
      console.log(undoManager.history);
      console.log("Redo Pointer after undo: "+this.redoPointer);
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
        console.log("After redo: ")
        console.log(undoManager.history)
        console.log("Redo Pointer after redo: "+this.redoPointer)
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

    Helper.customVertex(this.graph, this.addTrigger.bind(this))
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
  loadJson() {
    JsonCodec.render(JSON.parse(``
    ), this.graph)
  }
  delete() {
    this.graph.getModel().remove(this.v1);
  }
}