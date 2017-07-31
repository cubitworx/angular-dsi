import { RestApi } from './rest/rest.api';

export module DsiApi {

	export interface PaginationResponse {
		total?: number;
	}

	export interface PaginationRequest {
		page?: number;
		size?: number;
	}

	export interface Request {
		fields?: string[];
		filter?: any;
		pagination?: PaginationRequest;
		sort?: string[];
	}

	export interface RequestOne {
		fields?: string[];
		id?: string;
	}

	export interface ResponseError extends RestApi.ResponseError {
	}

	export interface ResponseSuccess extends RestApi.ResponseSuccess {
		pagination?: PaginationResponse
	}

	export type Response = ResponseSuccess|ResponseError;

}
