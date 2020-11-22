import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/single-services/auth-service/auth.service';
import { CustomerSupportServiceService } from 'src/app/services/customer-support-service/customer-support-service.service';

@Component({
  selector: 'atb-contact-support',
  templateUrl: './atb-contact-support.component.html',
  styleUrls: ['./atb-contact-support.component.scss']
})
export class AtbContactSupportComponent implements OnInit {
  supportModal: boolean = false;
  issueText: string = "";
  responseStatusMessage: string = "";
  currentUserToken = localStorage.getItem("access_token")
  email = this.authService.decodeToken(this.currentUserToken)

  constructor(
    private authService: AuthService,
    private supportService: CustomerSupportServiceService
  ) { }

  ngOnInit(): void {
  }

  openSupportModal() {
    this.supportModal = true;
  }

  exitSupportModal() {
    this.supportModal = false;
    this.responseStatusMessage = "";
  }

  submitIssue() {
    if(this.issueText.length === 0) {
      this.responseStatusMessage = "Describe first what issue did you encounter?"
    } else {
      this.supportService.submitIssue(this.email.email, this.issueText).subscribe(res => {
        this.responseStatusMessage = res['message'];
        this.issueText = "";
      })
    }
  }

}
