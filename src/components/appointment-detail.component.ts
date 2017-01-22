import {Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnChanges} from "@angular/core";
import {Control} from "@angular/common";
import {Appointment} from "../stateTypes";
import * as moment from "moment";
@Component({
    selector: "appointment-detail",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div *ngIf="!editMode" (click)="enableEditMode()">
            {{appointment.description}} {{appointment.date|date: "hh:mm"}}
        </div>
        <input *ngIf="editMode" autofocus class="form-control" type="text" [(ngModel)]="description"/>
        <select name="" class="form-control" *ngIf="editMode" [(ngModel)]="selectedHour">
            <option value="{{hour}}" *ngFor="let hour of hours">{{hour}}</option>
        </select>
        <br/>
        <div *ngIf="editMode" class="btn-group">
            <button class="btn btn-default" (click)="onCancel()"><i class="fa fa-undo"></i></button>
            <button class="btn btn-primary" (click)="onSave()"><i class="fa fa-save"></i></button>
        </div>
    `
})
export class AppointmentDetail implements OnChanges {
    @Input() public appointment: Appointment;
    @Output() public update = new EventEmitter<Appointment>();


    public editControl = new Control("description");
    public editMode: boolean = false;
    public description: string = "";
    public selectedHour: string;
    public hours: Array<string> = [];

    public enableEditMode(): void {
        this.editMode = true;
    }

    constructor() {
        for (let i = 0; i < 24; i++) {
            this.hours.push(moment().hours(i).minutes(0).format("HH:mm"));
            this.hours.push(moment().hours(i).minutes(30).format("HH:mm"));
            this.selectedHour = this.hours[0];
        }
    }

    public onSave(): void {
        this.editMode = false;
        let splitted = this.selectedHour.split(":");
        let date = moment(this.appointment.date).hours(Number(splitted[0])).minutes(Number(splitted[1])).toDate();
        let freshAppointment = Object.assign({}, this.appointment, {description: this.description, date});
        this.update.emit(freshAppointment);
    }

    public onCancel(): void {
        this.editMode = false;
        this.description = this.appointment.description;
        this.selectedHour = moment(this.appointment.date).format("HH:mm");
    }

    public ngOnChanges(): void {
        this.description = this.appointment.description;
        this.selectedHour = moment(this.appointment.date).format("HH:mm");
    }
}