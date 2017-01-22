import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit} from "@angular/core";
import {Appointment, DayWithAppointments} from "../stateTypes";
import {DayDetail} from "./day-detail.component";

@Component({
    selector: "day-view",
    directives: [DayDetail],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
       <h1>{{day.day.day}}-{{day.day.month +1 }}-{{day.day.year}}</h1>
       <day-detail *ngIf="day" [dayWithAppointments]="day"
                            (addAppointment)="addAppointment.emit($event)" (updateAppointment)="updateAppointment.emit($event)"
                            (removeAppointment)="removeAppointment.emit($event)">
       </day-detail>
    `
})
export class DayView implements OnInit {
    @Input() public day: DayWithAppointments;

    @Output() public addAppointment = new EventEmitter<Appointment>();
    @Output() public updateAppointment = new EventEmitter<Appointment>();
    @Output() public removeAppointment = new EventEmitter<Appointment>();

    public ngOnInit(): void {
    }
}