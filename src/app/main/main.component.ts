import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Helper } from '../helpers/graph-helper';
import { JsonCodec } from '../helpers/json-codec';
import { saveAs } from 'file-saver';
import { ApiCallsService } from "../services/api-calls.service";
import { FlowDialog } from '../components/flow-dialog/flow-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {HelperService} from '../services/helper.service';
declare var mxUtils: any;
declare var mxGraphHandler: any;
declare var mxEvent: any;
declare var mxUndoManager: any;
declare var mxOutline: any;

@Component({
   selector: 'app-root',
   templateUrl: './main.component.html',
   styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, AfterViewInit {
   @ViewChild('graphContainer') graphContainer: ElementRef;
   @ViewChild('outlineContainer') outlineContainer: ElementRef;

   public anchorPosition: boolean = true;
   graph: any;
   triggers: any;
   redoPointer: any;
   opened: boolean;

   constructor(private helperService:HelperService,private router: Router, private route: ActivatedRoute, private configService: ApiCallsService, public dialog: MatDialog) { }

   ngOnInit() {
      this.route.params.subscribe(params => {
         if (params.id) {
            this.configService.flowId = params.id;
            this.retrieveJsonEndpoint();
         }
      });
   }

   ngAfterViewInit() {

      this.redoPointer = 0;

      //Callback function
      this.addStep = (x: any = 50, y: any = 0): any => {

         let vertext = undefined;
         vertext = this.graph.insertVertex(this.graph.getDefaultParent(), null, obj, x, y, 300, 230, "rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0", null);
         Helper.v1 = vertext;
         return vertext;
      }
      //End callback function

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

            if (undoManager.history[undoManager.history.length - 1].changes[0].geometry) {
               //On vertex move json will be posted
               this.configService.autoSaveUpdate(JsonCodec.getIndividualJson(Helper.v1))

            }

            else if (undoManager.history[undoManager.history.length - 1].changes[0].parent === null) {
               this.configService.autoSaveDelete(JsonCodec.getIndividualJson(Helper.v1))
               this.configService.dataVariables.forEach((element, index) => {
                  if (element.vertexId == Helper.v1.id) {
                     this.configService.dataVariables.splice(index, 1)
                  }
               });
               return
            }

            const objJson = this.individualJson(undoManager.history[undoManager.history.length - 1].changes[0].child);
            if (objJson.includes(`@edge":"1"`)) {
               this.configService.autoSaveAdd(objJson, "")
            }
            else if (objJson.includes(`"triggers":`)) {
               this.configService.autoSaveAdd(objJson, "")
               this.configService.autoSaveUpdate(JsonCodec.getIndividualJson(Helper.v1))
            }
            else if (Helper.copyAction) {
               this.configService.autoSaveAdd(objJson, "")
               this.configService.dataVariables.forEach((element, index) => {
                  if (element.vertexId == Helper.v1.id) {
                     this.configService.dataVariables.push({
                        "type": element.type,
                        "vertexId": String((++Helper.v1.id)),
                        "dataVariables": [
                           {
                              "id": this.helperService.getLastId(),
                              "dataVariable": element.dataVariables[0].dataVariable,
                              "path": "",
                              "optional": ""
                           }
                        ]
                     })
                     console.log(this.configService.dataVariables)
                  }
               });

               Helper.copyAction = false;
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

   zoomOut() { this.graph.zoomOut(); }
   zoomIn() { this.graph.zoomIn(); }
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

   deleteMultipleVertices() { Helper.deleteMultipleVertices(this.graph); }

   copyMultipleVertices() {
      Helper.copyMultipleVertices(this.graph);
   }

   createFlow(): void {
      const dialogRef = this.dialog.open(FlowDialog, {
         width: '368px',
         data: { title: "", description: "" }
      });

      dialogRef.afterClosed().subscribe(result => {

         if (result[0] && result[1]) {
            this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()));

            var v1 = this.addStepWithType("TEXT_MESSAGE");
            var v2 = this.addStepWithType("TEXT_MESSAGE", 500, 200);
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

   publish() {
      this.configService.publishmxGraph();
   }
   addStepWithType(type, x: any = 50, y: any = 0) {
      Helper.vertexType = type;
      const v1 = this.addStep(x, y);
      const length = this.configService.dataVariables.length;
      var lastId
      if (length > 0) {
         lastId = parseInt(this.configService.dataVariables[length - 1].dataVariables[0].id);
      } else {
         lastId = -1;
      }
      this.configService.dataVariables.push({
         "type": type,
         "vertexId": Helper.v1.id,
         "dataVariables": [
            {
               "id": lastId + 1,
               "dataVariable": "",
               "path": "",
               "optional": ""
            }
         ]
      });

      this.configService.autoSaveAdd(JsonCodec.getIndividualJson(Helper.v1), type)
      return v1;
   }

   
}