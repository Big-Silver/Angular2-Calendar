import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, RouteConfig} from "@angular/router-deprecated";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "toastr/build/toastr.css";
import "font-awesome/css/font-awesome.css";
import {Calendar} from "./calendar.container";
@Component({
    selector: "application",
    directives: [ROUTER_DIRECTIVES, Calendar],
    template: `
        <router-outlet></router-outlet>
    `
})
@RouteConfig([
    {path: "/", name: "Root", redirectTo: ["Calendar"]},
    {path: "/calendar", name: "Calendar", component: Calendar}
])
export class Application {
}