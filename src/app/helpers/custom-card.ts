export class Card {
  static startingStep() {
    return `  <div id="card" class='flow-start-container shadow-lg p-3 mt-3 bg-white' style='border-radius:33px'>
    <div id="tooltip-parent">  
    </div>
    <span class="tooltip-text">
        <div class="d-inline img-icon mr-2">
        <img id="delete"src="../assets/delete.png" />
        </div>  
        <img class="img-icon"src="../assets/copy.png"/>
      </span>
      
          <div class="card" style='border-radius:35px;border:0px;width:300px'>
            <div class="card-header" style='background-color:white;' >
              <img src="../assets/play.png" class="start-icon float-left" alt="..." >
              <div style='margin-left:60px;margin-top:5px;'>
                <h4>Starting Step</h4>
              </div>
            </div>
            <div class="card-body max-h-150" id='flow-start-trigger-list'>
        <p id="flow-start-info"> Flow starts with the following step. </br> Click to add the triggers. </p>      
        </div>
            <div class="card-footer" style='background-color:white;'>
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
  public static get TriggerButton(): string {
    return this._triggerButton;
  }

}