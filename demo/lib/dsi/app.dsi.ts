import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'ng2-bootstrap-modal';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

import { Dsi, DsiConfig, DsiDriver, DsiFactory, TableSchema } from '../../../src';

// Local
import { ConfirmDialogComponent } from '../../support/confirm-dialog.component';
import { ModalOptions } from '../../support/modal';
import { NotificationOptions } from '../../support/notification';
import { AppDsiConfig } from './app.dsi.config';

// export interface PaginationOptions {
// 	currentPage?: number,
// 	pageSize?: number,
// 	paginationId?: string,
// 	totalItems?: number
// }

const instances: {[id: string]: Dsi<any, any>} = {};

export function AppDsiFactory(
	dialogService: DialogService,
	dsiDriver: DsiDriver<any>,
	notificationsService: NotificationsService
): DsiFactory {
	return (config: DsiConfig): Dsi<any, any> => {
		if (!instances[config.id])
			instances[config.id] = new AppDsi(config, dialogService, dsiDriver, notificationsService);
		return instances[config.id];
	};
}

Injectable()
export class AppDsi<D, C extends AppDsiConfig> extends Dsi<D, C> {

	public constructor(
		config: C,
		protected _dialogService: DialogService,
		dsiDriver: DsiDriver<D>,
		protected _notificationsService: NotificationsService
	) {
		super(config, dsiDriver);
	}

	public create(doc: D): Observable<string> {
		let createObservable: Observable<string> = super.create(doc);

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

	public delete(id: string): Observable<number> {
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

			let result = super.delete(id);
			result.first().subscribe(() => {
				this._notificationsService.success(deleteSuccess.title, deleteSuccess.message);
			}, (error: any) => {
				console.error('Could not delete record', error);
			});

			result.subscribe(deleteSubject);

		});

		return deleteSubject.asObservable();
	}

	public update(id: string, doc: D): Observable<number> {
		let updateObservable: Observable<number> = super.update(id, doc);

		updateObservable.first().subscribe((result: number) => {
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
