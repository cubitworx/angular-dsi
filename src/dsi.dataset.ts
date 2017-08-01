import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

// Local
import { Dsi } from './dsi';
import { DsiApi } from './dsi.api';
import { DsiConfig } from './dsi.config';
import { DsiInterface } from './dsi.interface';
import { TableSchema } from './support/schema';

@Injectable()
export class DsiDataset<T> implements DsiInterface<T> {

	protected _dataset: T[] = [];
	protected _subscriptions: {
		dsi?: Subscription
	} = {};

	public constructor(
		protected _config: DsiConfig,
		protected _dsi: Dsi<T>,
		protected _ngZone: NgZone
	) { }

	public get dataset(): T[] {
		return this._dataset;
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

	public read(resource: string, request?: DsiApi.Request, reactive: boolean = false): DsiDataset<T> {
		let result = this._dsi.readOne(resource, request, reactive);

		if( this._subscriptions.dsi )
			this._subscriptions.dsi.unsubscribe();

		if (!reactive)
			result = result.first();

		this._subscriptions.dsi = result.subscribe((result: DsiApi.Response) => {
			this._ngZone.run(() => {
				this._dataset.length = 0;
				for( let record of result.data )
					this._dataset.push( record );
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

}
