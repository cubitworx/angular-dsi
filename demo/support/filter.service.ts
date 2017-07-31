import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

import { Dsi } from '../../src';

@Injectable()
export class DsiFilter {

  protected _subscriptions: {
		filter?: Subscription
	} = {};

	public start(dsi: Dsi<any, any>): Subject<Event> {
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

	public stop(): void {
		for( let name in this._subscriptions ) {
			if( this._subscriptions[name] )
				this._subscriptions[name].unsubscribe();
			this._subscriptions[name] = null;
		}
	}

}
