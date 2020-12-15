import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Helper } from './helpers/graph-helper';
import { Card } from './helpers/custom-card';
declare var mxUtils: any;
declare var mxGraphModel: any;
declare var mxCodecRegistry: any;

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
  constructor() { }

  ngAfterViewInit() {
    //Callback functions
    this.addStep = () => {
      this.v1 = this.graph.insertVertex(parent, null, obj, 350, 150, 250, 160, "resizable=0;", null);
      var v2 = this.graph.insertVertex(this.v1, null, triggers, 60, 0, 135, 40, "resizable=0;constituent=1;movable=0;", null);
    }
    this.zoomOut = () => { this.graph.zoomOut(); }
    this.zoomIn = () => { this.graph.zoomIn(); }
    //End callback functions
    //Graph configurations
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    Helper.graphConfigurations(this.graph);
    //For edge connections
    this.graph = Helper.connectPreview(this.graph);

    var doc = mxUtils.createXmlDocument();
    var obj = doc.createElement('UserObject');
    var triggers = doc.createElement('triggers');
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
        // Returns a DOM for the label
        var div = document.createElement('div');
        div.innerHTML = cell.getAttribute('label');
        div.innerHTML = Card.startingStep();
        mxUtils.br(div);

        if (cached) {
          // Caches label
          cell.div = div;
        }
        if (div.getElementsByClassName('btnAddTrigger')[0]) {
          var node = document.createElement("SPAN");
          div.getElementsByClassName('btnAddTrigger')[0].addEventListener("click", this.addTrigger.bind(this));
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
    //For orthogonal edge style
    Helper.setEdgeStyle(this.graph);
    new mxRubberband(this.graph);
    var parent = this.graph.getDefaultParent();
    this.graph.getModel().beginUpdate();
    this.graph.foldingEnabled = false;
    this.graph.getModel().endUpdate();
    new mxHierarchicalLayout(this.graph).execute(this.graph.getDefaultParent());
  }
  addStep() { }
  zoomOut() { }
  zoomIn() { }
  addTrigger() {
    alert("Hello");
  }
}