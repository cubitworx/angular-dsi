// Local
import { AppDsiConfig } from '../lib/dsi/app.dsi.config';
import { StatusInterface, StatusSchema } from '../model';

export const StatusDsiConfig: AppDsiConfig = {
	id: 'status',
	resource: 'status/valuelist',
	schema: StatusSchema
};
