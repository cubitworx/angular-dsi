import { TableSchema, ValuelistInterface } from '../../src';

export interface StatusInterface extends ValuelistInterface {
	id: string;
	value: string;
}

export const StatusSchema: TableSchema = {
	id: {
		dataType: String,
		label: 'ID'
	},
	field_1: {
		dataType: String,
		label: 'Value',
		validators: {
			required: true
		}
	}
}
