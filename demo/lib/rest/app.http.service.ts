import { NgZone } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'ng2-bootstrap-modal';
import { Observable, Subject } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { HttpRestService, RestApi } from '../../src';

export class AppHttpRestService extends HttpRestService {

	protected _errors: any[] = [];

	public constructor(
		protected _logger: LoggerService,
		restHttpService: RestHttpService,
		protected _notificationsService: NotificationsService
	) {
		super(restHttpService);
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
				for(let i in error.data) {
					for(let message of error.data[i])
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
