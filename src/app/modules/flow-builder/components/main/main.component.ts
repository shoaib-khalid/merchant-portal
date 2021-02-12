import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Helper } from 'src/app/helpers/graph-helper';
import { JsonCodec } from 'src/app/helpers/json-codec';
import { saveAs } from 'file-saver';
import { ApiCallsService } from "src/app/services/api-calls.service";
import { FlowDialog } from '../flow-dialog/flow-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from 'src/app/services/helper.service';
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

   constructor(private helperService: HelperService, private helper: Helper, private route: ActivatedRoute, private configService: ApiCallsService, public dialog: MatDialog) { }

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
         this.helper.v1 = vertext;
         return vertext;
      }
      //End callback function

      //Graph configurations
      this.graph = new mxGraph(this.graphContainer.nativeElement);
      this.helper.addAssets(this.graph);

      new mxOutline(this.graph, this.outlineContainer.nativeElement);
      mxGraphHandler.prototype.guidesEnabled = true;

      var undoManager = new mxUndoManager();
      this.helper.actionOnEvents(this.graph);
      var listener = async (sender, evt) => {

         this.redoPointer++;
         undoManager.undoableEditHappened(evt.getProperty('edit'));
         try {

            if (undoManager.history[undoManager.history.length - 1].changes[0].geometry) {
               //On vertex move json will be posted
               this.configService.autoSaveUpdate(JsonCodec.getIndividualJson(this.helper.v1))

            }

            else if (undoManager.history[undoManager.history.length - 1].changes[0].parent === null) {
               this.configService.autoSaveDelete(JsonCodec.getIndividualJson(this.helper.v1))
               this.configService.data.forEach((element, index) => {
                  if (element.vertexId == this.helper.v1.id) {
                     this.configService.data.splice(index, 1)
                  }
               });
               return
            }

            const objJson = this.individualJson(undoManager.history[undoManager.history.length - 1].changes[0].child);
            if (objJson.includes(`@edge":"1"`)) {
               this.configService.autoSaveAdd(objJson, "")
            }
            else if (objJson.includes(`"triggers":`)) {
               await this.configService.autoSaveAdd(objJson, "")
               this.configService.autoSaveUpdate(JsonCodec.getIndividualJson(this.helper.v1))
            }
            else if (this.helper.copyAction) {
               this.configService.autoSaveAdd(objJson, "")
               this.configService.data.forEach((element, index) => {
                  if (element.vertexId == this.helper.v1.id) {
                     var len = 0;
                     var parent = this.graph.getDefaultParent();
                     var vertices = this.graph.getChildVertices(parent);
                     for (var i = 0; i < vertices.length; i++) {
                        len = len + (this.graph.getChildVertices(vertices[i])).length
                     }
                     this.configService.data.push({
                        "type": element.type,
                        "vertexId": String(vertices.length + 2 + len),
                        "dataVariables": [
                           {
                              "id": this.helperService.getLastId(),
                              "dataVariable": element.dataVariables[0].dataVariable,
                              "path": "",
                              "optional": ""
                           }
                        ]
                     })

                  }
               });
               this.helper.copyAction = false;
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
      this.helper.graphConfigurations(this.graph);
      this.helper.setVertexStyle(this.graph);

      //For edge connections
      this.graph = this.helper.connectPreview(this.graph);

      var doc = mxUtils.createXmlDocument();
      var obj = doc.createElement('UserObject');
      this.triggers = doc.createElement('triggers');
      this.helper.customVertex(this.graph);

      this.helper.setEdgeStyle(this.graph);
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

   deleteMultipleVertices() { this.helper.deleteMultipleVertices(this.graph); }

   copyMultipleVertices() {
      this.helper.copyMultipleVertices(this.graph);
   }

   createFlow(): void {
      const dialogRef = this.dialog.open(FlowDialog, {
         width: '368px',
         data: { title: "", description: "" }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            if (result[0] && result[1]) {
               this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()));
               // this.router.navigateByUrl('');
               var v1 = this.addStepWithType("TEXT_MESSAGE");
               var v2 = this.addStepWithType("TEXT_MESSAGE", 500, 200);
               this.graph.insertEdge(this.graph.getDefaultParent(), null, '', v1, v2);
            }
         }
      });
   }

   async retrieveJsonEndpoint() {

      try {
         var data: any = await this.configService.retrieveGraph();

      } catch (ex) {
         console.log(ex)
      }

      this.configService.data = data.data.data;
      data = JSON.stringify({ mxGraphModel: data.data.mxGraphModel });
      JsonCodec.loadJson(this.graph, data)
   }

   publish() {
      this.configService.publishmxGraph();
   }
   addStepWithType(type, x: any = 50, y: any = 0) {
      console.log(this.configService.data)
      this.helper.vertexType = type;
      const v1 = this.addStep(x, y);
      const length = this.configService.data.length;
      var lastId
      if (length > 0) {
         lastId = parseInt(this.configService.data[length - 1].dataVariables[0].id);
      } else {
         lastId = -1;
      }
      if (type === "ACTION") {
         this.configService.data.push({
            "type": type,
            "vertexId": this.helper.v1.id,
            "actions": [],
            "dataVariables": [
               {
                  "id": lastId + 1,
                  "dataVariable": "",
                  "path": "",
                  "optional": ""
               }
            ]
         });
      } else if (type === "CONDITION") {
         this.configService.data.push({
            "type": type,
            "vertexId": this.helper.v1.id,
            "conditions": [],
            "dataVariables": [
               {
                  "id": lastId + 1,
                  "dataVariable": "",
                  "path": "",
                  "optional": ""
               }
            ]
         });
      }
      else {
         this.configService.data.push({
            "type": type,
            "vertexId": this.helper.v1.id,
            "buttons": [],
            "dataVariables": [
               {
                  "id": lastId + 1,
                  "dataVariable": "",
                  "path": "",
                  "optional": ""
               }
            ]
         });
      }
      this.configService.autoSaveAdd(JsonCodec.getIndividualJson(this.helper.v1), type)
      return v1;
   }


}