import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy} from "@angular/core";
import {Appointment, Month, DayWithAppointments, MonthOverview} from "../stateTypes";
import {DayDetail} from "./day-detail.component";
import {Observable, Subscription} from "rxjs";
import * as moment from "moment";
import * as _ from "lodash";

@Component({
    selector: "month-view",
    directives: [DayDetail],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h1>{{formattedMonth$|async}}</h1>
        
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let week of weeks$|async; trackBy tracker">
                    <td *ngFor="let day of week; trackBy tracker">
                        <day-detail *ngIf="day" [dayWithAppointments]="day"
                            (addAppointment)="addAppointment.emit($event)" (updateAppointment)="updateAppointment.emit($event)"
                            (removeAppointment)="removeAppointment.emit($event)">
                        </day-detail>
                    </td>
                </tr>
            </tbody>
        </table>
    `
    // ,
    // host: {
    //     '[class.cal-today]': 'day.isToday'
    // }
})
export class MonthView implements OnInit, OnDestroy {
    @Input() public overview$: Observable<MonthOverview>;
    @Input() public month$: Observable<Month>;

    @Output() public addAppointment = new EventEmitter<Appointment>();
    @Output() public updateAppointment = new EventEmitter<Appointment>();
    @Output() public removeAppointment = new EventEmitter<Appointment>();

    public weeks$: Observable<Array<Array<DayWithAppointments>>>;
    public formattedMonth$: Observable<string>;

    public emptyDaysWithAppointments: Array<DayWithAppointments>;

    public tracker(index: number): number {
        return index;
    }

    private subscriptions: Array<Subscription> = [];

    public ngOnInit(): void {
        this.formattedMonth$ = this.month$.map((month: Month) => moment().year(month.year).month(month.month).format("MMM YYYY"));
        let daysWithAppointments$ = this.overview$.map((curMonthOverview: MonthOverview) => {
            if (!curMonthOverview) {
                return this.emptyDaysWithAppointments;
            }
            return this.emptyDaysWithAppointments.map((dayWithAppointments: DayWithAppointments) => {
                return curMonthOverview.daysWithAppointments.filter((item: DayWithAppointments) => {
                    return item.day.day === dayWithAppointments.day.day;
                })[0] || dayWithAppointments;
            });
        });
        this.weeks$ = daysWithAppointments$.map((days: Array<DayWithAppointments>) => {
            let res: any = _.groupBy(days, (item => moment().year(item.day.year).month(item.day.month).date(item.day.day).week()));
            var groupedByWeek: Array<Array<DayWithAppointments>> = Object.keys(res).map((key) => res[key]);
            return groupedByWeek.map((items: Array<DayWithAppointments>) => this.fulfillWeek(items));
        });
        this.subscriptions.push(this.month$.subscribe((month: Month) => {
            this.emptyDaysWithAppointments = this.getDefaultDaysWithAppointments(month);
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private getDefaultDaysWithAppointments(month: Month): Array<DayWithAppointments> {
        let dayOne = moment().year(month.year).month(month.month).date(1);
        let days: Array<DayWithAppointments> = [];
        for (var i = 0; i < dayOne.daysInMonth(); i++) {
            days.push({day: {year: month.year, month: month.month, day: i + 1}, appointments: []});
        }
        return days;
    }

    private fulfillWeek(days: Array<DayWithAppointments>): Array<DayWithAppointments> {
        let week = [null, null, null, null, null, null, null];
        days.forEach(day => {
            let momentDay = moment().year(day.day.year).month(day.day.month).date(day.day.day);
            week[momentDay.weekday()] = day;
        });
        return week;
    }
}
