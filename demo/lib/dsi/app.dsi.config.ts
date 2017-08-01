import { DsiConfig } from '../../../src';

// Local
import { ModalOptions } from '../../support/modal.interface';
import { NotificationOptions } from '../../support/notification.interface';

export interface AppDsiConfig extends DsiConfig {
	createSuccess?: NotificationOptions;
	deleteConfirm?: ModalOptions;
	deleteSuccess?: NotificationOptions;
	updateSuccess?: NotificationOptions;
}
