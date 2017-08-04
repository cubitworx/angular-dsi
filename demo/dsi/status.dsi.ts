// Local
import { AppDsiConfig } from '../lib/dsi/app.dsi.config';
import { StatusInterface, StatusSchema } from '../model';
import { apiEndPoint } from './config';

export const StatusDsiConfig: AppDsiConfig = {
	id: 'status',
	primaryKey: 'id',
	resource: `${apiEndPoint}/status`,
	schema: StatusSchema
};
