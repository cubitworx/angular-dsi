// Local
import { TableSchema } from './support/schema';

export interface DsiConfig {
	id: string;
	primaryKey: string;
	resource: any;
	schema: TableSchema;
}
