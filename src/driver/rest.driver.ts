import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

// Local
import { HttpRestService } from '../rest/http.service';
import { DsiApi } from '../dsi.api';
import { TableSchema } from '../support/schema';
import { DsiDriver } from '../dsi.driver';

@Injectable()
export class DsiRestDriver<D> implements DsiDriver<D> {

	protected _url: string = '/api';

	public constructor(
		protected _ngZone: NgZone,
		protected _restHttpService: HttpRestService
	) { }

	public create(resource: string, doc: D): Observable<string> {
		return this._restHttpService.post(resource, doc)
			.map(response => {
				return this._ngZone.run(() => response.data);
			})
			.publishReplay()
			.refCount();
	}

	public delete(resource: string, id: string): Observable<number> {
		return this._restHttpService.delete( `${resource}/${id}` )
			.map(response => {
				return this._ngZone.run(() => response.data);
			})
			.publishReplay()
			.refCount();
	}

	public read(resource: string, request?: DsiApi.Request): Observable<DsiApi.Response> {
		let params: {[name: string]: any} = {};

		// Fields
		if (request.fields)
				params.fields = request.fields;

		// Filter
		if (request.filter) {
			params.filter = encodeURIComponent(request.filter);
		}

		// Page
		if (request.pagination) {
			params.page = {};
			if (request.pagination.page)
				params.page.number = request.pagination.page;
			if (request.pagination.size)
				params.page.size = request.pagination.size;
		}

		// Sort
		if (request.sort)
			params.sort = request.sort.join(',');

		return this._restHttpService.get(resource, params)
			.map(response => {
				return this._ngZone.run(() => response);
			})
			.publishReplay()
			.refCount();
	}

	public readOne(resource: string, request?: DsiApi.RequestOne): Observable<DsiApi.Response> {
		let params: {[name: string]: any} = {};

		// Id
		if (request.id)
			params.id = request.id;

		// Fields
		if (request.fields)
				params.fields = request.fields;

		return this._restHttpService.get(resource, params)
			.map(response => {
				return this._ngZone.run(() => response);
			})
			.publishReplay()
			.refCount();
	}

	public update(resource: string, id: string, doc: any): Observable<number> {
		return this._restHttpService.put(`${resource}/${id}`, doc)
			.map(response => {
				return this._ngZone.run(() => response.data);
			})
			.publishReplay()
			.refCount();
	}

}
