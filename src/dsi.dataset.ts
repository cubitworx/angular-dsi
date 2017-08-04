import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';

// Local
import { Dsi, DsiFactory } from './dsi';
import { DsiApi } from './dsi.api';
import { DsiConfig } from './dsi.config';
import { TableSchema } from './support/schema';

export type DsiDatasetFactory = (config: DsiConfig) => DsiDataset<any, any>;

export function DsiDatasetFactory(
	dsiFactory: DsiFactory
) {
	const instances: {[id: string]: DsiDataset<any, any>} = {};

	return (config: DsiConfig): DsiDataset<any, any> => {
		if (!instances[config.id])
			instances[config.id] = new DsiDataset(config, dsiFactory(config));
		return instances[config.id];
	};
}

@Injectable()
export class DsiDataset<D, C extends DsiConfig> {

	protected _request: DsiApi.Request = {};
	protected _dataset: D[] = [];
	protected _datasetBehaviorSubject: BehaviorSubject<D[]> = new BehaviorSubject([]);
	protected _iteration: number = 0;
	protected _stale: boolean = true;
	protected _subscriptions: {
		dsi?: Subscription
	} = {};

	public constructor(
		protected _config: C,
		protected _dsi: Dsi<D, C>
	) { }

	public get asArray(): D[] {
		if (this._stale)
			this._refreshDataset();

		return this._dataset;
	}

	public get asObservable(): Observable<D[]> {
		return this._datasetBehaviorSubject.asObservable();
	}

	public get id(): string {
		return this._config.id;
	}

	public get schema(): TableSchema {
		return this._config.schema;
	}

	public create(doc: D): Observable<string> {
		return this._dsi.create(doc);
	}

	public delete(id: string): Observable<number> {
		return this._dsi.delete(id);
	}

	public read(request?: DsiApi.Request): DsiDataset<D, C> {
		request = _.merge(this._request, request || {});

		if (this._subscriptions.dsi)
			this._subscriptions.dsi.unsubscribe();

		this._subscriptions.dsi = this._dsi.read(request).subscribe((response: DsiApi.Response) => {
			this._datasetBehaviorSubject.next(response.data);
			// Only refresh dataset if it has been accessed
			if (this._iteration)
				this._refreshDataset();
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

	protected _refreshDataset(): void {
		this._stale = false;
		this._datasetBehaviorSubject.forEach((data: D[]) => {
			console.log(data);
			let iteration = ++this._iteration;
			this._dataset.length = 0;
			for (let doc of data) {
				if (iteration !== this._iteration)
					break;
				this._dataset.push( doc );
			}
		});
	}

}
