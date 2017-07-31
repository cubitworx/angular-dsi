import { Observable } from 'rxjs';

// Local
import { DsiApi } from './dsi.api';
import { Doc } from './dsi';

export interface DsiDriver<T extends Doc> {
	create(doc: T): Observable<string>;
	delete(id: string): Observable<number>;
	read(request?: DsiApi.Request, reactive?: boolean): Observable<DsiApi.Response>;
	readOne(request?: DsiApi.RequestOne, reactive?: boolean): Observable<DsiApi.Response>;
	update(id: string, doc: T): Observable<DsiApi.Response>;
}
