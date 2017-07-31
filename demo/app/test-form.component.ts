import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Schema2NgForms } from '../../modules/js-schema';
import { Observable, Subscription } from 'rxjs';

// App
import { DBI, Dbi, DbiService } from '../../lib/dbi';
import { JobInterface, JobSchema } from '../../lib/model';
import { ValuelistInterface } from '../../lib/model';

@Component({
	selector: 'test-form',
	templateUrl: './test-form.component.html'
})
export class TestFormComponent implements OnInit {

	protected _contractTypesValuelist: Observable<ValuelistInterface[]>;
	protected _countriesValuelist: Observable<ValuelistInterface[]>;
	protected _jobDbi: Dbi<JobInterface>;
	protected _jobFormGroup: FormGroup;
	protected _jobId: string;
	protected _subscriptions: {
		params?: Subscription
	} = {};

	constructor(
		protected _activatedRoute: ActivatedRoute,
		protected _dsi: DbiService,
		protected _formBuilder: FormBuilder
	) {
		this._dsi.form =
		this._jobFormGroup = Schema2NgForms( JobSchema, this._formBuilder, {} );
	}

	public ngOnInit(): void {
		this._dsi
			.instance(testDsiOptions)
			.instance(valuelist1DsiOptions)
			.instance(valuelist2DsiOptions)
			.start();




		this._jobDbi = this._dsi.instance<JobInterface>(DBI.job);
		this._subscriptions.params = this._activatedRoute.params
			.subscribe((params: {[name: string]: string}) => {
				// Job
				this._jobId = params['id'];
				this._jobDbi.readOne({id: params['id']}).first().subscribe((job: JobInterface) => {
					this._jobFormGroup.patchValue( job, {emitEvent: false} );
				});
			});
	}

	private _save() {
		this._jobDbi.update( this._jobId, this._jobFormGroup.value );
	}

}
