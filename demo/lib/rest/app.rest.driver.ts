import { Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AngularRest } from '../../src';

// Local
import { RestInterface } from './rest.interface';

export abstract class AppAngularRest extends AngularRest {

  protected _errors: string[] = [];
	protected _pagination: Pagination;

	public constructor(
		http: Http,
		protected _notificationsService: NotificationsService,
    protected _paginationService: PaginationService
	) {
		super(http);
	}

	public get errors(): string[] {
		return this._errors.length ? this._errors : null;
	}

	protected _handleError(error: Response|any): ErrorObservable {
		this._errors.length = 0;

		// In a real world app, you might use a remote logging infrastructure
		let errMsg: any;
		if (error instanceof Response) {
			try {
				errMsg = error.json() || '';
			} catch(e) {
				this._notificationsService.error('Unexpected error', 'An unexpected error has occurred');
				errMsg = e;
			}
			errMsg.status = error.status;
			errMsg.statusText = error.statusText || '';

			if (errMsg.id === 'authentication-error') {
				this._notificationsService.error('Permission denied', 'You do not have permission to perform this action');
			} else if (errMsg.id === 'session-expired') {
				this._notificationsService.error('Session expired', 'Your session has expired. Please log in again to continue', {timeOut: 0});
			} else if (errMsg.id === 'validation-error') {
				for(let i in errMsg.data) {
					for(let message of errMsg.data[i])
						this._errors.push(message);
				}
			} else {
				// TODO: send error to admin
				this._notificationsService.error('Unexpected error', 'An unexpected error has occurred');
			}
		} else {
			// TODO: send error to admin
			this._notificationsService.error('Unexpected error', 'An unexpected error has occurred');
			errMsg = error.message ? error.message : error.toString();
		}

		return Observable.throw( errMsg );
	}

	protected _handleResponse(response: Response): any {
		let body: any = response.json();

		this._errors.length = 0;

		if( body ) {
			if( body.pagination && this._pagination )
				this._pagination.setTotalItems( body.pagination.total );

			return body.data;
		}

		return null;
	}

	public pagination(pagination: PaginationOptions): void {
		this._pagination = this._paginationService.instance(pagination);
	}

}
