import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NotificationsService } from 'angular2-notifications';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { HttpRestService, RestApi } from '../../../src';

@Injectable()
export class AppHttpRestService extends HttpRestService {

	protected _errors: any[] = [];

	public constructor(
		http: Http,
		protected _notificationsService: NotificationsService
	) {
		super(http);
	}

	protected _handleError(response: Response|any): ErrorObservable {
		let errorObservable: ErrorObservable = super._handleError(response);

		errorObservable.subscribe((error: RestApi.ResponseError) => {
			this._errors.length = 0;

			if (error.id === 'authentication-error') {
				this._notificationsService.error('Permission denied', 'You do not have permission to perform this action');
			} else if (error.id === 'session-expired') {
				this._notificationsService.error('Session expired', 'Your session has expired. Please log in again to continue', {timeOut: 0});
			} else if (error.id === 'validation-error') {
				for (let i in error.data) {
					for (let message of error.data[i])
						this._errors.push(message);
				}
			} else {
				// TODO: send error to admin
				this._notificationsService.error('Unexpected error', 'An unexpected error has occurred');
			}
		});

		return errorObservable;
	}

}
