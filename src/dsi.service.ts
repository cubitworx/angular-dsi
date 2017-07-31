import { Injectable, NgZone, Type } from '@angular/core';
// import { Http } from '@angular/http';
// import { I18nService } from '../../modules/angular-i18n';
// import { DialogService } from '../../modules/angular-modal';
// import { NotificationsService } from 'angular2-notifications';
// import { PaginationOptions, PaginationService } from '../../modules/angular-paginator';
// import { RestAngular2 } from '../../modules/js-rest';
import { Subscription } from 'rxjs';

// App
// import { HttpService } from '../core';

// Local
import { Dsi, DsiOptions, Doc } from './dsi';
import { DsiDriver } from './dsi.driver';
import { DsiRegistry } from './dsi.registry';
// import { DbiHttpService } from './dbi-http.service';
// import { LoggerService } from '../logger';

export interface DsiServiceOptions extends DsiOptions {
	dsi: Type<Dsi<any, any>>;
	id: string;
}

@Injectable()
export class DsiService {

	protected _instances: Dsi<any, any>[] = [];
	protected _subscriptions: {
		[name: string]: Subscription
	} = {};

	public constructor(
		protected _dsiRegistry: DsiRegistry,
		protected _dsiDriver: DsiDriver<any>,
		protected _ngZone: NgZone
	) { }

	public get(id: string): Dsi<any, any> {
		return this._instances[id];
	}

	public instance<O extends DsiOptions, T extends Doc>(dsiOptions: O, options: {reactive: boolean} = {reactive: false}): DsiService {
		if (!this._instances[dsiOptions.id])
			this._instances[dsiOptions.id] = this._dsiRegistry.instance(dsiOptions, reactive);

		return this;
	}

	public start(): DsiService {
		for (let name in this._instances) {
			if (this._subscriptions[name])
				this._subscriptions[name].unsubscribe();

			this._subscriptions[name] = this._instances[name].read();
		}

		return this;
	}

	public stop(): DsiService {
		for( let name in this._subscriptions ) {
			if( this._subscriptions[name] )
				this._subscriptions[name].unsubscribe();
			this._subscriptions[name] = null;
		}

		return this;
	}

}
