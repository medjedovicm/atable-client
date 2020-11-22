import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerSupportServiceService {

  constructor(
    private http: HttpClient
  ) { }

  submitIssue(email: string, issueText: string) {
    return this.http.post(environment.api.url + "customer-support/submit", {email: email, issueText: issueText})
  }
}

