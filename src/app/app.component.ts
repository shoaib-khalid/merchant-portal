import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Helper } from './helpers/graph-helper';
import { JsonCodec } from './helpers/json-codec';
import { saveAs } from 'file-saver';
import { ApiCallsService } from "./services/api-calls.service";
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

   constructor(private configService: ApiCallsService, public dialog: MatDialog) { }

   ngAfterViewInit() {
      // this.postData();
      // this.retrieveJson();
      this.redoPointer = 0;

      //Callback functions


      this.addStep = (x: any = 50, y: any = 0): any => {
         let vertext = undefined;
         vertext = this.graph.insertVertex(this.graph.getDefaultParent(), null, obj, x, y, 300, 230, "rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0", null);
         this.configService.autoSaveAdd(JsonCodec.getIndividualJson(vertext))
         return vertext;
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
         console.log(undoManager.history[undoManager.history.length - 1])
         // console.log(Helper.v1)
         try {


            if (undoManager.history[undoManager.history.length - 1].changes[0].geometry) {
               //On vertex move json will be posted
               this.configService.autoSaveUpdate(JsonCodec.getIndividualJson(Helper.v1))
               console.log("INSIDE geometry")

            }


            else if (undoManager.history[undoManager.history.length - 1].changes[0].parent===null) {
               this.configService.autoSaveDelete(JsonCodec.getIndividualJson(Helper.v1))
               
               console.log("Delete:")
               console.log(Helper.v1)
               
               return
            }

        
            const objJson = this.individualJson(undoManager.history[undoManager.history.length - 1].changes[0].child);
            if (objJson.includes(`@edge":"1"`)) {
               this.configService.autoSaveAdd(objJson)
               console.log("edge deletion")
            }
            else if (objJson.includes(`"triggers":`)) {
               console.log("trigger json")
               this.configService.autoSaveAdd(objJson)
               this.configService.autoSaveUpdate(JsonCodec.getIndividualJson(Helper.v1))
            }

         } catch (ex) { }
      };

      this.undo = () => {
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
      Helper.customVertex(this.graph);

      Helper.setEdgeStyle(this.graph);
      new mxRubberband(this.graph);
      this.graph.getModel().beginUpdate();
      this.graph.foldingEnabled = false;
      this.graph.getModel().endUpdate();
      new mxHierarchicalLayout(this.graph).execute(this.graph.getDefaultParent());
   }
   addStep(x = 50, y = 0) { }
   zoomOut() { }
   zoomIn() { }
   addTrigger() { }
   undo() { }
   redo() { }

   individualJson(vertex) {
      let json = JsonCodec.getIndividualJson(vertex);
      return json;

   }

   getStartJson() {
      return JsonCodec.getJson(this.graph);
   }

   showJson() {
      let json = JsonCodec.getJson(this.graph);

      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, 'chatbot-diagram.json');

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
            this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()));

            var v1 = this.addStep();
            var v2 = this.addStep(500, 200);
            this.graph.insertEdge(this.graph.getDefaultParent(), null, '', v1, v2);
         }

      });

   }


   async retrieveJsonEndpoint() {
      try {
         var data: any = await this.configService.retrieveGraph();

      } catch (ex) {
         console.log(ex)
      }
      data = JSON.stringify({ mxGraphModel: data.data.mxGraphModel });

      JsonCodec.loadJson(this.graph, data)
   }
}