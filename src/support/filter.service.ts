import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

import { Dsi, DsiRegistry } from '../../src';

@Injectable()
export class DsiFilter {

  protected _filters: {[id: string]: Subject<Event>} = {};
  protected _subscriptions: {
		filter?: Subscription
	} = {};

	constructor(
    protected _dsiRegistry: DsiRegistry
	) { }

	public next(id: string, event: Event): void {
		if (this._filters[id])
			this._filters[id].next(event);
	}

	public add(dsi: Dsi<any, any>): Subject<Event> {
		new Subject<Event>();
		let searchSubject = new Subject<Event>();

		this._subscriptions.filter = searchSubject
			.map((event: Event) => (<HTMLInputElement>event.target).value)
			.debounceTime(600)
			.distinctUntilChanged()
			.subscribe((value: string) => {
				dsi.read({filter: value});
			});

		return searchSubject;
	}

	public remove(id?: string): void {
		if (id) {
			if( this._subscriptions[id] )
				this._subscriptions[id].unsubscribe();
			this._subscriptions[id] = null;
		} else {
			for( let id in this._subscriptions ) {
				if( this._subscriptions[id] )
					this._subscriptions[id].unsubscribe();
				this._subscriptions[id] = null;
			}
		}
	}

}
