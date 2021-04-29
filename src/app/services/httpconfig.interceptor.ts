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
    constructor(private dialog: MatDialog) {
        HttpConfigInterceptor.globalDialog = this.dialog;
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('accessToken');
        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    return event;
                }
            })).pipe(catchError(this.handleError));
    }
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            if (HttpConfigInterceptor.error) {

            }else{
                const dialogRef = HttpConfigInterceptor.globalDialog.open(ErrorPopUpComponent, {
                    disableClose: true,
                    width: '500px',
                    height: '225px',
                    data: { status: error.status }
                });
                HttpConfigInterceptor.error="error";
            }


        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Something bad happened; please try again later.');
    }



}