export class Card {
  static startingStep() {
    return `  <div class="custom-card" class='flow-start-container shadow-lg p-3 mt-3 bg-white' style='border-radius:33px'>
    <div class="tooltip-parent">  
    </div>
    <span class="tooltip-text">
        <div class="d-inline img-icon mr-2">
        <img class="delete"src="../assets/delete.png" />
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
            <div class="card-body flow-start-trigger-list max-h-150"></div>
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

  public static get InitialMesssage(): string { return ` <span> Flow starts with the following step. <br> Click to add the triggers. </span>` };

  public static get TriggerButton(): string {
    return this._triggerButton;
  }

}