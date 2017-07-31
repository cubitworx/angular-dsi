export module Schema {

	export interface Field {
		dataType: any;
		fieldType?: string;
		label?: string;
		stored?: boolean;
		validators?: {
			required?: boolean
		};
	}

	export interface Table {
		[field: string]: Field;
	}

}
