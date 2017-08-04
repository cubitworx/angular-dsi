import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { DsiDataset, DsiDatasetFactory, DsiFormGroup, DsiFormGroupFactory } from '../../src';

// Local
import { EventDsiConfig, StatusDsiConfig } from '../dsi';
import { AppDsiConfig } from '../lib/dsi/app.dsi.config';
import { EventInterface } from '../model';

@Component({
	selector: 'event-form',
	templateUrl: './event-form.component.html'
})
export class EventFormComponent implements OnDestroy, OnInit {

	protected _event: DsiFormGroup<EventInterface, AppDsiConfig>;
	protected _statuses: DsiDataset<EventInterface, AppDsiConfig>;

	constructor(
		protected _activatedRoute: ActivatedRoute,
		@Inject(DsiDatasetFactory) protected _dsiDatasetFactory: DsiDatasetFactory,
		@Inject(DsiFormGroupFactory) protected _dsiFormGroupFactory: DsiFormGroupFactory
	) { }

	public ngOnDestroy(): void {
		this._statuses.stop();
		this._event.stop();
	}

	public ngOnInit(): void {
		this._event = this._dsiFormGroupFactory(EventDsiConfig, this._activatedRoute.params.map(params => params.id));
		this._statuses = this._dsiDatasetFactory(StatusDsiConfig).read();
	}

}
