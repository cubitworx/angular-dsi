import { NgZone } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'ng2-bootstrap-modal';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

import { Dsi, DsiConfig, DsiDriver, TableSchema } from '../../../src';

// Local
import { ConfirmDialogComponent } from '../../support/confirm-dialog.component';
import { ModalOptions } from '../../support/modal.interface';
import { NotificationOptions } from '../../support/notification.interface';
import { AppDsiConfig } from './app.dsi.config';

// export interface PaginationOptions {
// 	currentPage?: number,
// 	pageSize?: number,
// 	paginationId?: string,
// 	totalItems?: number
// }

export class AppDsi<T> extends Dsi<T> {

	public constructor(
		protected _dialogService: DialogService,
		dsiDriver: DsiDriver<T>,
		ngZone: NgZone,
		protected _notificationsService: NotificationsService
	) {
		super(dsiDriver, ngZone);
	}

	public create(resource: string, doc: T): Observable<string> {
		let createObservable: Observable<string> = super.create(resource, doc);

		createObservable.first().subscribe((id: string) => {
			let createSuccess: NotificationOptions = this._config.createSuccess || {
				title: 'Success',
				message: 'Record has been created'
			};
			this._notificationsService.success(createSuccess.title, createSuccess.message);
		}, (error: any) => {
			console.error('Could not create record', error);
		});

		return createObservable;
	}

	public delete(resource: string, id: string): Observable<number> {
		let
		deleteSubject: Subject<number> = new Subject(),
		deleteConfirm: ModalOptions = this._config.deleteConfirm || {
				title: 'Delete record',
				message: 'Are you sure you would like to delete this record?'
		},
		deleteSuccess: NotificationOptions = this._config.createSuccess || {
			title: 'Success',
			message: 'Record has been deleted'
		};

		this._dialogService.addDialog(ConfirmDialogComponent, {
			title: deleteConfirm.title,
			message: deleteConfirm.message,
			buttons: [
				{text: 'DELETE', class: 'btn btn-danger', result: true},
				{text: 'Cancel', result: false}
			]
		}).first().subscribe((choice: boolean) => {

			if (!choice) {
				deleteSubject.next( 0 );
				return;
			}

			let result = super.delete(resource, id);
			result.first().subscribe(() => {
				this._notificationsService.success(deleteSuccess.title, deleteSuccess.message);
			}, (error: any) => {
				console.error('Could not delete record', error);
			});

			result.subscribe(deleteSubject);

		});

		return deleteSubject.asObservable();
	}

	public update(resource: string, id: string, doc: T): Observable<T> {
		let updateObservable: Observable<T> = super.update(resource, id, doc);

		updateObservable.first().subscribe((result: T) => {
			let updateSuccess: NotificationOptions = this._config.updateSuccess || {
				title: 'Success',
				message: 'Record has been updated'
			};
			this._notificationsService.success(updateSuccess.title, updateSuccess.message);
		}, (error: any) => {
			console.error('Could not update record', error);
		});

		return updateObservable;
	}

}
