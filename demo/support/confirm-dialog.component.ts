import { Component, Input } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

// Local
import { ModalButton } from './modal';

export interface ConfirmModel {
	message: string;
	buttons?: ModalButton[];
	title: string;
}

@Component({
	selector: 'confirm-dialog',
	templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {

	public buttons: ModalButton[] = [
		{text: 'OK', class: 'btn btn-primary', result: true},
		{text: 'Cancel', result: false}
	];
	public message: string;
	public title: string;

	constructor(
		dialogService: DialogService
	) {
		super(dialogService);
	}

	public confirm(result: boolean): void {
		this.result = result;
		this.close();
	}

}
