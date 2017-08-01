import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { DsiDataset, DsiDatasetFactory, DsiFilter, DsiRegistry } from '../../src';

// Local
import { EventDsiConfig, StatusDsiConfig } from '../dsi';
import { EventInterface } from '../model';

@Component({
	selector: 'list-component',
	styleUrls: ['./list.component.scss'],
	templateUrl: './list.component.html'
})
export class EventListComponent implements OnDestroy, OnInit {

	protected _events: DsiDataset<EventInterface>;

	constructor(
    protected _dsiDatasetFactory: DsiDatasetFactory,
    protected _dsiRegistry: DsiRegistry,
    protected _dsiFilter: DsiFilter
	) { }

	public ngOnDestroy(): void {
		this._dsiFilter.remove(EventDsiConfig.id);
		this._dsiRegistry.remove(EventDsiConfig.id);
	}

	public ngOnInit(): void {
		this._dsiRegistry.add( this._dsiDatasetFactory(EventDsiConfig) );
		this._dsiFilter.add( this._dsiRegistry.get(EventDsiConfig.id) );
	}

}
