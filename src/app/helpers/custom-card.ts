export class Card {
 static startingStep(id, icon, title) {
    return `  <div id="flow` + id + `"class='custom-card flow-start-container shadow-lg bg-white' style='border-radius:33px'>
    <div class="tooltip-parent">  
    </div>
    <span class="tooltip-text">
        <div class="d-inline img-icon mr-2">
        <img class="delete" src="../assets/delete.png" />
        </div>  
        <img class="copy" class="img-icon"src="../assets/copy.png"/>
      </span>
      
          <div class="card" style='border-radius:35px;border:0px;width:300px; min-height:200px;'>
          <svg height="20" width="20" class="connect-icon" style="position: absolute;right: -12px; top:80%;z-index: 990;">
            <circle cx="10" cy="10" r="8" stroke="gray" stroke-width="2" fill="white"></circle>
          </svg>
            <div id="card-header`+ id + `"class="card-header" style='background-color:white;border-radius:35px;border:0px;' >
              <img src="../assets/`+ icon + `" class="start-icon float-left" alt="..." style="width:35px;height=35px">
              <div style='margin-left:60px;margin-top:5px;'>
                <h4 id="header`+ id + `"class="header">` + title + `</h4>
              </div>
            </div>
            <div id="card-body`+ id + `"class="card-body flow-start-trigger-list" style="height:63px">
            <span id="initial-message`+id+`"class="initial-message" style="font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500"> Flow starts with the following step. Click to add the triggers. </span>
            </div>
            <div class="card-footer" style='background-color:white;border-radius:35px;border:0px;'>
              <div class="row">
                <div class="col-md-12 btnAppend">
                  <button type="button" class="btn btn-outline-secondary btn-block btnAddTrigger">Add Trigger</button>
                </div>
              </div>      
            </div>
          </div>
        </div>
          `;
  }
 
  static action(id, icon, title) {
    return `  <div id="flow` + id + `"class='custom-card flow-start-container shadow-lg bg-white' style='border-radius:33px'>
    <div class="tooltip-parent">  
    </div>
    <span class="tooltip-text">
        <div class="d-inline img-icon mr-2">
        <img class="delete" src="../assets/delete.png" />
        </div>  
        <img class="copy" class="img-icon"src="../assets/copy.png"/>
      </span>
      
          <div class="card" style='border-radius:35px;border:0px;width:300px; min-height:200px;'>
          <svg height="20" width="20" class="connect-icon" style="position: absolute;right: -12px; top:80%;z-index: 990;">
            <circle cx="10" cy="10" r="8" stroke="gray" stroke-width="2" fill="white"></circle>
          </svg>
            <div id="card-header`+ id + `"class="card-header actionHeader" style="background-color: rgb(245, 242, 65);">
              <img src="../assets/`+ icon + `" class="start-icon float-left" alt="..." style="width:35px;height=35px">
              <div style='margin-left:60px;margin-top:5px;'>
                <h4 id="header`+ id + `"class="header">` + title + `</h4>
              </div>
            </div>
            <div id="card-body`+ id + `"class="card-body flow-start-trigger-list" style="height:63px">
            <div class="actionBody">
                <h4 class="actionBodyText"> Click to add an action </h4>
            </div>
            </div>
            <div class="card-footer" style='background-color:white;border-radius:35px;border:0px;'>
              <div class="row">
                <div class="col-md-12 btnAppend">
                  <button type="button" class="btn btn-outline-secondary btn-block btnAddTrigger">Add Trigger</button>
                </div>
              </div>      
            </div>
          </div>
        </div>
          `;
  }
  static condition(id, icon, title) {
    return `  <div id="flow` + id + `"class='custom-card flow-start-container shadow-lg bg-white' style='border-radius:33px'>
    <div class="tooltip-parent">  
    </div>
    <span class="tooltip-text">
        <div class="d-inline img-icon mr-2">
        <img class="delete" src="../assets/delete.png" />
        </div>  
        <img class="copy" class="img-icon"src="../assets/copy.png"/>
      </span>
      
          <div class="card" style='border-radius:35px;border:0px;width:300px; min-height:200px;'>
          <svg height="20" width="20" class="connect-icon" style="position: absolute;right: -12px; top:80%;z-index: 990;">
            <circle cx="10" cy="10" r="8" stroke="gray" stroke-width="2" fill="white"></circle>
          </svg>
            <div id="card-header`+ id + `"class="card-header actionHeader" style="background-color: #63E6F3">
              <img src="../assets/`+ icon + `" class="start-icon float-left" alt="..." style="width:35px;height=35px">
              <div style='margin-left:60px;margin-top:5px;'>
                <h4 id="header`+ id + `"class="header">` + title + `</h4>
              </div>
            </div>
            <div id="card-body`+ id + `"class="card-body flow-start-trigger-list" style="height:63px">
            <div class="actionBody">
                <h4 class="actionBodyText"> Click to add an condition </h4>
            </div>
            </div>
            <div class="card-footer" style='background-color:white;border-radius:35px;border:0px;'>
              <div class="row">
                <div class="col-md-12 btnAppend">
                  <button type="button" class="btn btn-outline-secondary btn-block btnAddTrigger">Add Trigger</button>
                </div>
              </div>      
            </div>
          </div>
        </div>
          `;
  }
  private static _triggerButton: string = `<div class="row">
    <div class="col-md-12">
      <button type="button" class="btn btn-outline-primary btn-block mb-2"> <img src="assets/icons/door-open.svg" alt="" width="32" height="32"> Trigger 1 </button>
    </div>
  </div>`;

  public static get InitialMesssage(): string { return ` <span> Flow starts with the following step. <br> Click to add the triggers. </span>` };

  public static get TriggerButton(): string {
    return this._triggerButton;
  }

}