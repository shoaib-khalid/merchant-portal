
declare var mxUtils: any;
declare var json2xml: any;
declare var mxCodec: any;
declare var xml2json: any;

export class JsonCodec {


    static getJson(graph: any): string {
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());
        return xml2json(mxUtils.parseXml(mxUtils.getXml(node)), "");

    }
    static loadJson(graph: any, json: any) {

        let xml2 = json2xml(JSON.parse(json), "");
        let doc = mxUtils.parseXml(xml2);

        let codec = new mxCodec(doc);
        codec.decode(doc.documentElement, graph.getModel());
        // let elt = doc.documentElement.firstChild;
        // let cells = [];
        // while (elt != null) {
        //     let cell = codec.decodeCell(elt)
        //     if (cell != undefined) {
        //         if (cell.id != undefined && cell.parent != undefined && (cell.id == cell.parent)) {
        //             elt = elt.nextSibling;
        //             continue;
        //         }
        //         cells.push(cell);
        //     }
        //     elt = elt.nextSibling;
        // }
        // graph.addCells(cells);
    }
}