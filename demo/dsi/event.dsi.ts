// Local
import { AppDsiConfig } from '../lib/dsi/app.dsi.config';
import { EventInterface, EventSchema } from '../model';
import { apiEndPoint } from './config';

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
	resource: `${apiEndPoint}/event`,
	schema: EventSchema,
	updateSuccess: {
		title: 'Success',
		message: 'Event has been updated'
	}
};
