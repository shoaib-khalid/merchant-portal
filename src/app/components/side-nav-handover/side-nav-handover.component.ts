import { Component } from '@angular/core';
import { JsonCodec } from 'src/app/helpers/json-codec';
import { Helper } from '../../helpers/graph-helper';
import { ApiCallsService } from '../../services/api-calls.service'
import { HelperService } from '../../services/helper.service';

@Component({
    selector: 'side-nav-handover',
    templateUrl: './side-nav-handover.component.html',
    styleUrls: ['./side-nav-handover.component.css']
})
export class SideNavHandOverComponent {
    opened: boolean;
    pinned: boolean = false;
    title: any;
    dataVariable: any = "";
    description: any = "";

    constructor(private apiCalls: ApiCallsService, private helperService: HelperService) {
     }


    toggle() {

        this.description = this.getDescriptionOfVertex();
        this.dataVariable = "";
        this.apiCalls.dataVariables.forEach((element, index) => {
            if (element.vertexId == Helper.v1.id) {
                this.dataVariable = element.dataVariables[0].dataVariable;
            }
        });

        if (this.opened) {

        } else {
            this.opened = true;

        }

    }
    pin() {
        if (this.pinned) {
            this.pinned = false;
            alert("Unpinned")
        } else {
            this.pinned = true;
            alert("Pinned")
        }
    }
    titleChange(text) {

        var strDigit = this.getStrDigit();
        const digit = Helper.digitFromString(strDigit);
        document.getElementById("header" + digit).textContent = text;

    }



    handleClick(event) {

        if (this.helperService.vertexClicked() === "HANDOVER") {
            if (event.target.id.includes("header") || event.target.id.includes("card")) {
                var id = event.target.id;
                var text = (<HTMLInputElement>document.getElementById("header" + id.match(/\d/g)[0])).innerHTML;
                (<HTMLInputElement>document.getElementById("handover-title")).value = text;
                this.toggle();
            } else if (event.target.localName === "svg") {
                if (this.pinned === false) {
                    this.opened = false;
                }
            }
        } else {
            this.opened = false;
        }
    }

    descriptionFocusOut(event) {
        this.apiCalls.autoSaveUpdate(JsonCodec.getIndividualJson(Helper.v1));

    }

    descriptionChange(event) {
        var strDigit = this.getStrDigit();
        const digit = Helper.digitFromString(strDigit);
        document.getElementById("initial-message" + digit).textContent = event.target.value;
    }

    getStrDigit() {
        if (Helper.v1.div.firstChild.id) {
            return Helper.v1.div.firstChild.id;
        } else {
            return Helper.v1.div.firstChild.nextElementSibling.id;
        }
    }
    getDescriptionOfVertex() {
        var strDigit = this.getStrDigit();
        const digit = Helper.digitFromString(strDigit);
        return document.getElementById("initial-message" + digit).textContent;
    }


    dataVariableFocusOut(event) {
        const vertexId = Helper.v1.id;
        const dataValue = event.target.value
        const length = this.apiCalls.dataVariables.length;
        var lastId;
        if (length > 0) {
            lastId = parseInt(this.apiCalls.dataVariables[length - 1].dataVariables[0].id);
        } else {
            lastId = -1;
        }
        var flag = false;
        for (var i = 0; i < length; i++) {
            if (this.apiCalls.dataVariables[i].vertexId === vertexId) {
                this.apiCalls.dataVariables[i].dataVariables[0].dataVariable = dataValue;
                flag = true;
            }
        }
        if (!flag) {
            this.apiCalls.dataVariables.push({
                "vertexId": vertexId,
                "dataVariables": [
                    {
                        "id": lastId + 1,
                        "dataVariable": dataValue,
                        "path": "",
                        "optional": ""
                    }
                ]
            })

        }
        this.apiCalls.autoSaveUpdate(JsonCodec.getIndividualJson(Helper.v1))

    }
    titleFocusOut(event) {
        this.apiCalls.autoSaveUpdate(JsonCodec.getIndividualJson(Helper.v1))
    
      }
}