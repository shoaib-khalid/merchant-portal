import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Helper } from './helpers/graph-helper';
import { Card } from './helpers/custom-card';
import { NgModel } from '@angular/forms';
declare var mxUtils: any;
declare var mxGraphModel: any;
declare var mxCodecRegistry: any;
declare var mxConstants: any;
declare var mxGraphHandler: any;
declare var mxClient: any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('graphContainer') graphContainer: ElementRef;
  public anchorPosition: boolean = true;
  graph: any;
  v1: any;
  triggers: any;
  verticalDistance: any;
  constructor() { }

  ngAfterViewInit() {
    mxClient.link('stylesheet', '../assets/css/mxGraph.css');


    this.verticalDistance = 0;
    var flag= false;
    //Callback functions
    this.addStep = () => {
      
      this.v1 = this.graph.insertVertex(parent, null, obj, 230, 100, 330, 177, "rounded=1;whiteSpace=wrap ;autosize=1;resizable=0;", null);
      if(flag){
        this.v1.setConnectable(true);
      }else{
        this.v1.setConnectable(false);
        flag = true;
        var port = this.graph.insertVertex(this.v1, null, 'Test', 0.90 , 0.90, 16, 16,
        'port;image=../assets/circle.png;spacingLeft=18', true);
      }
     
  
        // port.geometry.offset = new mxPoint(-5, -5);

       
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

    this.graph.convertValueToString = (cell) => {
      if (cached && cell.div != null) {
        // Uses cached label
        return cell.div;
      }
      else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'userobject') {
        // Returns a DOM for the labelalert("Hello");
        var div = document.createElement('div');
        div.innerHTML = cell.getAttribute('label');
        div.innerHTML = Card.startingStep();
        mxUtils.br(div);

        if (cached) {
          // Caches label
          cell.div = div;
        }
        if (div.getElementsByClassName('btnAddTrigger')[0]) {

          div.getElementsByClassName('btnAddTrigger')[0].addEventListener("click", () => {
            var v2 = this.graph.insertVertex(this.v1, null, this.triggers, 60, this.verticalDistance, 135, 40, "resizable=0;constituent=1;movable=0;", null);
            // div.getElementsByClassName('btnAppend')[0].prepend(v2);
            this.verticalDistance = this.verticalDistance+50;
          });
        }
        return div;
      }
      else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'triggers') {
        // Returns a DOM for the label

        var div = document.createElement('div');
        div.innerHTML = cell.getAttribute('label');
        div.innerHTML = Helper.customTrigger();

        mxUtils.br(div);
        if (cached) {
          // Caches label
          cell.div = div;
        }
        return div;
      }
      return '';
    };

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


    // var node = document.createElement("SPAN");
    // node.innerHTML = Helper.addTrigger() + node.innerHTML;
    // mxUtils.br(node);
    // div.getElementsByClassName('btnAppend')[0].prepend(node);
    // var v2 = this.graph.insertVertex(this.v1, null, this.triggers, 60, this.verticalDistance, 135, 40, "resizable=0;constituent=1;movable=0;", null);
    // this.verticalDistance = this.verticalDistance+50;
  }
}