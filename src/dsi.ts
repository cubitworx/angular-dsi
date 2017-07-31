import { NgZone } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import * as _ from 'lodash';

// Local
import { DsiApi } from './dsi.api';
import { DsiDriver } from './dsi.driver';

export type DsiOptions = {
	id: string;
};

export type Doc = {
	id: string;
	[field: string]: any;
};

export class Dsi<O extends DsiOptions, T extends Doc> {

	protected _options: O;
	protected _subscriptions: {
		dsi?: Subscription
	} = {};

	public constructor(
		protected _dsiDriver: DsiDriver<T>,
		protected _ngZone: NgZone,
		options: O
	) {
		_.defaultsDeep(this._options, options);
	}

	public create(doc: T): Observable<string> {
		return this._dsiDriver.create(doc);
	}

	public delete(id: string): Observable<number> {
		return this._dsiDriver.delete(id);
	}

	public read(request?: DsiApi.Request, reactive: boolean = false): Observable<T[]> {
		let
		resultSubject = new Subject<T[]>(),
		result = this._dsiDriver.read(request, reactive);

		if( this._subscriptions.dsi )
			this._subscriptions.dsi.unsubscribe();

		if (!reactive)
			result = result.first();

		this._subscriptions.dsi = result.subscribe((result: DsiApi.Response) => {
			this._ngZone.run(() => {
				let dataset = [];
				for( let record of result.data )
					dataset.push( record );
				resultSubject.next(dataset);
			});
		});

		return resultSubject.asObservable();
	}

	public readOne(request?: DsiApi.Request, reactive: boolean = false): Observable<T> {
		let
		resultSubject = new Subject<T>(),
		result = this._dsiDriver.readOne(request, reactive);

		if( this._subscriptions.dsi )
			this._subscriptions.dsi.unsubscribe();

		if (!reactive)
			result = result.first();

		this._subscriptions.dsi = result.subscribe((data: T) => {
			this._ngZone.run(() => {
				let doc: T = <T>{};
				for( let key in data )
					doc[key] = data[key];
				resultSubject.next(doc);
			});
		});

		return resultSubject.asObservable();
	}

	public stop() {
		for( let name in this._subscriptions ) {
			if( this._subscriptions[name] )
				this._subscriptions[name].unsubscribe();
			this._subscriptions[name] = null;
		}

		return this;
	}

	public update(id: string, doc: T): Observable<T> {
		let
		resultSubject = new Subject<T>(),
		result = this._dsiDriver.update(id, doc);

		this._subscriptions.dsi = result.first().subscribe((result: DsiApi.Response) => {
			this._ngZone.run(() => {
				resultSubject.next(result.data);
			});
		});

		return resultSubject.asObservable();
	}

}
