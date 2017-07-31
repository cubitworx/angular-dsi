import { Observable } from 'rxjs';

export interface RestInterface {
	delete(url: string, params?: {[name: string]: string}): Observable<any>;
	get(url: string, params?: {[name: string]: string}): Observable<any>;
	post(url: string, body: any): Observable<any>;
	put(url: string, body: any): Observable<any>;
}
