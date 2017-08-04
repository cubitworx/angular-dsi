import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

// Local
import { Dsi, DsiFactory } from './dsi';
import { DsiApi } from './dsi.api';
import { DsiConfig } from './dsi.config';
import { TableSchema } from './support/schema';

export type DsiFormGroupFactory = (config: DsiConfig, id?: Observable<string>) => DsiFormGroup<any, any>;

export function DsiFormGroupFactory(
	dsiFactory: DsiFactory,
	formBuilder: FormBuilder
): DsiFormGroupFactory {
	const instances: {[id: string]: DsiFormGroup<any, any>} = {};

	return (config: DsiConfig, id?: Observable<string>): DsiFormGroup<any, any> => {
		if (!instances[config.id])
			instances[config.id] = new DsiFormGroup(config, dsiFactory(config), formBuilder, id);
		return instances[config.id];
	};
}

@Injectable()
export class DsiFormGroup<D, C extends DsiConfig> {

	protected _formGroup: FormGroup;
	protected _id: string;
	protected _subscriptions: {
		dsi?: Subscription
	} = {};

	public constructor(
		protected _config: C,
		protected _dsi: Dsi<D, C>,
		protected _formBuilder: FormBuilder,
		protected _idObservable?: Observable<string>
	) {
		this._formGroup = this._createFromGroup(this._config.schema);

		if (this._idObservable) {
			this._idObservable.subscribe((id: string) => {
				this._read({id});
			});
		}
	}

	public get errors(): string[] {
		return this._dsi.errors;
	}

	public get formGroup(): FormGroup {
		return this._formGroup;
	}

	public get id(): string {
		return this._config.id;
	}

	public create(): Observable<string> {
		this._idObservable = this._dsi.create(this._formGroup.value);
		this._idObservable.map((id: string) => {
			this._id = id;
		});

		return this._idObservable;
	}

	public delete(): Observable<number> {
		if (this._id)
			return this._dsi.delete(this._id);

		return Observable.of(0);
	}

	public save(): Observable<string|number> {
		if (this._id)
			return this.update();
		else
			return this.create();
	}

	public stop(): void {
		for (let id in this._subscriptions) {
			if (this._subscriptions[id])
				this._subscriptions[id].unsubscribe();
			this._subscriptions[id] = null;
		}
	}

	public update(): Observable<number> {
		if (this._id)
			return this._dsi.update(this._id, this._formGroup.value);
		return Observable.of(0);
	}

	protected _createFromGroup(schema: TableSchema, doc: any = {}): FormGroup {
		let controlsConfig: {[key: string]: any} = {};

		for (let field in schema) {

			if (this._isSubDocument( schema[field].dataType )) {
				controlsConfig[field] = this._createFromGroup( schema[field].dataType, doc[field] );
			} else {

				controlsConfig[field] = [ doc[field] ];
				if (schema[field].validators) {
					for (let validator in schema[field].validators) {
						switch (validator) {
							case 'required': {
								controlsConfig[field].push( Validators.required );
								break;
							}
							default:
								throw 'Validator not yet implemented: ' + validator;
						}
					}
				}

			}

		}

		return this._formBuilder.group( controlsConfig );
	}

	protected _isSubDocument(obj: Object): boolean {
		for (let key in obj) {
			if (obj.hasOwnProperty( key ))
				return !!obj[key].dataType;
		}
		return false;
	}

	protected _read(request?: DsiApi.RequestOne): DsiFormGroup<D, C> {
		if (this._subscriptions.dsi)
			this._subscriptions.dsi.unsubscribe();

		this._subscriptions.dsi = this._dsi.readOne(request).subscribe((response: DsiApi.Response) => {
			this._id = response.data[this._config.primaryKey];
			this._formGroup.patchValue(response.data, {emitEvent: false});
		});

		return this;
	}

}
