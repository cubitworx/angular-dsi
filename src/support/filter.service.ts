import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import * as _ from 'lodash';

import { DsiDataset } from '../../src';

@Injectable()
export class DsiFilter {

	protected _filters: {[id: string]: Subject<Event>} = {};
	protected _subscriptions: {
		filter?: Subscription
	} = {};

	public next(id: string, event: Event): void {
		if (this._filters[id])
			this._filters[id].next(event);
	}

	public dsi(id: string, dsi: DsiDataset<any, any>): Subject<any> {
		if (!this._filters[id]) {
			this._filters[id] = new Subject<Event>();

			this._subscriptions.filter = this._filters[id]
				.map((event: Event) => (<HTMLInputElement>event.target).value)
				.debounceTime(600)
				.distinctUntilChanged()
				.subscribe((value: string) => {
					dsi.read({filter: value});
				});
		}

		return this._filters[id];
	}

	public stop(ids: string|string[]): void {
		ids = _.isArray(ids) ? ids : [ids];
		for (let id in ids) {
			if (this._subscriptions[id])
				this._subscriptions[id].unsubscribe();
			this._subscriptions[id] = null;
		}
	}

}
