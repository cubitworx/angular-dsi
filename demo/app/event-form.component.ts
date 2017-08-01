import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { DsiDatasetFactory, DsiFormGroup, DsiFormGroupFactory, DsiRegistry } from '../../src';

// Local
import { EventDsiConfig, StatusDsiConfig } from '../dsi';
import { EventInterface } from '../model';

@Component({
	selector: 'event-form',
	templateUrl: './event-form.component.html'
})
export class EventFormComponent implements OnDestroy, OnInit {

	protected _event: DsiFormGroup<EventInterface>;

	constructor(
		protected _activatedRoute: ActivatedRoute,
    protected _dsiDatasetFactory: DsiDatasetFactory,
    protected _dsiFormGroupFactory: DsiFormGroupFactory,
    protected _dsiRegistry: DsiRegistry
	) { }

	public ngOnDestroy(): void {
		this._dsiRegistry.remove([EventDsiConfig.id, StatusDsiConfig.id]);
	}

	public ngOnInit(): void {
		this._dsiRegistry
			.add( this._dsiFormGroupFactory(this._activatedRoute.params.map(params => params.id), EventDsiConfig) )
			.add( this._dsiDatasetFactory(StatusDsiConfig) );
	}

}
