import {bootstrap} from "@angular/platform-browser-dynamic";
import {HTTP_PROVIDERS} from "@angular/http";
import {ROUTER_PROVIDERS} from "@angular/router-deprecated";
import {LocationStrategy, HashLocationStrategy, APP_BASE_HREF} from "@angular/common";
import {provide} from "@angular/core";
import {provideStore, usePostMiddleware, usePreMiddleware, Middleware} from "@ngrx/store";
import "rxjs/add/operator/do";
import {Application} from "./containers/application.container";
import {store} from "./store";

const actionLog: Middleware = (action: any) => {
    return action.do((val: any) => {
        console.warn("DISPATCHED ACTION: ", val);
    });
};
const stateLog: Middleware = (state: any) => {
    return state.do((val: any) => {
        console.info("NEW STATE: ", val);
    });
};

bootstrap(Application, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(APP_BASE_HREF, {useValue: "/"}),
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    provideStore(store),
    usePreMiddleware(actionLog),
    usePostMiddleware(stateLog)
]);