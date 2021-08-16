import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorPopUpComponent } from 'src/app/modules/home/components/error-pop-up/error-pop-up.component'

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    static globalDialog: any;
    static error: any;
    /**
     * This variable allows whether an error should be thrown or nothing should happen
     */
    private allowThrowError: Boolean;
    constructor(private dialog: MatDialog) {
        HttpConfigInterceptor.globalDialog = this.dialog;
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('accessToken');
        if (request.url.includes('facebook')) {
        } else {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    return event;
                }
            })).pipe(catchError(this.handleError));
    }
    private handleError(error: HttpErrorResponse) {
        /**
         * Wrote this piece of code here because code in seperate function doesn't get executed for some reason
         */

        if (localStorage.getItem("expiry") && localStorage.getItem("refreshToken")) {
            const d = new Date();
            if (new Date(localStorage.getItem("expiry")) < new Date(d.toUTCString())) {
                return;
            }
        }

        if (error.error instanceof ErrorEvent) {
        } else {
            const dialogRef = HttpConfigInterceptor.globalDialog.open(ErrorPopUpComponent, {
                disableClose: true,
                width: "600px",
                data: { data: error }
            });
        }
        return throwError(
            '');
    }


    checkExpiry() {
        if (localStorage.getItem("expiry") && localStorage.getItem("refreshToken")) {
            const d = new Date();
            if (new Date(localStorage.getItem("expiry")) < new Date(d.toUTCString())) {
                this.allowThrowError = true;
            } else {
                this.allowThrowError = false;
            }
        } else {
            this.allowThrowError = false;
        }
    }

}