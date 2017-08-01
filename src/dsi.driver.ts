import { Observable } from 'rxjs';

// Local
import { DsiApi } from './dsi.api';
import { TableSchema } from './support/schema';

export abstract class DsiDriver<T> {
	public abstract create(resource: string, doc: T): Observable<string>;
	public abstract delete(resource: string, id: string): Observable<number>;
	public abstract read(resource: string, request?: DsiApi.Request, reactive?: boolean): Observable<DsiApi.Response>;
	public abstract readOne(resource: string, request?: DsiApi.RequestOne, reactive?: boolean): Observable<DsiApi.Response>;
	public abstract update(resource: string, id: string, doc: T): Observable<DsiApi.Response>;
}
