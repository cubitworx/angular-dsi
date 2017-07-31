import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { Dsi, DsiService } from '../../src';

// Local
import { testDsiOptions } from '../dsi';
import { TestInterface } from '../model/test';
import { DsiFilter } from '../support/filter.service';

@Component({
	providers: [DsiService],
	selector: 'list-component',
	styleUrls: ['./list.component.scss'],
	templateUrl: './list.component.html'
})
export class TestListComponent implements OnDestroy, OnInit {

  protected _filter = new Subject<Event>();

	constructor(
    protected _dsi: DsiService,
    protected _dsiFilter: DsiFilter
	) { }

	public ngOnDestroy(): void {
		this._dsiFilter.stop();
		this._dsi.stop();
	}

	public ngOnInit(): void {
		this._dsi
			.instance(testDsiOptions)
			.start();

		this._filter = this._dsiFilter.start( this._dsi.get(testDsiOptions.id) );
	}

}
