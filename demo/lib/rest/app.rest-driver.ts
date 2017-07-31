import { RestJsonDsi } from '../../src';

export class AppRestJsonDsi<T> extends RestJsonDsi<T> {

	protected _deleteConfirmOptions: ModalOptions = {
		title: 'Delete record',
		message: 'Are you sure you would like to delete this record?'
	};

	protected _dsiOptions: DsiOptions;

	public constructor(
		options: DsiOptions,
		protected _modalService: ModalService
		// protected _dbiHttpService: DbiHttpService,
		// protected _i18nService: I18nService,
		// protected _logger: LoggerService,
		// protected _ngZone: NgZone,
		// protected _notificationsService: NotificationsService
	) {
		super();
	}

}
