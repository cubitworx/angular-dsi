export interface ModalButton {
	result: boolean;
	class?: string;
	text: string;
}

export interface ModalOptions {
	title: string;
	message: string;
	buttons?: ModalButton[];
}
