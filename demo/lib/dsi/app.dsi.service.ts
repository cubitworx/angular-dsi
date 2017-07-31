import { Type } from '@angular/core';

import { DsiService, DsiOptions, ModalService } from '../src';

// Local
import { AppDsiService } from './dsi.service';

export const DSI: {[name: string]: DsiOptions} = {
	test: { id: 'test', resource: 'test' }
};

export const DsiDeps: any[] = [
	ModalService,
	// DbiHttpService,
	// I18nService,
	// LoggerService,
	// NgZone,
	// NotificationsService,
	// PaginationService
];

let dsiInstances: DsiService<any>[] = [];

export function DsiFactory<T>(
	options: DsiOptions,
	// modalService: ModalService,
	// dbiHttpService: DbiHttpService,
	// 18nService: I18nService,
	// logger: LoggerService,
	// ngZone: NgZone,
	// notificationsService: NotificationsService,
	// paginationService: PaginationService
): DsiService<any> {

	if (!dsiInstances[options.id]) {
		dsiInstances[options.id] = new AppDsiService<T>(
			options,
			// modalService,
			// dbiHttpService,
			// i18nService,
			// loggerService,
			// ngZone,
			// notificationsService
		);
	}

	return dsiInstances[options.id];
}
