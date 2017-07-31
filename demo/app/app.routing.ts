import { ModuleWithProviders, Type }      from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Local
import { TestListComponent } from './test-list.component';
import { TestFormComponent } from './test-form.component';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: 'test/list', pathMatch: 'full' },

	{ path: 'test/list', component: TestListComponent },
	{ path: 'test/:id', component: TestFormComponent }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot( APP_ROUTES );
