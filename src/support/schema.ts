export interface FieldSchema {
	dataType: any;
	fieldType?: string;
	label?: string;
	stored?: boolean;
	validators?: {
		required?: boolean
	};
}

export interface TableSchema {
	[field: string]: FieldSchema;
}
