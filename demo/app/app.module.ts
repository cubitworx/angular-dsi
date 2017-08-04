import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { NotificationsService } from 'angular2-notifications';
import { BootstrapModalModule, DialogService } from 'ng2-bootstrap-modal';

import {
	Dsi, DsiFactory, DsiDataset, DsiDatasetFactory, DsiDriver, DsiFilter, DsiFormGroup,
	DsiFormGroupFactory, DsiRestDriver, HttpRestService
} from '../../src';

// Local
import { AppDsi, AppDsiFactory } from '../lib/dsi/app.dsi';
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
		FormsModule,
		HttpModule,
		ReactiveFormsModule
	],
	providers: [
		{ provide: DsiFactory, useFactory: AppDsiFactory, deps: [DialogService, DsiRestDriver, NotificationsService] },
		{ provide: DsiDatasetFactory, useFactory: DsiDatasetFactory, deps: [DsiFactory] },
		{ provide: DsiFormGroupFactory, useFactory: DsiFormGroupFactory, deps: [DsiFactory, FormBuilder] },
		{ provide: HttpRestService, useClass: AppHttpRestService },
		DialogService,
		DsiFilter,
		DsiRestDriver,
		NotificationsService
	]
})
export class AppModule { }
