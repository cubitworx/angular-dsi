import { NgModule, NgZone } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { BootstrapModalModule, DialogService } from 'ng2-bootstrap-modal';

import { DsiDataset, DsiDriver, DsiFormGroup, DsiModule, DsiRegistry, HttpRestService } from '../../src';

// Local
import { AppDsi } from '../lib/dsi/app.dsi';
import { AppDsiDatasetFactory } from '../lib/dsi/app.dsi.dataset';
import { AppDsiFormGroupFactory } from '../lib/dsi/app.dsi.formGroup';
import { AppHttpRestService } from '../lib/rest/app.http.service';
import { ConfirmDialogComponent } from '../support/confirm-dialog.component';
import { AppComponent } from './app.component';
import { EventListComponent } from './event-list.component';
import { EventFormComponent } from './event-form.component';
import { appRouting } from './app.routing';

@NgModule({
	bootstrap: [ AppComponent ],
	declarations: [
		AppComponent,
		ConfirmDialogComponent,
		EventListComponent,
		EventFormComponent
	],
	entryComponents: [
		ConfirmDialogComponent
	],
	imports: [
		appRouting,
		BootstrapModalModule,
		BrowserModule,
		DsiModule
	],
	providers: [
		{ provide: HttpRestService, useClass: AppHttpRestService },
		{ provide: DsiDataset, useFactory: AppDsiDatasetFactory, deps: [AppDsi, NgZone] },
		{ provide: DsiFormGroup, useFactory: AppDsiFormGroupFactory, deps: [AppDsi, NgZone] },
		DialogService,
		DsiDataset,
		DsiFormGroup,
		DsiRegistry
	]
})
export class AppModule { }
