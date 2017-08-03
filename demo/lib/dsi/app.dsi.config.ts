import { DsiConfig } from '../../../src';

// Local
import { ModalOptions } from '../../support/modal';
import { NotificationOptions } from '../../support/notification';

export interface AppDsiConfig extends DsiConfig {
	createSuccess?: NotificationOptions;
	deleteConfirm?: ModalOptions;
	deleteSuccess?: NotificationOptions;
	updateSuccess?: NotificationOptions;
}
