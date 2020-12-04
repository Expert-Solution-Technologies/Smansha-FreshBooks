const ObjectID = require('mongodb').ObjectID;
import moment_tz from 'moment-timezone';
import { DateFormat } from 'src/enums/common-enums';
import moment from 'moment';


export class CommonFunctions {

    /**
     * This function is for string formatting or insert values in string
     * @param str String
     * @param arg Arguments to insert into string
     */
    stringFormatingInURL(str: string, arg: any[]) {
        let i: number = 0;
        for (; i < arg.length; i++) {
            str = str.replace('{' + i + '}', arg[i]);
        }
        return str;
    }

    getMongoObjectId() {
        const objectId = new ObjectID();
        return objectId;
    }

    /** Will find an element by Key in NameValue Collection Coming Back from QB by matching arg1
     * @param NameValue
     * @param arg1
     */
    getValueByKey = (NameValue: [], arg1: string) => {
        let match: any = NameValue.find((item: { Name: string, Value: string }) => {
            return item.Name === arg1;
        });
        if (match)
            return match.Value;
        else return ""
    }

    /** Will add Seconds to Current DateTime and return you date in ISO string
     * @param seconds
     */
    getDateByAddingSeconds = (seconds: number) => {
        let date = new Date();
        date.setSeconds(date.getSeconds() + seconds);
        return date.toISOString();
    }

    /**
     * Will return you a date in ISO string by adding or Subtracting No of months passed
     * @param month
     * @param resetDate  if true will send date with 1st day of month
     * eg:-date is "2020-04-20" addMonths(-1,true) will return "2020-03-01T00:00:00.000Z"
     * eg:-date is "2020-04-20" addMonths(-1) will return "2020-03-20T00:00:00.000Z"
     */
    addMonths = (month: number, timezone: string, resetDate?: boolean, crntDate?: Date) => {
        let tzDate = moment_tz(moment_tz.now()).tz(timezone).format(DateFormat.date);
        let currentDate = new Date(tzDate);
        if (crntDate) {
            currentDate = crntDate;
        }
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        currentDate.setMonth(currentDate.getMonth() + month);
        if (resetDate) {
            currentDate.setDate(1);
            currentDate.setHours(-1);
        }
        return currentDate.toISOString();
    }

    /** Will spilt date range into sub date groups based on days
     *  pass start date ,end date and no of days
     *  will spilt into sub date groups
     * @param startDate
     * @param endDate
     * @param days
     */
    getDateGroupsBetweenTwoDays = (startDate: any, endDate: any, days: number): any => {
        let date1 = moment(startDate, DateFormat.date);
        const date2 = moment(endDate, DateFormat.date);
        const dateGroups = [];
        while (true) {
            if (date2.diff(date1, 'days') > days) {
                const temp = date1.format(DateFormat.date);
                const eDate = date1.add(days, 'day');
                dateGroups.push({ end: date1.format(DateFormat.date), start: temp });
                date1 = moment(eDate).add(1, 'day');
            }
            else {
                dateGroups.push({ start: date1.format(DateFormat.date), end: date2.format(DateFormat.date) });
                break;
            }
        }
        return dateGroups;
    }

    textTruncate(str: string, length: number, ending: string) {
        if (str.length >= length) {
            return str.substring(0, length - ending.length) + ending;
        } else {
            return str;
        }
    }
}