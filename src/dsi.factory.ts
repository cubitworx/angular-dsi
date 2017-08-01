import { Observable } from 'rxjs';

// Local
import { DsiConfig } from './dsi.config';
import { DsiDataset } from './dsi.dataset';
import { DsiFormGroup } from './dsi.formGroup';

export type DsiDatasetFactory = (config: DsiConfig) => DsiDataset<any>;
// export const DsiDatasetFactory: DsiDatasetFactory = function (id: string): DsiDataset<any> {};

export type DsiFormGroupFactory = (id: Observable<string>, config: DsiConfig) => DsiFormGroup<any>;
// export const DsiFormGroupFactory: DsiFormGroupFactory = function (id: string): DsiFormGroup<any> {};
