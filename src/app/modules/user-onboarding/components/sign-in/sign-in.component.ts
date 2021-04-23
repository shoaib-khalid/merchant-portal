import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  username: any = '';
  password: any = '';
  error:any=""
  showError:Boolean=false;
  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
  }

  async authenticateClient() {
    const data = {
      username: this.username,
      password: this.password
    }

    if (this.username && this.password) {
      this.apiCalls.loadingAnimation("Logging in")
      this.apiCalls.authenticateClient(data);
    }else{
      this.showError_('Please enter all details')
    }
  }

  showError_(error){
    this.error = error;
    this.showError= true;
  }

}
