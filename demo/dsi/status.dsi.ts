// Local
import { AppDsiConfig } from '../lib/dsi/app.dsi';
import { StatusInterface, StatusSchema } from '../model';

export const StatusDsiConfig: AppDsiConfig<StatusInterface> = {
	id: 'status',
	resource: 'status/valuelist',
	schema: StatusSchema
};
