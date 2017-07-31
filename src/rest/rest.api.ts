export module RestApi {

	export type Request = any;

	export interface ResponseError {
		code?: string; // an application-specific error code, expressed as a string value.
		data?: any; // Data relating to error
		debug?: any; // Debug information if there is any
		id?: string; // a unique identifier for this particular occurrence of the problem.
		message?: string; // a human-readable explanation specific to this occurrence of the problem.
	}

	export interface ResponseSuccess {
		data?: any;
	}

	export type Response = ResponseSuccess|ResponseError;

}
