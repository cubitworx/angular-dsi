// Local
import { EventInterface, EventSchema } from '../model';
import { AppDsiConfig } from '../lib/dsi/app.dsi';

export const EventDsiConfig: AppDsiConfig = {
	createSuccess: {
		title: 'Success',
		message: 'Event has been deleted'
	},
	deleteConfirm: {
		title: 'Delete event',
		message: 'Are you sure you would like to delete this event?'
	},
	deleteSuccess: {
		title: 'Success',
		message: 'Event has been deleted'
	},
	id: 'event',
	resource: 'event',
	schema: EventSchema,
	updateSuccess: {
		title: 'Success',
		message: 'Event has been updated'
	}
};
