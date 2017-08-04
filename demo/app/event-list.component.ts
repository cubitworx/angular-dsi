import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { DsiDataset, DsiDatasetFactory, DsiFilter, DsiFormGroup, DsiFormGroupFactory } from '../../src';

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
	protected _newEvent: DsiFormGroup<EventInterface, AppDsiConfig>;
	protected _statuses: DsiDataset<EventInterface, AppDsiConfig>;

	constructor(
		@Inject(DsiDatasetFactory) protected _dsiDatasetFactory: DsiDatasetFactory,
		@Inject(DsiFormGroupFactory) protected _dsiFormGroupFactory: DsiFormGroupFactory,
		protected _dsiFilter: DsiFilter
	) { }

	public ngOnDestroy(): void {
		this._dsiFilter.stop(EventDsiConfig.id);
		this._statuses.stop();
		this._events.stop();
	}

	public ngOnInit(): void {
		this._newEvent = this._dsiFormGroupFactory(EventDsiConfig);
		this._events = this._dsiDatasetFactory(EventDsiConfig).read();
		this._statuses = this._dsiDatasetFactory(StatusDsiConfig).read();
		this._filter = this._dsiFilter.dsi(EventDsiConfig.id, this._events);
	}

}
