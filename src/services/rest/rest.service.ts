import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance, ClassConstructor, ClassTransformOptions } from 'class-transformer';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { Message } from '../message/Message';
import { environment } from 'src/environments/environment';
import { MessageService } from '../message/message.service';

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

class RestClient<T> {
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
		private readonly parent: RestClient<unknown> | null = null,
		private readonly http: HttpClient,
		private readonly msgService: MessageService,
		private readonly ctor?: ClassConstructor<T>,
	) {}

	get url(): string {
		return this.parent ? `${this.parent.url}/${this.urlPart}` : this.urlPart;
	}

	navigate<C = never>(str: string, ctor?: ClassConstructor<C>): RestClient<C> {
		return new RestClient<C>(str, this, this.http, this.msgService, ctor);
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

	sse(): Observable<string> {
		return new Observable(subscriber => {
			const sse = new EventSource(this.url);
			sse.onmessage = e => {
				const d = JSON.parse(e.data);
				if (d.type === 'complete') subscriber.complete();
				else subscriber.next(d.message);
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
				if (this.ctor) return plainToInstance(this.ctor, x, RestClient.instanciateOptions);
				console.warn('No ctor given for', this.url);
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
