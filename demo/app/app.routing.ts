import { ModuleWithProviders, Type }      from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Local
import { EventListComponent } from './event-list.component';
import { EventFormComponent } from './event-form.component';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: 'event/list', pathMatch: 'full' },

	{ path: 'event/list', component: EventListComponent },
	{ path: 'event/:id', component: EventFormComponent }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot( APP_ROUTES );
