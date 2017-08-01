import { Observable } from 'rxjs';

// Local
import { DsiApi } from './dsi.api';
import { TableSchema } from './support/schema';

export interface DsiInterface<T> {
	create(doc: T): Observable<string>;
	delete(id: string): Observable<number>;
	id: string;
	read(...args: any[]): DsiInterface<T>;
	stop(): void;
	update(id: string, doc: T): Observable<DsiApi.Response>;
}
