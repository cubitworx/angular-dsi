import { NgZone } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'ng2-bootstrap-modal';
import { Observable, Subject } from 'rxjs';

import { Dsi, DsiDriver, Doc } from '../../../src';

// Local
import { AppDsiOptions } from '../../support/app.dsi.interface';
import { ConfirmDialogComponent } from '../../support/confirm-dialog.component';

// export interface PaginationOptions {
// 	currentPage?: number,
// 	pageSize?: number,
// 	paginationId?: string,
// 	totalItems?: number
// }

export class AppDsi<T extends Doc> extends Dsi<AppDsiOptions, T> {

	protected _options: AppDsiOptions = {
		createSuccess: {
			title: 'Success',
			message: 'Record has been deleted'
		},
		deleteConfirm: {
			title: 'Delete record',
			message: 'Are you sure you would like to delete this record?'
		},
		deleteSuccess: {
			title: 'Success',
			message: 'Record has been deleted'
		},
		id: undefined,
		updateSuccess: {
			title: 'Success',
			message: 'Record has been updated'
		}
	};

	public constructor(
		protected _dialogService: DialogService,
		dsiDriver: DsiDriver<T>,
		ngZone: NgZone,
		protected _notificationsService: NotificationsService,
		options: AppDsiOptions
	) {
		super(dsiDriver, ngZone, options);
	}

	public create(doc: T): Observable<string> {
		let createObservable: Observable<string> = super.create( doc );

		createObservable.first().subscribe((id: string) => {
			this._notificationsService.success(this._options.createSuccess.title, this._options.createSuccess.message);
		}, (error: any) => {
			console.error('Could not create record', error);
		});

		return createObservable;
	}

	public delete(id: string): Observable<number> {
		let deleteSubject: Subject<number> = new Subject();

		this._dialogService.addDialog(ConfirmDialogComponent, {
			title: this._options.deleteConfirm.title,
			message: this._options.deleteConfirm.message,
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
				this._notificationsService.success(this._options.deleteSuccess.title, this._options.deleteSuccess.message);
			}, (error: any) => {
				console.error('Could not delete record', error);
			});

			result.subscribe(deleteSubject);

		});

		return deleteSubject.asObservable();
	}

	public update(id: string, doc: T): Observable<T> {
		let updateObservable: Observable<T> = super.update( id, doc );

		updateObservable.first().subscribe((result: T) => {
			this._notificationsService.success(this._options.updateSuccess.title, this._options.updateSuccess.message);
		}, (error: any) => {
			console.error('Could not update record', error);
		});

		return updateObservable;
	}

}
