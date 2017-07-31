import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subject, Subscription } from 'rxjs';

// Local
import { HttpRestService } from '../rest/http.service';
import { DsiApi } from '../dsi.api';
import { Doc } from '../dsi';
import { DsiDriver } from '../dsi.driver';

@Injectable()
export class DsiRestDriver<T extends Doc> implements DsiDriver<T> {

	protected _request: DsiApi.Request = {};
	protected _resource: string;
	protected _subscriptions: {
		dsi?: Subscription,
		pagination?: Subscription
	} = {};
	protected _url: string;

	public constructor(
		protected _restHttpService: HttpRestService
	) {
		this._url = `/api/${this._resource}`;
	}

	public create(doc: T): Observable<string> {
    return this._restHttpService.post(this._url, doc);
	}

	public delete(id: string): Observable<number> {
    return this._restHttpService.delete( `${this._url}/${id}` );
	}

	public read(request?: DsiApi.Request, reactive: boolean = false): Observable<DsiApi.Response> {
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

		let result = this._restHttpService.get(this._url, params);

		if (!reactive)
			result = result.first();

		return result;
	}

	public readOne(request?: DsiApi.RequestOne, reactive: boolean = false): Observable<DsiApi.Response> {
		let params: {[name: string]: any} = {};

		request = _.merge(this._request, request || {});

		// Id
		if( request.id )
			params.id = request.id;

		// Fields
		if( request.fields )
				params.fields = request.fields;

		let result = this._restHttpService.get(this._url, params);

		if (!reactive)
			result = result.first();

		return result;
	}

	public update(id: string, doc: any): Observable<T> {
    return this._restHttpService.put(`${this._url}/${id}`, doc);
	}

}
