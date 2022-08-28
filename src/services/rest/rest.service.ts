import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance, ClassConstructor, ClassTransformOptions } from 'class-transformer';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { Message } from '../message/Message';
import { environment } from 'src/environments/environment';
import { MessageService } from '../message/message.service';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { AuthService } from 'src/modules/auth/auth.service';

type id = string | number;

@Injectable({
	providedIn: 'root',
})
export class RestService {
	constructor(
		private readonly http: HttpClient,
		private readonly auth: AuthService,
		private readonly msgService: MessageService,
	) {}
	get new() {
		return RestClient.new(this.http, this.auth, this.msgService);
	}
}

class RestClient<T> {
	// public constructor
	static new(http: HttpClient, auth: AuthService, msgService: MessageService) {
		return new RestClient<never>(environment.apiBaseUrl, null, http, auth, msgService);
	}

	headers = new HttpHeaders({
		'Content-Type': 'application/json',
		Accept: 'application/json',
	});

	private constructor(
		readonly urlPart: string,
		private readonly parent: RestClient<unknown> | null = null,
		private readonly http: HttpClient,
		private readonly auth: AuthService,
		private readonly msgService: MessageService,
		private readonly ctor?: ClassConstructor<T>,
	) {}

	get url(): string {
		return this.parent ? `${this.parent.url}/${this.urlPart}` : this.urlPart;
	}

	navigate<C = never>(str: string, ctor?: ClassConstructor<C>): RestClient<C> {
		return new RestClient<C>(str, this, this.http, this.auth, this.msgService, ctor);
	}

	post(data: Partial<T>): Promise<T> {
		return this.intercept(() => this.http.post<T>(this.url, data));
	}

	getAll(params: Record<string, string | number> = {}): Promise<T[]> {
		return this.intercept(() => this.http.get<T[]>(this.url, { headers: this.headers, params }));
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

	put(data: Partial<T>): Promise<T> {
		return this.intercept(() => this.http.put<T>(this.url, data));
	}

	delete(id: id): Promise<T>;
	delete(object: { id: id }): Promise<T>;
	delete(id: id | { id: id }): Promise<T> {
		if (typeof id === 'object') id = id.id;
		return this.intercept(() => this.http.delete<T>(this.url + '/' + id));
	}

	async sse(): Promise<Observable<string>> {
		const t = await this.auth.authToken;
		return new Observable(subscriber => {
			const sse = new EventSourcePolyfill(this.url, {
				headers: {
					authorization: 'Bearer ' + t,
				},
			});
			sse.onmessage = e => {
				const d = JSON.parse(e.data);
				if (d.type === 'complete') subscriber.complete();
				else if (d.type === 'error') {
					this.msgService.push(new Message('Fehler bei der Log-Liveübertragung', d.message, 'error'));
				} else subscriber.next(d.message);
			};
			sse.onerror = e => subscriber.error(e);
			return () => sse.close();
		});
	}

	private static instanciateOptions: ClassTransformOptions = { excludeExtraneousValues: true };

	private intercept(handler: () => Observable<T[]>): Promise<T[]>;
	private intercept(handler: () => Observable<T>): Promise<T>;
	private intercept(handler: () => Observable<T | T[]>): Promise<T | T[]> {
		const observer = handler().pipe(
			catchError((error: HttpErrorResponse) => this.handleError(error)),
			map(x => {
				if (this.ctor) {
					const i = plainToInstance(this.ctor, x, RestClient.instanciateOptions);
					console.log('Returning:', i, x);
					return i;
				}
				console.warn('No ctor given for', this.url);
				console.log('Returning:', x);
				return x;
			}),
		);
		try {
			return lastValueFrom(observer);
		} catch (e) {
			return Promise.reject(e);
		}
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
