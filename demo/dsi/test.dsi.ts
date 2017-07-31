// Local
import { AppDsi } from '../lib/dsi/app.dsi';
import { TestInterface } from '../model/test';
import { AppDsiOptions } from '../support/app.dsi.interface';

export const testDsiOptions: AppDsiOptions = {
	createSuccess: {
		title: 'Success',
		message: 'Test has been deleted'
	},
	deleteConfirm: {
		title: 'Delete test',
		message: 'Are you sure you would like to delete this test?'
	},
	deleteSuccess: {
		title: 'Success',
		message: 'Test has been deleted'
	},
	dsi: AppDsi,
	id: 'test',
	updateSuccess: {
		title: 'Success',
		message: 'Test has been updated'
	}
};
