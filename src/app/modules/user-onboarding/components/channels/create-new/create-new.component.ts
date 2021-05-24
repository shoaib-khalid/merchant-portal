import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.css']
})
export class CreateNewComponent implements OnInit {
  channel: any;
  refId: any;
  constructor(public dialogRef: MatDialogRef<CreateNewComponent>,
    private apiCalls: ApiCallsService, private router: Router) { }

  ngOnInit(): void {
  }

  async create() {
    this.dialogRef.close();
    await this.apiCalls.createChannel({
      channelName: this.channel,
      refId: this.refId,
      userId: localStorage.getItem('ownerId')
    })
    this.apiCalls.successPopUp("Channel Added Successfully")
    location.reload()
  }
}
