import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy} from "@angular/core";
import {Appointment, DayWithAppointments, WeekOverview, Week} from "../stateTypes";
import {Observable, Subscription} from "rxjs";
import * as moment from "moment";
import {DayDetail} from "./day-detail.component";

@Component({
    selector: "week-view",
    directives: [DayDetail],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h1>{{(overview$|async)?.week}}/{{(overview$|async)?.year}}</h1>

        <table class="table">
            <thead>
                <tr>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tues</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td *ngFor="let day of days$|async; trackBy tracker">
                        <day-detail *ngIf="day" [dayWithAppointments]="day"
                            (addAppointment)="addAppointment.emit($event)" (updateAppointment)="updateAppointment.emit($event)"
                            (removeAppointment)="removeAppointment.emit($event)">
                        </day-detail>
                    </td>
                </tr>
            </tbody>
        </table>
    `
})
export class WeekView implements OnInit, OnDestroy {
    @Input() public overview$: Observable<WeekOverview>;
    @Input() public week$: Observable<Week>;

    @Output() public addAppointment = new EventEmitter<Appointment>();
    @Output() public updateAppointment = new EventEmitter<Appointment>();
    @Output() public removeAppointment = new EventEmitter<Appointment>();


    public days$: Observable<Array<DayWithAppointments>>;
    public emptyDaysWithAppointments: Array<DayWithAppointments>;

    public tracker(index: number): number {
        return index;
    }

    private subscriptions: Array<Subscription> = [];

    public ngOnInit(): void {
        this.days$ = this.overview$.map((overview: WeekOverview) => {
            return this.emptyDaysWithAppointments.map((dayWithAppointments: DayWithAppointments) => {
                return overview.daysWithAppointments.filter((item: DayWithAppointments) => {
                        return item.day.day === dayWithAppointments.day.day;
                    })[0] || dayWithAppointments;
            });
        });
        this.subscriptions.push(this.week$.subscribe((week: Week) => {
            this.emptyDaysWithAppointments = this.getDefaultDaysWithAppointments(week);
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private getDefaultDaysWithAppointments(week: Week): Array<DayWithAppointments> {
        let days: Array<DayWithAppointments> = [];
        let momentWeek = moment().year(week.year).week(week.week);
        for (let i = 0; i < 7; i++) {
            let sunday = momentWeek.startOf("week");
            let date = sunday.add(i, "days");
            days.push({day: {year: date.year(), month: date.month(), day: date.date()}, appointments: []});
        }
        return days;
    }
}
