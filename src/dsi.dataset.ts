import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';

// Local
import { Dsi } from './dsi';
import { DsiApi } from './dsi.api';
import { DsiConfig } from './dsi.config';
import { TableSchema } from './support/schema';

export type DsiDatasetFactory = (config: DsiConfig) => DsiDataset<any, any>;

@Injectable()
export class DsiDataset<D, C extends DsiConfig> {

	protected _request: DsiApi.Request = {};
	protected _dataset: D[] = [];
	protected _subscriptions: {
		dsi?: Subscription
	} = {};

	public constructor(
		protected _config: C,
		protected _dsi: Dsi<D, C>
	) { }

	public get dataset(): D[] {
		return this._dataset;
	}

	public get id(): string {
		return this._config.id;
	}

	public create(doc: D): Observable<string> {
		return this._dsi.create(doc);
	}

	public delete(id: string): Observable<number> {
		return this._dsi.delete(id);
	}

	public read(request?: DsiApi.Request, reactive: boolean = false): DsiDataset<D, C> {
		request = _.merge(this._request, request || {});

		let result = this._dsi.readOne(request);

		if (this._subscriptions.dsi)
			this._subscriptions.dsi.unsubscribe();

		if (!reactive)
			result = result.first();

		this._subscriptions.dsi = result.subscribe((response: DsiApi.Response) => {
			this._dataset.length = 0;
			for (let record of response.data)
				this._dataset.push( record );
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

	public update(id: string, doc: D): Observable<number> {
		return this._dsi.update(id, doc);
	}

}
