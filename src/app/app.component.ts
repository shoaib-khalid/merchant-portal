import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Helper } from './helpers/graph-helper';
import { JsonCodec } from './helpers/json-codec';
import { saveAs } from 'file-saver';
// import {SideNav} from './components/side-nav/side-nav.component';
import { ConfigService } from "./config/config.service";
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
   triggers: any;
   redoPointer: any;
   opened: boolean;

   constructor(private configService: ConfigService) { }

   ngAfterViewInit() {
      // this.postData();
      // this.retrieveJson();
      this.redoPointer = 0;

      //Callback functions

      this.addStep = () => {
         let vertext = undefined;
         vertext = this.graph.insertVertex(this.graph.getDefaultParent(), null, obj, 230, 100, 300, 230, "rounded=1;whiteSpace=wrap;autosize=0;resizable=0;", null);
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
         // this.individualJson(undoManager.history);
         this.redoPointer++;
         undoManager.undoableEditHappened(evt.getProperty('edit'));
         // console.log(undoManager.history[undoManager.history.length-1].changes[0].child)

         try{
         this.individualJson(undoManager.history[undoManager.history.length-1].changes[0].child);
         }catch(ex){

         }
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


   individualJson(vertex){
     let json =  JsonCodec.getIndividualJson(vertex);
   //   console.log(json);
   }

   showJson() {
      let json = JsonCodec.getJson(this.graph);
      // console.log(json)
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


   showData() {
      this.configService.getData()
         .subscribe(data => {
            console.log(data)
         }
         );
   }
   postData() {
      this.configService.postRawJson()
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

   deleteMultipleVertices() {}

}