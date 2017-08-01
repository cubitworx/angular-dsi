import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

// Local
import { DsiRegistry } from './dsi.registry';

@NgModule({
	declarations: [
	],
	exports: [
	],
	imports: [
		CommonModule
	]
})
export class DsiModule {

	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: DsiModule,
			providers: [
				DsiRegistry
			]
		};
	}

}
