import { NotificationsService } from 'angular2-notifications';
import { Observable, Subject } from 'rxjs';

// Modules
import { LoggerService } from '../../logger';
import { MeteorObservableOnce } from '../../meteor-rxjs-enhanced';
import { DialogService, MODAL_BUTTONS_DELETE_CANCEL } from '../../modal';

// Local
import { Model } from '../both/model';
import { Dsi } from '../both/dsi';
import { Doc } from '../dsi.class';
import { DsiDriver } from '../dsi.driver';

export abstract class DsiMeteorDriver<T extends Doc> implements DsiDriver<T> {

	public constructor(
		protected _collection: Mongo.Collection<T>
	) { }

	protected create(doc: T): Observable<string> {
		return MeteorObservableOnce.call('dsi.create.'+this._collection._name, {doc: doc});
	}

	protected delete(id: string): Observable<number> {
		return MeteorObservableOnce.call('dsi.delete.'+this._collection._name, {id: id});
	}

	protected update(id: string, doc: T): Observable<number> {
		return MeteorObservableOnce.call('dsi.update.'+this._collection._name, {id: id, doc: doc});
	}

}
