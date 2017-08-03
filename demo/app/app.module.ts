import { NgModule, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { NotificationsService } from 'angular2-notifications';
import { BootstrapModalModule, DialogService } from 'ng2-bootstrap-modal';

import { Dsi, DsiDataset, DsiDriver, DsiFilter, DsiFormGroup, HttpRestService } from '../../src';

// Local
import { AppDsi, AppDsiFactory } from '../lib/dsi/app.dsi';
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
		BrowserModule
	],
	providers: [
		{ provide: Dsi, useFactory: AppDsiFactory, deps: [DialogService, DsiDriver, NgZone, NotificationsService] },
		{ provide: DsiDataset, useFactory: AppDsiDatasetFactory, deps: [AppDsi, NgZone] },
		{ provide: DsiFormGroup, useFactory: AppDsiFormGroupFactory, deps: [AppDsi, FormBuilder, NgZone] },
		{ provide: HttpRestService, useClass: AppHttpRestService },
		DialogService,
		DsiFilter
	]
})
export class AppModule { }
