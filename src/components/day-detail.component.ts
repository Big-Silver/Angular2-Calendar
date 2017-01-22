import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from "@angular/core";
import {Appointment, DayWithAppointments} from "../stateTypes";
import * as  moment from "moment";
import {AppointmentDetail} from "./appointment-detail.component";
@Component({
    selector: "day-detail",
    directives: [AppointmentDetail],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table [style.background-color]="isToday()" class="table table-striped">
            <thead>
                <tr>
                    <td>
                        <span class="">{{dayWithAppointments.day.day}}</span>
                        <span class="label label-success pull-right" *ngIf="dayWithAppointments.appointments.length === 0">Free</span>
                        <span class="label label-danger pull-right" *ngIf="dayWithAppointments.appointments.length > 0">Occupied</span>
                    </td>
                    <td>
                        <button class="btn btn-block btn-sm btn-default" (click)="onAdd()"><i class="fa fa-plus-circle"></i></button>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let appointment of dayWithAppointments.appointments">
                    <td>
                        <appointment-detail [appointment]="appointment" (remove)="removeAppointment.emit($event)" 
                        (update)="updateAppointment.emit($event)"></appointment-detail>
                    </td>
                    <td>
                        <button class="btn btn-danger" (click)="removeAppointment.emit(appointment)"><i class="fa fa-trash-o"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    `
})
export class DayDetail {
    @Input() public dayWithAppointments: DayWithAppointments;

    @Output() public addAppointment = new EventEmitter<Appointment>();
    @Output() public updateAppointment = new EventEmitter<Appointment>();
    @Output() public removeAppointment = new EventEmitter<Appointment>();


    public onAdd(): void {
        let fakeDate = moment().year(this.dayWithAppointments.day.year).month(this.dayWithAppointments.day.month)
            .date(this.dayWithAppointments.day.day).hours(0).minutes(0);        
        this.addAppointment.emit(new Appointment(fakeDate.toDate(), ""));
    }

    public isToday(): string {
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        console.log(year);
        console.log(month);
        console.log(day);
        if(this.dayWithAppointments.day.day == day){
            console.log("true");
            return "#ededed";
        }
        else
            return "transparent";
    }

    constructor() {
    }
}