import { Injectable, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

// Local
import { Dsi } from './dsi';
import { DsiApi } from './dsi.api';
import { DsiConfig } from './dsi.config';
import { DsiInterface } from './dsi.interface';
import { TableSchema } from './support/schema';

@Injectable()
export class DsiFormGroup<T> implements DsiInterface<T> {

	protected _formGroup: FormGroup;
	protected _subscriptions: {
		dsi?: Subscription
	} = {};

	public constructor(
		protected _config: DsiConfig,
		protected _dsi: Dsi<T>,
		protected _formBuilder: FormBuilder,
		protected _id: Observable<string>,
		protected _ngZone: NgZone
	) {
		this._createFromGroup(this._config.schema);

		this._id.subscribe();
	}

	public get formGroup(): FormGroup {
		return this._formGroup;
	}

	public get id(): string {
		return this._config.id;
	}

	public create(doc: T): Observable<string> {
		return this._dsi.create(this._config.resource, doc);
	}

	public delete(id: string): Observable<number> {
		return this._dsi.delete(this._config.resource, id);
	}

	public read(reactive: boolean = false): DsiFormGroup<T> {
		let
		result: Observable<DsiApi.Response> = this._dsi.readOne(this._config.resource, {id: this._id}, reactive);

		if( this._subscriptions.dsi )
			this._subscriptions.dsi.unsubscribe();

		if (!reactive)
			result = result.first();

		this._subscriptions.dsi = result.subscribe((response: DsiApi.Response) => {
			this._ngZone.run(() => {
				this._formGroup.patchValue(response.data, {emitEvent: false});
			});
		});

		return this;
	}

	public stop(): void {
		for (let id in this._subscriptions) {
			if (this._subscriptions[id])
				this._subscriptions[id].unsubscribe();
			this._subscriptions[id] = null;
		}
	}

	public update(id: string, doc: T): Observable<T> {
		return this._dsi.update(this._config.resource, id, doc);
	}

	protected _createFromGroup(schema: TableSchema, doc: any = {}): FormGroup {
		let controlsConfig: {[key: string]: any} = {};

		for( let field in schema ) {

			if( this._isSubDocument( schema[field].dataType ) ) {
				controlsConfig[field] = this._createFromGroup( schema[field].dataType, doc[field] );
			} else {

				controlsConfig[field] = [ doc[field] ];
				if( schema[field].validators ) {
					for( let validator in schema[field].validators ) {
						switch( validator ) {
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
		for( let key in obj ) {
			if( obj.hasOwnProperty( key ) )
				return !!obj[key].dataType;
		}
		return false;
	}

}
