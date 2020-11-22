import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'chatTimeElapsed'
})
export class ChatTimeElapsedPipe implements PipeTransform {

  transform(timestamp: any): string {
    let msgTime = moment(timestamp);

    if (!msgTime) {
      return "0";
    }

    let minutesElapsed = moment().diff(msgTime, "minutes");
    let hoursElapsed = moment().diff(msgTime, "hours");
    let daysElapsed = moment().diff(msgTime, "days");
    let monthsElapsed = moment().diff(msgTime, "month");
    let yearsElapsed = moment().diff(msgTime, "year");

    if (yearsElapsed >= 1) {
      return yearsElapsed < 2 ? yearsElapsed + "yr ago" : yearsElapsed + "yrs ago";
    }
    if (monthsElapsed >= 1) {
      return monthsElapsed + "mo ago";
    }
    if (daysElapsed >= 1) {
      return daysElapsed + "d ago";
    }
    if (hoursElapsed >= 1) {
      return hoursElapsed + "h ago";
    }
    if (minutesElapsed >= 1) {
      return minutesElapsed + "m ago";
    }
    if (minutesElapsed < 1) {
      return "Just now"
    }
  }

}
