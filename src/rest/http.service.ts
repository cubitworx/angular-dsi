import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import * as _ from 'lodash';

// Local
import { DsiApi } from '../dsi.api';
import { RestApi } from './rest.api';
import { RestInterface } from './rest.interface';

@Injectable()
export class HttpRestService implements RestInterface {

	public constructor(
		protected _http: Http
	) { }

	public delete(url: string, params?: {[name: string]: string}, requestOptions?: RequestOptionsArgs): Observable<DsiApi.Response> {
		return this._http.delete(this._buildUrl(url, params), requestOptions || this._requestOptions())
			.map(response => this._handleResponse(response))
			.catch(error => this._handleError(error));
	}

	public get(url: string, params?: {[name: string]: string}, requestOptions?: RequestOptionsArgs): Observable<DsiApi.Response> {
		return this._http.get(this._buildUrl(url, params), requestOptions || this._requestOptions())
			.map(response => this._handleResponse(response))
			.catch(error => this._handleError(error));
	}

	public post(url: string, body: any, requestOptions?: RequestOptionsArgs): Observable<DsiApi.Response> {
		return this._http.post(url, body, requestOptions || this._requestOptions())
			.map(response => this._handleResponse(response))
			.catch(error => this._handleError(error));
	}

	public put(url: string, body: any, requestOptions?: RequestOptionsArgs): Observable<DsiApi.Response> {
		return this._http.put(url, body, requestOptions || this._requestOptions())
			.map(response => this._handleResponse(response) )
			.catch(error => this._handleError(error));
	}

	protected _buildUrl(url: string, params?: {[name: string]: any}): string {
		if (params) {
			let queryParams = [];
			for (let name in params) {
				if (_.isObject(params[name])) {
					for (let key in params[name])
						queryParams.push( `${name}[${key}]=${params[name][key]}` );
				} else if (_.isArray(params[name])) {
					queryParams.push( `${name}=${params[name].join(',')}` );
				} else {
						queryParams.push( `${name}=${params[name]}` );
				}
			}
			if (queryParams.length)
				url += ( url.search(/\?/) ? '&' : '?' ) + queryParams.join('&');
		}
		return url;
	}

	protected _handleError(response: Response|any): ErrorObservable {
		if (response instanceof Response) {
			try {
				let error: RestApi.ResponseError = response.json();
				if (!error)
					return Observable.throw({message: 'Error decoding response error'});
				return Observable.throw(error);
			} catch (e) {
				return Observable.throw({message: 'Unexpected error', data: e});
			}
		}

		return Observable.throw({message: response.toString()});
	}

	protected _handleResponse(response: Response): RestApi.ResponseSuccess|ErrorObservable {
		try {
			return response.json() || Observable.throw({message: 'Error decoding response'});
		} catch (e) {
			return Observable.throw({message: 'Unexpected error', data: e});
		}
	}

	protected _requestOptions(): RequestOptionsArgs {
		return new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
	}

}
