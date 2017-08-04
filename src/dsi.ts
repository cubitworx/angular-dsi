import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Local
import { DsiApi } from './dsi.api';
import { DsiConfig } from './dsi.config';
import { DsiDriver } from './dsi.driver';
import { DsiRestDriver } from './driver/rest.driver';
import { TableSchema } from './support/schema';

export type DsiFactory = (config: DsiConfig) => Dsi<any, any>;

export function DsiFactory(
	dsiRestDriver: DsiRestDriver<any>
): DsiFactory {
	const instances: {[id: string]: Dsi<any, any>} = {};

	return (config: DsiConfig): Dsi<any, any> => {
		if (!instances[config.id])
			instances[config.id] = new Dsi(config, dsiRestDriver);
		return instances[config.id];
	};
}

@Injectable()
export class Dsi<D, C extends DsiConfig> {

	public constructor(
		protected _config: C,
		protected _dsiDriver: DsiDriver<D>
	) { }

	public create(doc: D): Observable<string> {
		return this._dsiDriver.create(this._config.resource, doc);
	}

	public delete(id: string): Observable<number> {
		return this._dsiDriver.delete(this._config.resource, id);
	}

	public read(request?: DsiApi.Request): Observable<DsiApi.Response> {
		return this._dsiDriver.read(this._config.resource, request);
	}

	public readOne(request?: DsiApi.RequestOne): Observable<DsiApi.Response> {
		return this._dsiDriver.readOne(this._config.resource, request);
	}

	public update(id: string, doc: D): Observable<number> {
		return this._dsiDriver.update(this._config.resource, id, doc);
	}

}
