import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

// Local
import { HttpRestService } from '../rest/http.service';
import { DsiApi } from '../dsi.api';
import { TableSchema } from '../support/schema';
import { DsiDriver } from '../dsi.driver';

@Injectable()
export class DsiRestDriver<T> implements DsiDriver<T> {

	protected _request: DsiApi.Request = {};
	protected _uri: string = '/api';

	public constructor(
		protected _restHttpService: HttpRestService
	) { }

	public create(resource: string, doc: T): Observable<string> {
    return this._restHttpService.post(`${this._uri}/${resource}`, doc);
	}

	public delete(resource: string, id: string): Observable<number> {
    return this._restHttpService.delete( `${this._uri}/${resource}/${id}` );
	}

	public read(resource: string, request?: DsiApi.Request): Observable<DsiApi.Response> {
		let params: {[name: string]: any} = {};

		request = _.merge(this._request, request || {});

		// Fields
		if( request.fields )
				params.fields = request.fields;

		// Filter
		if( request.filter ) {
			params.filter = encodeURIComponent(request.filter);
		}

		// Page
		if( request.pagination ) {
			params.page = {};
			if( request.pagination.page )
				params.page.number = request.pagination.page;
			if( request.pagination.size )
				params.page.size = request.pagination.size;
		}

		// Sort
		if( request.sort )
			params.sort = request.sort.join(',');

		let result = this._restHttpService.get(`${this._uri}/${resource}`, params);

		return result;
	}

	public readOne(resource: string, request?: DsiApi.RequestOne, reactive: boolean = false): Observable<DsiApi.Response> {
		let params: {[name: string]: any} = {};

		request = _.merge(this._request, request || {});

		// Id
		if( request.id )
			params.id = request.id;

		// Fields
		if( request.fields )
				params.fields = request.fields;

		let result = this._restHttpService.get(`${this._uri}/${resource}`, params);

		if (!reactive)
			result = result.first();

		return result;
	}

	public update(resource: string, id: string, doc: any): Observable<T> {
    return this._restHttpService.put(`${this._uri}/${resource}/${id}`, doc);
	}

}
