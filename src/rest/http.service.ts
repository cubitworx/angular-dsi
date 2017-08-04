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

	protected _errors: any[] = [];

	public constructor(
		protected _http: Http
	) { }

	public get errors(): string[] {
		return this._errors;
	}

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
				url += ( ~url.indexOf('?') ? '&' : '?' ) + queryParams.join('&');
		}
		return url;
	}

	protected _handleError(response: Response|any): ErrorObservable {
		let error: RestApi.ResponseError;

		this._errors.length = 0;

		if (response instanceof Response) {
			try {
				error = response.json();
				if (!error)
					error = {message: 'Error decoding response error'};
			} catch (e) {
				error = {message: 'Unexpected error', data: e};
			}
		} else {
			error = {message: response.toString()};
		}

		this._errors.push('An unexpected error has occured');
		return Observable.throw(error);
	}

	protected _handleResponse(response: Response): RestApi.ResponseSuccess|ErrorObservable {
		let error: RestApi.ResponseError;

		try {
			let responseJson = response.json();
			if (responseJson)
				return responseJson;
			error = {message: 'Error decoding response'};
		} catch (e) {
			error = {message: 'Unexpected error', data: e};
		}

		this._errors.push('An unexpected error has occured');
		return Observable.throw({message: 'Error decoding response'})
	}

	protected _requestOptions(): RequestOptionsArgs {
		return new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
	}

}
