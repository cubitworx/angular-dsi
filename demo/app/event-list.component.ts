import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { DsiDataset, DsiDatasetFactory, DsiFilter } from '../../src';

// Local
import { EventDsiConfig, StatusDsiConfig } from '../dsi';
import { AppDsiConfig } from '../lib/dsi/app.dsi.config';
import { EventInterface } from '../model';

@Component({
	selector: 'event-list',
	templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnDestroy, OnInit {

	protected _events: DsiDataset<EventInterface, AppDsiConfig>;
	protected _filter: Subject<Event>;

	constructor(
		protected _dsiDataset: DsiDatasetFactory,
		protected _dsiFilter: DsiFilter
	) { }

	public ngOnDestroy(): void {
		this._dsiFilter.stop(EventDsiConfig.id);
		this._events.stop();
	}

	public ngOnInit(): void {
		this._events = this._dsiDataset(EventDsiConfig);
		this._filter = this._dsiFilter.dsi(EventDsiConfig.id, this._events);
	}

}
