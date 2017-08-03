import { Observable } from 'rxjs';

import { Dsi, DsiConfig, DsiDataset, DsiDatasetFactory } from '../../../src';

const instances: {[id: string]: DsiDataset<any, any>} = {};

export function AppDsiDatasetFactory(
	dsi: Dsi<any, any>
): DsiDatasetFactory {
	return (config: DsiConfig): DsiDataset<any, any> => {
		if (!instances[config.id])
			instances[config.id] = new DsiDataset(config, dsi);
		return instances[config.id];
	};
}
