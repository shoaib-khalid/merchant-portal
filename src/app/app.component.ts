import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Helper } from './helpers/graph-helper';
import { JsonCodec } from './helpers/json-codec';
import { saveAs } from 'file-saver';
import { ConfigService } from "./config/config.service";
import { FlowDialog } from './components/flow-dialog/flow-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
   // @ViewChild(FlowDialog) private flowDialog:FlowDialog;

   public anchorPosition: boolean = true;
   graph: any;
   triggers: any;
   redoPointer: any;
   opened: boolean;

   constructor(private configService: ConfigService, public dialog: MatDialog) { }

   ngAfterViewInit() {
      // this.postData();
      // this.retrieveJson();
      this.redoPointer = 0;

      //Callback functions

      this.addStep = () => {
         let vertext = undefined;
         vertext = this.graph.insertVertex(this.graph.getDefaultParent(), null, obj, 230, 100, 300, 230, "rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0", null);
      }

      this.zoomOut = () => { this.graph.zoomOut(); }
      this.zoomIn = () => { this.graph.zoomIn(); }
      this.deleteMultipleVertices = (graph = this.graph) => { Helper.deleteMultipleVertices(graph); }
      //End callback functions

      //Graph configurations
      this.graph = new mxGraph(this.graphContainer.nativeElement);
      Helper.addAssets(this.graph);

      new mxOutline(this.graph, this.outlineContainer.nativeElement);
      mxGraphHandler.prototype.guidesEnabled = true;

      var undoManager = new mxUndoManager();
      Helper.actionOnEvents(this.graph);
      var listener = (sender, evt) => {

         this.redoPointer++;
         undoManager.undoableEditHappened(evt.getProperty('edit'));
         try {

            const objJson = this.individualJson(undoManager.history[undoManager.history.length - 1].changes[0].child);
            // console.log(objJson)
            // console.log(objJson.includes("delete"))
            this.configService.autoSaveAdd(objJson)
         } catch (ex) { }
      };

      this.undo = () => {
         console.log("Redo pointer before undo: " + this.redoPointer)
         if (this.redoPointer > undoManager.history.length) {
            this.redoPointer = undoManager.history.length;
         }

         if (this.redoPointer < 1) {
            return;
         }

         try {
            if (undoManager.history[this.redoPointer - 1].changes[0].child.value === "Test") {
               undoManager.undo();
               undoManager.undo();
               undoManager.undo();
               this.redoPointer--;
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
         console.log("Redo pointer before undo: " + this.redoPointer)
         if (this.redoPointer > undoManager.history.length) {
            this.redoPointer = undoManager.history.length;
         }

         if (this.redoPointer < undoManager.history.length) {

            try {

               if (undoManager.history[this.redoPointer].changes[0].child.value.localName === "UserObject") {
                  undoManager.redo();
                  undoManager.redo();
                  undoManager.redo();
                  this.redoPointer++;
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
      Helper.customVertex(this.graph);

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
   addTrigger() { }
   undo() { }
   redo() { }

   individualJson(vertex) {
      let json = JsonCodec.getIndividualJson(vertex);
      return json;
      // console.log(json)

   }

   getStartJson() {
      return JsonCodec.getJson(this.graph);
   }

   showJson() {
      let json = JsonCodec.getJson(this.graph);
      console.log(json)
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, 'chatbot-diagram.json');

      // mxUtils.popup(json, true);
   }

   loadJson(event) {
      let reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
         let jsonFile = event.target.files[0];
         reader.readAsText(jsonFile);

         reader.onload = () => {
            JsonCodec.loadJson(this.graph, reader.result);
            // need to run CD since file load runs outside of zone
            // this.cd.markForCheck();
         };
      }

   }

   loadJsonStart() {
      const json = `{
         "mxGraphModel":{"root":{"mxCell":[{"@id":"0"},{"@id":"1","@parent":"0"},{"@id":"4","@style":"edgeStyle=elbowEdgeStyle","@edge":"1","@parent":"1","@source":"2","@target":"3","mxGeometry":{"@relative":"1","@as":"geometry"}}],"UserObject":[{"@id":"2","mxCell":{"@style":"rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0","@vertex":"1","@parent":"1","mxGeometry":{"@y":"-60","@width":"300","@height":"230","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@id":"flow0","@class":"custom-card flow-start-container shadow-lg bg-white","@style":"border-radius: 33px; border-color: transparent;","div":[{"@class":"tooltip-parent"},{"@class":"card","@style":"border-radius:35px;border:0px;width:300px; min-height:200px;","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","@style":"position: absolute;right: -12px; top:80%;z-index: 990;","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"gray"}},"div":[{"@id":"card-header0","@class":"card-header","@style":"background-color:white;border-radius:35px;border:0px;","img":{"@src":"../assets/play.png","@class":"start-icon float-left","@alt":"...","@style":"width:35px;height=35px"},"div":{"@style":"margin-left:60px;margin-top:5px;","h4":{"@id":"header0","@class":"header","#text":"Starting Step"}}},{"@id":"card-body0","@class":"card-body flow-start-trigger-list","@style":"height:63px","span":{"@class":"initial-message","@style":"font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500","#text":" Flow starts with the following step. Click to add the triggers. "}},{"@class":"card-footer","@style":"background-color:white;border-radius:35px;border:0px;","div":{"@class":"row","div":{"@class":"col-md-12 btnAppend","button":{"@type":"button","@class":"btn btn-outline-secondary btn-block btnAddTrigger","#text":"Add Trigger"}}}}]}],"span":{"@class":"tooltip-text","div":{"@class":"d-inline img-icon mr-2","img":{"@class":"delete","@src":"../assets/delete.png"}},"img":{"@class":"copy","@src":"../assets/copy.png"}}},"br":null}}},{"@id":"3","mxCell":{"@style":"rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0","@vertex":"1","@parent":"1","mxGeometry":{"@x":"420","@y":"160","@width":"300","@height":"230","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@id":"flow1","@class":"custom-card flow-start-container shadow-lg bg-white","@style":"border-radius: 33px; border-color: transparent;","div":[{"@class":"tooltip-parent"},{"@class":"card","@style":"border-radius:35px;border:0px;width:300px; min-height:200px;","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","@style":"position: absolute;right: -12px; top:80%;z-index: 990;","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"white"}},"div":[{"@id":"card-header1","@class":"card-header","@style":"background-color:white;border-radius:35px;border:0px;","img":{"@src":"../assets/messenger.svg","@class":"start-icon float-left","@alt":"...","@style":"width:35px;height=35px"},"div":{"@style":"margin-left:60px;margin-top:5px;","h4":{"@id":"header1","@class":"header","#text":"New Message #1"}}},{"@id":"card-body1","@class":"card-body flow-start-trigger-list","@style":"height:63px","span":{"@class":"initial-message","@style":"font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500","#text":" Flow starts with the following step. Click to add the triggers. "}},{"@class":"card-footer","@style":"background-color:white;border-radius:35px;border:0px;","div":{"@class":"row","div":{"@class":"col-md-12 btnAppend","button":{"@type":"button","@class":"btn btn-outline-secondary btn-block btnAddTrigger","#text":"Add Trigger"}}}}]}],"span":{"@class":"tooltip-text","div":{"@class":"d-inline img-icon mr-2","img":{"@class":"delete","@src":"../assets/delete.png"}},"img":{"@class":"copy","@src":"../assets/copy.png"}}},"br":null}}}]}}
         }`;
      JsonCodec.loadJson(this.graph, json);
   }


   showData() {
      this.configService.getData()
         .subscribe(data => {
            console.log(data)
         }
         );
   }

   retrieveJson() {
      this.configService.retrieveJson()
         .subscribe(data => {
            console.log(data)
         }
         );
   }

   deleteMultipleVertices() { }


   createFlow(): void {

      const dialogRef = this.dialog.open(FlowDialog, {
         width: '368px',
         data: { title: "", description: "" }
      });

      dialogRef.afterClosed().subscribe(result => {

         if (result[0] && result[1]) {
            this.loadJsonStart();
         }

      });

   }


   async retrieveJsonEndpoint() {
     var data:any = await this.configService.retrieveGraph();
   //   console.log(data.data.mxGraphModel)
     data = JSON.stringify({mxGraphModel:data.data.mxGraphModel});
      // console.log(data)
     JsonCodec.loadJson(this.graph,data)
   }
}