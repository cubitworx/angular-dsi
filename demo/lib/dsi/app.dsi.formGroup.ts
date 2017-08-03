import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

import { Dsi, DsiConfig, DsiFormGroup, DsiFormGroupFactory } from '../../../src';

const instances: {[id: string]: DsiFormGroup<any, any>} = {};

export function AppDsiFormGroupFactory(
	dsi: Dsi<any, any>,
	formBuilder: FormBuilder
): DsiFormGroupFactory {
	return (id: Observable<string>, config: DsiConfig): DsiFormGroup<any, any> => {
		if (!instances[config.id])
			instances[config.id] = new DsiFormGroup(config, dsi, formBuilder, id);
		return instances[config.id];
	};
}
