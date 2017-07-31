import { Schema } from '../../src';

export interface TestInterface {
	field_1: string;
	field_2: string;
	field_3: string;
}

export const TextSchema: Schema.Table = {
	field_1: {
		dataType: String,
		label: 'Field 1',
		validators: {
			required: true
		}
	},
	field_2: {
		dataType: String,
		label: 'Field 2'
	},
	field_3: {
		dataType: String,
		label: 'Field 3'
	}
}
