import { Injectable, NgZone, Type } from '@angular/core';
// import { Http } from '@angular/http';
// import { I18nService } from '../../modules/angular-i18n';
// import { DialogService } from '../../modules/angular-modal';
// import { NotificationsService } from 'angular2-notifications';
// import { PaginationOptions, PaginationService } from '../../modules/angular-paginator';
// import { RestAngular2 } from '../../modules/js-rest';

// App
// import { HttpService } from '../core';

// Local
import { Dsi, DsiOptions, Doc } from './dsi';
import { DsiDriver } from './dsi.driver';
import { DsiServiceOptions } from './dsi.service';
// import { DbiHttpService } from './dbi-http.service';
// import { LoggerService } from '../logger';

// export interface DsiServiceOptions {
// 	class: Type<Dsi<any>>;
// 	id: string;
// }

@Injectable()
export class DsiRegistry {

	protected static _instances: Dsi<any, any>[] = [];

	public constructor(
		protected _dsi: Type<Dsi<any, any>>,
		protected _driver: DsiDriver<any>,
		protected _ngZone: NgZone
	) { }

	public instance<O extends DsiServiceOptions<O, T>, T extends Doc>(options: O): Dsi<O, T> {
		if (!DsiRegistry._instances[options.id]) {
			DsiRegistry._instances[options.id] = new options.dsi(
				this._ngZone,
				this._driver,
				options
			);
		}

		return DsiRegistry._instances[options.id]
	}

}
