import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

// Local
import { Dsi } from './dsi';
import { DsiApi } from './dsi.api';
import { DsiConfig } from './dsi.config';
import { TableSchema } from './support/schema';

export type DsiFormGroupFactory = (id: Observable<string>, config: DsiConfig) => DsiFormGroup<any, any>;

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
		protected _idObservable: Observable<string>
	) {
		this._createFromGroup(this._config.schema);

		this._idObservable.subscribe((id: string) => {
			this._id = id;
			this._read({id});
		});
	}

	public get formGroup(): FormGroup {
		return this._formGroup;
	}

	public get id(): string {
		return this._config.id;
	}

	public create(doc: D): Observable<string> {
		return this._dsi.create(doc);
	}

	public delete(): Observable<number> {
		if (this._id)
			return this._dsi.delete(this._id);

		return Observable.of(0);
	}

	public stop(): void {
		for (let id in this._subscriptions) {
			if (this._subscriptions[id])
				this._subscriptions[id].unsubscribe();
			this._subscriptions[id] = null;
		}
	}

	public update(doc: D): Observable<number> {
		if (this._id)
			return this._dsi.update(this._id, doc);
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

	protected _read(request?: DsiApi.RequestOne, reactive: boolean = false): DsiFormGroup<D, C> {
		let
		result: Observable<DsiApi.Response> = this._dsi.readOne(request);

		if (this._subscriptions.dsi)
			this._subscriptions.dsi.unsubscribe();

		if (!reactive)
			result = result.first();

		this._subscriptions.dsi = result.subscribe((response: DsiApi.Response) => {
			this._formGroup.patchValue(response.data, {emitEvent: false});
		});

		return this;
	}

}
