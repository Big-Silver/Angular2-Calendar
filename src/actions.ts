import {Action} from "@ngrx/store";
import {Appointment, Day} from "./stateTypes";
import {MonthOfYear, ViewMode} from "./enums";

export const SET_VIEWMODE = "application:SET_VIEWMODE";
export const SET_SELECTEDDAY = "application:SET_SELECTEDDAY";
export const SET_SELECTEDWEEK = "application:SET_SELECTEDWEEK";
export const SET_SELECTEDMONTH = "application:SET_SELECTEDMONTH";

export const ADD_MONTH_OVERVIEW = "data:months:ADD_MONTH_OVERVIEW";
export const SET_APPOINTMENTS_FOR_MONTH = "data:months:SET_APPOINTMENTS_FOR_MONTH";
export const ADD_APPOINTMENT = "data:months:ADD_APPOINTMENT";
export const REMOVE_APPOINTMENT = "data:months:REMOVE_APPOINTMENT";
export const UPDATE_APPOINTMENT = "data:months:UPDATE_APPOINTMENT";

export function addAppointment(appointment: Appointment, day: Day): Action {
    return {
        type: ADD_APPOINTMENT,
        payload: {appointment, day}
    };
}

export function removeAppointment(id: string, day: Day): Action {
    return {
        type: REMOVE_APPOINTMENT,
        payload: {id, day}
    };
}

export function updateAppointment(appointment: Appointment, day: Day): Action {
    return {
        type: UPDATE_APPOINTMENT,
        payload: {appointment, day}
    };
}

export function setViewMode(viewMode: ViewMode): Action {
    return {
        type: SET_VIEWMODE,
        payload: {viewMode}
    };
}
export function setSelectedMonth(month: MonthOfYear, year: number): Action {
    return {
        type: SET_SELECTEDMONTH,
        payload: {month, year}
    };
}

export function setSelectedWeek(week: number, year: number): Action {
    return {
        type: SET_SELECTEDWEEK,
        payload: {week, year}
    };
}

export function setSelectedDay(day: number, month: MonthOfYear, year: number): Action {
    return {
        type: SET_SELECTEDDAY,
        payload: {day, month, year}
    };
}