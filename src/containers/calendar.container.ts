import {Component, OnInit} from "@angular/core";
import {MonthView} from "../components/month-view.component.ts";
import {MonthOverview, Appointment, Month, DayWithAppointments, WeekOverview, Week, Day} from "../stateTypes";
import {Observable} from "rxjs";
import * as moment from "moment";
import {ViewMode} from "../enums";
import {WeekView} from "../components/week-view.component.ts";
import {DayView} from "../components/day-view.component";
import {CalendarModel} from "../models/calendar.model";
@Component({
    selector: "calendar",
    providers: [CalendarModel],
    directives: [MonthView, WeekView, DayView],
    template: `
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <button class="class btn btn-default" (click)="previous()"><i class="fa fa-chevron-left"></i></button>
                <button class="class btn btn-default" (click)="next()"><i class="fa fa-chevron-right"></i></button>
                <button class="btn btn-default" (click)="setViewMode(0)">Day</button>
                <button class="btn btn-default" (click)="setViewMode(1)">Week</button>
                <button class="btn btn-default" (click)="setViewMode(2)">Month</button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <month-view *ngIf="(viewMode$|async) === 2" [overview$]="currentMonthOverview$" [month$]="selectedMonth$" 
                    (addAppointment)="addAppointment($event)" (removeAppointment)="removeAppointment($event)" 
                    (updateAppointment)="updateAppointment($event)"></month-view>
                <week-view *ngIf="(viewMode$|async) === 1" [overview$]="currentWeekOverview$" [week$]="selectedWeek$"
                    (addAppointment)="addAppointment($event)" (removeAppointment)="removeAppointment($event)" 
                    (updateAppointment)="updateAppointment($event)"></week-view>
                <day-view *ngIf="(viewMode$|async) === 0" [day]="dayOverview$|async"
                    (addAppointment)="addAppointment($event)" (removeAppointment)="removeAppointment($event)" 
                    (updateAppointment)="updateAppointment($event)"></day-view>
            </div>
        </div>
    </div>
    `
})
export class Calendar implements OnInit {
    public selectedMonth$ = this.model.selectedMonth$;
    public selectedDay$ = this.model.selectedDay$;
    public selectedWeek$ = this.model.selectedWeek$;
    private allMonthOverviews$ = this.model.allMonthOverviews$;

    public viewMode$ = this.model.viewMode$;

    public currentMonthOverview$: Observable<MonthOverview> = Observable.combineLatest(
        this.allMonthOverviews$, this.selectedMonth$, (monthOverviews: Array<MonthOverview>, selectedMonth: Month) => {
            return monthOverviews.filter((monthOverview: MonthOverview) =>
            monthOverview.month === selectedMonth.month && monthOverview.year === selectedMonth.year)[0];
        });

    public currentWeekOverview$: Observable<WeekOverview> = Observable.combineLatest(
        this.allMonthOverviews$, this.selectedWeek$, (monthOverviews: Array<MonthOverview>, selectedWeek: Week) => {
            let daysWithAppointments = [];
            let weekMoment = moment().year(selectedWeek.year).week(selectedWeek.week);
            monthOverviews.forEach((overview: MonthOverview) => {
                let matchingDays = overview.daysWithAppointments.filter((day: DayWithAppointments) => {
                    let dayMoment = moment().year(day.day.year).month(day.day.month).date(day.day.day);
                    return dayMoment > weekMoment.startOf("week") && dayMoment < weekMoment.endOf("week");
                });
                daysWithAppointments.push(...matchingDays);
            });
            return new WeekOverview(selectedWeek.year, selectedWeek.week, daysWithAppointments);
        }); 

    public dayOverview$: Observable<DayWithAppointments> = Observable.combineLatest(this.allMonthOverviews$, this.selectedDay$,
        (monthOverviews: Array<MonthOverview>, selectedDay: Day) => {
            let dayWithAppointments: DayWithAppointments = {day: selectedDay, appointments: []};
            monthOverviews.forEach((overview: MonthOverview) => {
                dayWithAppointments = overview.daysWithAppointments.filter((day: DayWithAppointments) => {
                        return day.day.day === selectedDay.day && day.day.month === selectedDay.month
                            && day.day.year === selectedDay.year;
                    })[0] || dayWithAppointments;
            });
            return dayWithAppointments;
        });

    constructor(private model: CalendarModel) {
    }

    public ngOnInit(): void {
        this.model.resetCalendar();
    }

    public previous(): void {
        this.model.previous();
    }

    public next(): void {
        this.model.next();
    }

    public setViewMode(viewMode: ViewMode): void {
        this.model.setViewMode(viewMode);
    }

    public addAppointment(appointment: Appointment): void {
        this.model.addAppointment(appointment);
    }

    public removeAppointment(appointment: Appointment): void {
        this.model.removeAppointment(appointment);
    }

    public updateAppointment(appointment: Appointment): void {
        this.model.updateAppointment(appointment);
    }
}