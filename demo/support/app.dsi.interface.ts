import { DsiOptions } from '../../src';

// Local
import { ModalOptions } from './modal.interface';
import { NotificationOptions } from './notification.interface';

export interface AppDsiOptions extends DsiOptions {
	createSuccess?: NotificationOptions;
	deleteConfirm?: ModalOptions;
	deleteSuccess?: NotificationOptions;
	id: string;
	updateSuccess?: NotificationOptions;
}
