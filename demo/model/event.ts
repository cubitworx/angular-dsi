import { TableSchema } from '../../src';

export interface EventInterface {
	date: Date;
	id: string;
	name: string;
}

export const EventSchema: TableSchema = {
	date: {
		dataType: Date,
		label: 'Date',
		validators: {
			required: true
		}
	},
	id: {
		dataType: String,
		label: 'ID'
	},
	name: {
		dataType: String,
		label: 'Name',
		validators: {
			required: true
		}
	}
}
