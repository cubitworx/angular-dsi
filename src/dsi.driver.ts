import { Observable } from 'rxjs';

// Local
import { DsiApi } from './dsi.api';
import { TableSchema } from './support/schema';

export abstract class DsiDriver<D> {
	public abstract errors: string[];

	public abstract create(resource: any, doc: D): Observable<string>;
	public abstract delete(resource: any, id: string): Observable<number>;
	public abstract read(resource: any, request?: DsiApi.Request): Observable<DsiApi.Response>;
	public abstract readOne(resource: any, request?: DsiApi.RequestOne): Observable<DsiApi.Response>;
	public abstract update(resource: any, id: string, doc: D): Observable<number>;
}
