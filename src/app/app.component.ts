import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Helper } from './helpers/graph-helper';
import { Cards } from './helpers/cards';
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
  constructor() {
  }
  ngAfterViewInit() {

    this.zoomOut = () => {
      this.graph.zoomOut();
    }
    this.zoomIn = () => {
      this.graph.zoomIn();
    }

    this.graph = new mxGraph(this.graphContainer.nativeElement);
    this.graph.setPanning(true);
    this.graph.panningHandler.useLeftButtonForPanning = true;
    this.graph.setAllowDanglingEdges(false);
    this.graph.panningHandler.select = false;
    this.graph.view.setTranslate(120, 100);

    //For edge connections
    this.graph = Helper.connectPreview(this.graph);


    var doc = mxUtils.createXmlDocument();
    var obj = doc.createElement('UserObject');
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

    this.graph.convertValueToString = function (cell) {
      if (cached && cell.div != null) {
        // Uses cached label
        return cell.div;
      }
      else if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'userobject') {
        // Returns a DOM for the label
        var div = document.createElement('div');
        div.innerHTML = cell.getAttribute('label');
        div.innerHTML = Cards.startingStep();

        mxUtils.br(div);


        if (cached) {
          // Caches label
          cell.div = div;
        }
        if (div.getElementsByClassName('btnAddTrigger')[0]) {

          var node = document.createElement("SPAN");
          div.getElementsByClassName('btnAddTrigger')[0].addEventListener("click", function () {
            // var textnode = document.createTextNode("Add Trigger");
            // node.appendChild(textnode);
            node.innerHTML=`<br> <button type="button" class="btn btn-outline-primary btn-block btnAddTrigger">Text</button>` +node.innerHTML ;
            alert("Add trigger Clicked!");
            div.getElementsByClassName('btnAppend')[0].appendChild(node);

          });

        }

        return div;
      }

      return '';
    };


    // Overrides method to store a cell label in the model
    var cellLabelChanged = this.graph.cellLabelChanged;
    this.graph.cellLabelChanged = function (cell, newValue, autoSize) {
      if (mxUtils.isNode(cell.value) && cell.value.nodeName.toLowerCase() == 'userobject') {
        // Clones the value for correct undo/redo
        var elt = cell.value.cloneNode(true);
        elt.setAttribute('label', newValue);
        newValue = elt;
      }

      cellLabelChanged.apply(this, arguments);
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


    this.graph.constrainChildren = false;
    this.graph.extendParents = false;
    this.graph.extendParentsOnAdd = false;

    new mxRubberband(this.graph);

    var parent = this.graph.getDefaultParent();

    // Adds cells to the model in a single step
    this.graph.getModel().beginUpdate();
    this.graph.foldingEnabled = false;



    try {

    } finally {
      this.graph.getModel().endUpdate();
      new mxHierarchicalLayout(this.graph).execute(this.graph.getDefaultParent());
    }

    /*
    Callback functions
    */
    this.addStep = () => {

      var v1 = this.graph.insertVertex(parent, null, obj, 350, 150, 250, 160, "resizable=0;", null);

    }
  }


  addStep() {

  }
  zoomOut() {

  }
  zoomIn() {

  }


  private reSetInformationMessage(flow_start_trigger_list: HTMLElement) {
    let flow_start_info = document.getElementById('flow-start-info');
    if (flow_start_trigger_list.children.length > 0) {
      flow_start_info.style.display = "none";
    } else {
      flow_start_info.style.display = "inline-block";
    }
  }



}
