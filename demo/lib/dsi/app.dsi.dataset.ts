import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { Dsi, DsiConfig, DsiDataset, DsiDatasetFactory } from '../../../src';

const instances: {[id: string]: DsiDataset<any>} = {};

export function AppDsiFactory(
	dsi: Dsi<any>,
	ngZone: NgZone
): DsiDatasetFactory {
	return (config: DsiConfig): DsiDataset<any> => {
		if (!instances[config.id])
			instances[config.id] = new DsiDataset(config, dsi, ngZone);
		return instances[config.id];
	};
}
