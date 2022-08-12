import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable, of, tap } from 'rxjs';
import { Message } from '../message/Message';
import { environment } from 'src/environments/environment';
import { MessageService } from '../message/message.service';

type Constructable<T> = new () => T;

type id = string | number;

@Injectable({
	providedIn: 'root',
})
export class RestService {
	constructor(private readonly http: HttpClient, private readonly msgService: MessageService) {}
	get new() {
		return RestClient.new(this.http, this.msgService);
	}
}

class RestClient<T, P = never> {
	// public constructor
	static new(http: HttpClient, msgService: MessageService) {
		return new RestClient<never>(environment.apiBaseUrl, null, http, msgService);
	}

	headers = new HttpHeaders({
		'Content-Type': 'application/json',
		Accept: 'application/json',
	});

	private constructor(
		readonly urlPart: string,
		private readonly parent: RestClient<P> | null = null,
		private readonly http: HttpClient,
		private readonly msgService: MessageService,
		private readonly ctor?: Constructable<T>,
	) {}

	get url(): string {
		return this.parent ? `${this.parent.url}/${this.urlPart}` : this.urlPart;
	}

	navigate<C = never>(str: string, ctor?: Constructable<C>): RestClient<C, T> {
		return new RestClient<C, T>(str, this, this.http, this.msgService, ctor);
	}

	post(data: Partial<T>): Promise<T> {
		return this.intercept(() => this.http.post<T>(this.url, data));
	}

	getAll(): Promise<T[]> {
		return this.intercept(() => this.http.get<T[]>(this.url, { headers: this.headers }));
	}

	getOne(id: id): Promise<T>;
	getOne(object: { id: id }): Promise<T>;
	getOne(id: id | { id: id }): Promise<T> {
		if (typeof id === 'object') id = id.id;
		return this.intercept(() => this.http.get<T>(this.url + '/' + id, { headers: this.headers }));
	}

	patch(data: Partial<T> & { id: id }): Promise<T> {
		return this.intercept(() => this.http.patch<T>(this.url + '/' + data.id, data));
	}

	delete(id: id): Promise<T>;
	delete(object: { id: id }): Promise<T>;
	delete(id: id | { id: id }): Promise<T> {
		if (typeof id === 'object') id = id.id;
		return this.intercept(() => this.http.delete<T>(this.url + '/' + id));
	}

	private intercept(handler: () => Observable<T[]>): Promise<T[]>;
	private intercept(handler: () => Observable<T>): Promise<T>;
	private intercept(handler: () => Observable<T | T[]>): Promise<T | T[]> {
		const observer = handler().pipe(
			catchError((error: HttpErrorResponse) => this.handleError(error)),
			map(x => {
				if (!this.ctor) return x;
				else return RestClient.instanciate(x, this.ctor);
			}),
			tap(x => console.log('RESPONSE', x)),
		);
		try {
			return lastValueFrom(observer);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	private static instanciate<T>(x: T, ctor: Constructable<T>): T;
	private static instanciate<T>(x: T[], ctor: Constructable<T>): T[];
	private static instanciate<T>(x: T | T[], ctor: Constructable<T>) {
		let result;
		if (Array.isArray(x)) {
			result = x.map(elm => {
				const instance = new ctor();
				Object.assign(instance, elm);
				return instance;
			});
		} else {
			result = new ctor();
			Object.assign(result, x);
			return result;
		}
		return result;
	}

	private handleError(error: HttpErrorResponse) {
		console.warn('CAUGHT ERROR', error);
		if (error === undefined)
			this.msgService.push(new Message('Login erforderlich', 'Bitte melden Sie sich zunächst an.', 'info'));
		if (error.status === 0) this.msgService.push(new Message(`Fehler`, `Server antwortet nicht`, 'error'));
		else if (error.status === 500)
			this.msgService.push(
				new Message(
					`Serverfehler`,
					error.error.statusCode + '<br>' + error.error.message.replace('<', '&lt;').replace('>', '&gt;'),
					'error',
				),
			);
		else if (error.status == 403) this.msgService.push(new Message(`Fehler`, `Keine Berechtigung`, 'warning'));
		else
			this.msgService.push(
				new Message(
					`Unbekannter Fehler`,
					error.error.statusCode + '<br>' + error.error.message.replace('<', '&lt;').replace('>', '&gt;'),
					'warning',
				),
			);
		return of();
	}
}
