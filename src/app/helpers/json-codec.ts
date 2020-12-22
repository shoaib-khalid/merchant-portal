declare var mxObjectCodec: any;
declare var mxUtils: any;

export class JsonCodec extends mxObjectCodec {
    constructor() {
        super((value) => { });
    }
    encode(value) {
        const xmlDoc = mxUtils.createXmlDocument();
        const newObject = xmlDoc.createElement("Object");
        for (let prop in value) {
            newObject.setAttribute(prop, value[prop]);
        }
        return newObject;
    }
    decode(model) {
        return Object.keys(model.cells).map(
            (iCell) => {
                const currentCell = model.getCell(iCell);
                return (currentCell.value !== undefined) ? currentCell : null;
            }
        ).filter((item) => (item !== null));
    }
    stringifyWithoutCircular(json) {
        return JSON.stringify(
            json,
            (key, value) => {
                if ((key === 'parent' || key == 'source' || key == 'target') && value !== null) {
                    return value.id;
                } else if (key === 'value' && value !== null && value.localName) {
                    let results = {};
                    Object.keys(value.attributes).forEach(
                        (attrKey) => {
                            const attribute = value.attributes[attrKey];
                            results[attribute.nodeName] = attribute.nodeValue;
                        }
                    )
                    return results;
                }
                return value;
            },
            4
        );
    }
    static render(dataModel,graph) {
        const jsonEncoder = new JsonCodec();
        this._graph = graph;
        this._vertices = {};
        this._dataModel = dataModel;
    
				const parent = this._graph.getDefaultParent();
				this._graph.getModel().beginUpdate(); // Adds cells to the model in a single step
				try {
          
          this._dataModel.graph.map(
            (node)=> {
                if(node.value) {
                  if(typeof node.value === "object") {
                       const xmlNode = jsonEncoder.encode(node.value);
                       this._vertices[node.id] = this._graph.insertVertex(parent, null, xmlNode, node.geometry.x, node.geometry.y, node.geometry.width, node.geometry.height);
                  } else if(node.value === "Edge") {
                       this._graph.insertEdge(parent, null, 'Edge', this._vertices[node.source],  this._vertices[node.target])
                  }
                }
            }
          );
          
				} finally {
					this._graph.getModel().endUpdate(); // Updates the display
        }
  }  
}