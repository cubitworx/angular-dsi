import { Injectable } from '@angular/core';
import * as _ from 'lodash';

// Local
import { DsiInterface } from './dsi.interface';

@Injectable()
export class DsiRegistry {

	protected _instances: {[id: string]: DsiInterface<any>} = {};

	public add(dsi: DsiInterface<any>): DsiRegistry {
		if (!this._instances[dsi.id])
			this._instances[dsi.id] = dsi;

		return this;
	}

	public get(id: string): DsiInterface<any> {
		return this._instances[id] || null;
	}

	public remove(id?: string|string[]): DsiRegistry {
		let ids: string[] = id ? ( _.isArray(id) ? id : [id] ) : Object.keys(this._instances);

		for (let id in ids) {
			if( this._instances[id] )
				this._instances[id].stop();
			this._instances[id] = null;
		}

		return this;
	}

}
