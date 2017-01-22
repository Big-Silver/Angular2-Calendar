import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {State, Appointment} from "../stateTypes";
import {setSelectedMonth, setViewMode, addAppointment, removeAppointment, updateAppointment, setSelectedWeek, setSelectedDay} from "../actions";
import * as moment from "moment";
import {ViewMode} from "../enums";

@Injectable()
export class CalendarModel {
    public allMonthOverviews$ = this.store.select(state => state.data.monthOverviews);

    public selectedMonth$ = this.store.select(state => state.application.selectedMonth);
    public selectedDay$ = this.store.select(state => state.application.selectedDay);
    public selectedWeek$ = this.store.select(state => state.application.selectedWeek);
    public viewMode$ = this.store.select(state => state.application.viewMode);

    constructor(private store: Store<State>) {
    }

    public resetCalendar(): void {
        let time = moment();
        this.store.dispatch(setSelectedMonth(time.month(), time.year()));
        this.store.dispatch(setSelectedWeek(time.week(), time.year()));
        this.store.dispatch(setSelectedDay(time.date(), time.month(), time.year()));
    }

    public previous(): void {
        let viewMode = this.store.getState().application.viewMode;
        let calculatedTime;
        switch (viewMode) {
            case ViewMode.Month:
                let curMonth = this.store.getState().application.selectedMonth;
                calculatedTime = moment().year(curMonth.year).month(curMonth.month).add(-1, "months");
                this.store.dispatch(setSelectedMonth(calculatedTime.month(), calculatedTime.year()));
                break;
            case ViewMode.Week:
                let curWeek = this.store.getState().application.selectedWeek;
                calculatedTime = moment().year(curWeek.year).week(curWeek.week).startOf("week").add(-1, "weeks");
                this.store.dispatch(setSelectedWeek(calculatedTime.week(), calculatedTime.year()));
                break;
            case ViewMode.Day:
                let curDay = this.store.getState().application.selectedDay;
                calculatedTime = moment().year(curDay.year).month(curDay.month).date(curDay.day).add(-1, "days");
                this.store.dispatch(setSelectedDay(calculatedTime.date(), calculatedTime.month(), calculatedTime.year()));
                break;
            default:
                break;
        }
    }

    public next(): void {
        let viewMode = this.store.getState().application.viewMode;
        switch (viewMode) {
            case ViewMode.Month:
                let curMonth = this.store.getState().application.selectedMonth;
                let calculatedTime = moment().year(curMonth.year).month(curMonth.month).add(1, "months");
                this.store.dispatch(setSelectedMonth(calculatedTime.month(), calculatedTime.year()));
                break;
            case ViewMode.Week:
                let curWeek = this.store.getState().application.selectedWeek;
                calculatedTime = moment().year(curWeek.year).week(curWeek.week).startOf("week").add(1, "weeks");
                this.store.dispatch(setSelectedWeek(calculatedTime.week(), calculatedTime.year()));
                break;
            case ViewMode.Day:
                let curDay = this.store.getState().application.selectedDay;
                calculatedTime = moment().year(curDay.year).month(curDay.month).date(curDay.day).add(1, "days");
                this.store.dispatch(setSelectedDay(calculatedTime.date(), calculatedTime.month(), calculatedTime.year()));
                break;
            default:
                break;
        }
    }

    public setViewMode(viewMode: ViewMode): void {
        this.store.dispatch(setViewMode(viewMode));
    }

    public addAppointment(appointment: Appointment): void {
        let appointmentMoment = moment(appointment.date);
        let day = {year: appointmentMoment.year(), month: appointmentMoment.month(), day: appointmentMoment.date()};
        this.store.dispatch(addAppointment(appointment, day));
    }

    public removeAppointment(appointment: Appointment): void {
        let appointmentMoment = moment(appointment.date);
        let day = {year: appointmentMoment.year(), month: appointmentMoment.month(), day: appointmentMoment.date()};
        this.store.dispatch(removeAppointment(appointment.id, day));
    }

    public updateAppointment(appointment: Appointment): void {
        let appointmentMoment = moment(appointment.date);
        let day = {year: appointmentMoment.year(), month: appointmentMoment.month(), day: appointmentMoment.date()};
        this.store.dispatch(updateAppointment(appointment, day));
    }
}