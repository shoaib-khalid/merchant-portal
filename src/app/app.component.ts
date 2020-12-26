import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Helper } from './helpers/graph-helper';
import { JsonCodec } from './helpers/json-codec';
declare var mxUtils: any;
declare var mxGraphHandler: any;
declare var mxEvent: any;
declare var mxUndoManager: any;
declare var mxOutline: any;

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

      Helper.addAssets();
      this.redoPointer = 0;
      //Callback functions
      this.addStep = () => {
         this.v1 = this.graph.insertVertex(this.graph.getDefaultParent(), null, obj, 230, 100, 330, 177, "rounded=1;whiteSpace=wrap;autosize=1;resizable=0;", null);
         let initialMessageVertex = this.graph.insertVertex(this.v1, 'InitialMesssage' + "_" + this.v1.id, initialMessage, 100, 80, 135, 40, "resizable=0;constituent=1;movable=0;strokeColor=none;", null);
         initialMessageVertex.setConnectable(false);
         var port = this.graph.insertVertex(this.v1, null, 'Test', 0.98, 0.84, 16, 16,
            'port;image=../assets/circle.png;spacingLeft=18', true);

         // if (flag) {
         //   this.v1.setConnectable(true);
         // } else {
         //   this.v1.setConnectable(false);
         //   flag = true;
         // }
         // var port = this.graph.insertVertex(this.v1, null, 'Test', 0.90, 0.90, 16, 16,
         //   'port;image=../assets/circle.png;spacingLeft=18', true);
      }
      this.zoomOut = () => { this.graph.zoomOut(); }
      this.zoomIn = () => { this.graph.zoomIn(); }
      //End callback functions

      //Graph configurations
      this.graph = new mxGraph(this.graphContainer.nativeElement);

      new mxOutline(this.graph, this.outlineContainer.nativeElement);
      mxGraphHandler.prototype.guidesEnabled = true;

      var undoManager = new mxUndoManager();
      Helper.deleteEvent(this.graph, undoManager);
      var listener = (sender, evt) => {
         // console.log(evt)
         this.redoPointer++;
         console.log("Redo Pointer in listener: " + this.redoPointer)
         undoManager.undoableEditHappened(evt.getProperty('edit'));
      };

      this.undo = () => {
         if (this.redoPointer < 1) {
            return;
         }


         console.log("Redo Pointer before undo: " + this.redoPointer);
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
         console.log("Redo Pointer after undo: " + this.redoPointer);
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
            console.log("Redo Pointer after redo: " + this.redoPointer)
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
      // if (cached) {
      //   // Ignores cached label in codec
      //   mxCodecRegistry.getCodec(mxCell).exclude.push('div');

      //   // Invalidates cached labels
      //   this.graph.model.setValue = function (cell, value) {
      //     cell.div = null;
      //     mxGraphModel.prototype.setValue.apply(this, arguments);
      //   };
      // }
      Helper.customVertex(this.graph);

      // Helper.customVertex(this.graph, this.addTrigger.bind(this))
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
   undo() { }
   redo() { }


   delete() {
      this.graph.getModel().remove(this.v1);
   }
   showJson() {
      let json = JsonCodec.getJson(this.graph);
      mxUtils.popup(json, true);
   }
   loadJson() {
      debugger;
      let json = `{
         "mxGraphModel":{"root":{"mxCell":[{"@id":"0"},{"@id":"1","@parent":"0"},{"@id":"3","@value":"Test","@style":"port;image=../assets/circle.png;spacingLeft=18","@vertex":"1","@parent":"2","mxGeometry":{"@x":"0.98","@y":"0.84","@width":"16","@height":"16","@relative":"1","@as":"geometry"}},{"@id":"7","@value":"Test","@style":"port;image=../assets/circle.png;spacingLeft=18","@vertex":"1","@parent":"6","mxGeometry":{"@x":"0.98","@y":"0.84","@width":"16","@height":"16","@relative":"1","@as":"geometry"}},{"@id":"11","@edge":"1","@parent":"1","@source":"3","@target":"6","mxGeometry":{"@relative":"1","@as":"geometry"}}],"UserObject":[{"@id":"2","mxCell":{"@style":"rounded=1;whiteSpace=wrap;autosize=1;resizable=0;","@vertex":"1","@parent":"1","mxGeometry":{"@x":"140","@y":"80","@width":"330","@height":"297","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@class":"custom-card","@style":"border-radius:33px","div":[{"@class":"tooltip-parent"},{"@class":"card","@style":"border-radius:35px;border:0px;width:300px","div":[{"@class":"card-header","@style":"background-color:white;","img":{"@src":"../assets/play.png","@class":"start-icon float-left","@alt":"..."},"div":{"@style":"margin-left:60px;margin-top:5px;","h4":"Starting Step"}},{"@class":"card-body flow-start-trigger-list max-h-150","@style":"height: 120px;"},{"@class":"card-footer","@style":"background-color:white;","div":{"@class":"row","div":{"@class":"col-md-12 btnAppend","button":{"@type":"button","@class":"btn btn-outline-secondary btn-block btnAddTrigger","#text":"Add Trigger"}}}}]}],"span":{"@class":"tooltip-text","div":{"@class":"d-inline img-icon mr-2","img":{"@class":"delete","@src":"../assets/delete.png"}},"img":{"@class":"img-icon","@src":"../assets/copy.png"}}},"br":null}}},{"@id":"6","mxCell":{"@style":"rounded=1;whiteSpace=wrap;autosize=1;resizable=0;","@vertex":"1","@parent":"1","mxGeometry":{"@x":"590","@y":"70","@width":"330","@height":"357","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@class":"custom-card","@style":"border-radius:33px","div":[{"@class":"tooltip-parent"},{"@class":"card","@style":"border-radius:35px;border:0px;width:300px","div":[{"@class":"card-header","@style":"background-color:white;","img":{"@src":"../assets/play.png","@class":"start-icon float-left","@alt":"..."},"div":{"@style":"margin-left:60px;margin-top:5px;","h4":"Starting Step"}},{"@class":"card-body flow-start-trigger-list max-h-150","@style":"height: 180px;"},{"@class":"card-footer","@style":"background-color:white;","div":{"@class":"row","div":{"@class":"col-md-12 btnAppend","button":{"@type":"button","@class":"btn btn-outline-secondary btn-block btnAddTrigger","#text":"Add Trigger"}}}}]}],"span":{"@class":"tooltip-text","div":{"@class":"d-inline img-icon mr-2","img":{"@class":"delete","@src":"../assets/delete.png"}},"img":{"@class":"img-icon","@src":"../assets/copy.png"}}},"br":null}}}],"triggers":[{"@id":"4","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;","@vertex":"1","@parent":"2","mxGeometry":{"@x":"100","@y":"100","@width":"135","@height":"40","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","br":null,"button":{"@type":"button","@style":"width:150px;","@class":"btn btn-primary btn-block btnAddTrigger btn-lg","#text":"Text"}}}},{"@id":"5","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;","@vertex":"1","@parent":"2","mxGeometry":{"@x":"100","@y":"160","@width":"135","@height":"40","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","br":null,"button":{"@type":"button","@style":"width:150px;","@class":"btn btn-primary btn-block btnAddTrigger btn-lg","#text":"Text"}}}},{"@id":"8","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;","@vertex":"1","@parent":"6","mxGeometry":{"@x":"100","@y":"100","@width":"135","@height":"40","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","br":null,"button":{"@type":"button","@style":"width:150px;","@class":"btn btn-primary btn-block btnAddTrigger btn-lg","#text":"Text"}}}},{"@id":"9","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;","@vertex":"1","@parent":"6","mxGeometry":{"@x":"100","@y":"160","@width":"135","@height":"40","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","br":null,"button":{"@type":"button","@style":"width:150px;","@class":"btn btn-primary btn-block btnAddTrigger btn-lg","#text":"Text"}}}},{"@id":"10","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;","@vertex":"1","@parent":"6","mxGeometry":{"@x":"100","@y":"220","@width":"135","@height":"40","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","br":null,"button":{"@type":"button","@style":"width:150px;","@class":"btn btn-primary btn-block btnAddTrigger btn-lg","#text":"Text"}}}}]}}
         }`
      JsonCodec.loadJson(this.graph, json)
   }
}