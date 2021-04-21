import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service'
@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html',
  styleUrls: ['./edit-agent.component.css']
})
export class EditAgentComponent implements OnInit {
  name: string = '';
  username: string = '';
  email: string = '';
  password: any = '';
  storeName: any = '';
  showError: any = '';
  errorText = "";
  roleId: any = "";
  agentId: any;
  constructor(private route: ActivatedRoute, private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.agentId = params.id;
        this.loadAgent()
      }
    });
  }

  async loadAgent() {
    const data = await this.apiCalls.getClient(this.agentId);
    this.setData(data.data)
  }


  setData(data) {
    this.email = data.email;
    this.username = data.username;
    this.name = data.name;
    this.roleId = data.roleId;
    this.password = ""
  }

  async updateAccount() {
    if (this.email && this.username && this.name && this.roleId && this.password) {
      this.apiCalls.loadingAnimation("Updating")
      const body = {
        email: this.email,
        username: this.username,
        name: this.name,
        roleId: this.roleId,
        password: this.password
      }
      await this.apiCalls.updateClient(this.agentId, body)
      this.apiCalls.loadingdialogRef.close();
    } else {
      this.errorText = "Enter all details";
      this.showError = true;
    }

  }
}
