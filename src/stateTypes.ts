import {ViewMode, MonthOfYear} from "./enums";
import * as _ from "lodash";
export interface State {
    data: DataState;
    application: ApplicationState;
}
export interface DataState {
    monthOverviews: Array<MonthOverview>;
}
export interface ApplicationState {
    viewMode: ViewMode;
    selectedDay: Day;
    selectedWeek: Week;
    selectedMonth: Month;
}

export class MonthOverview {
    constructor(public year: number, public month: MonthOfYear, public daysWithAppointments: Array<DayWithAppointments>) {
    }
}
export class WeekOverview {
    constructor(public year: number, public week: number, public daysWithAppointments: Array<DayWithAppointments>) {
    }
}
export class Appointment {
    public id: string = _.uniqueId();

    constructor(public date: Date, public description: string) {
    }
}
export interface Day {
    year: number;
    month: MonthOfYear;
    day: number;
}
export interface Week {
    year: number;
    week: number;
}
export interface Month {
    year: number;
    month: MonthOfYear;
}
export class DayWithAppointments {
    constructor(public day: Day, public appointments: Array<Appointment>) {
    }
}