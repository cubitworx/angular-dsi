import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { BootstrapModalModule, DialogService } from 'ng2-bootstrap-modal';

import { Dsi, DsiModule, HttpRestService } from '../../src';

// Local
import { AppDsi } from '../lib/dsi/app.dsi';
import { AppHttpRestService } from '../lib/rest/app.http.service';
import { ConfirmDialogComponent } from '../support/confirm-dialog.component';
import { AppComponent } from './app.component';
import { TestListComponent } from './test-list.component';
import { TestFormComponent } from './test-form.component';
import { appRouting } from './app.routing';

@NgModule({
	bootstrap: [ AppComponent ],
	declarations: [
		AppComponent,
		ConfirmDialogComponent,
		TestListComponent,
		TestFormComponent
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
		{ provide: AppHttpRestService, useValue: HttpRestService },
		{ provide: AppDsi, useValue: Dsi },
		DialogService
	]
})
export class AppModule { }
