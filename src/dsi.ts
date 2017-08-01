import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Local
import { DsiApi } from './dsi.api';
import { DsiDriver } from './dsi.driver';
import { TableSchema } from './support/schema';

@Injectable()
export class Dsi<T> {

	public constructor(
		protected _dsiDriver: DsiDriver<T>,
		protected _ngZone: NgZone
	) { }

	public create(resource: string, doc: T): Observable<string> {
		return this._dsiDriver.create(resource, doc);
	}

	public delete(resource: string, id: string): Observable<number> {
		return this._dsiDriver.delete(resource, id);
	}

	public read(resource: string, request?: DsiApi.Request, reactive: boolean = false): Observable<DsiApi.Response> {
		return this._dsiDriver.read(resource, request, reactive);
	}

	public readOne(resource: string, request?: DsiApi.RequestOne, reactive: boolean = false): Observable<DsiApi.Response> {
		return this._dsiDriver.readOne(resource, request, reactive);
	}

	public update(resource: string, id: string, doc: T): Observable<T> {
		let resultSubject = new Subject<T>();

		this._dsiDriver.update(resource, id, doc).first().subscribe((result: DsiApi.Response) => {
			this._ngZone.run(() => {
				resultSubject.next(result.data);
			});
		});

		return resultSubject.asObservable();
	}

}
