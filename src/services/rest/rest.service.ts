import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Message } from '../message/Message';
import { environment } from 'src/environments/environment';
import { MessageService } from '../message/message.service';

type ArrayElement<T> = T extends Array<infer U> ? U : never;

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
	) {}

	get url(): string {
		return this.parent ? `${this.parent.url}/${this.urlPart}` : this.urlPart;
	}

	navigate<C = never>(str: string): RestClient<C, T> {
		return new RestClient<C, T>(str, this, this.http, this.msgService);
	}

	post(data: Partial<ArrayElement<T>>): Observable<ArrayElement<T>> {
		return this.intercept(this.http.post<ArrayElement<T>>(this.url, data));
	}
	get(): Observable<T> {
		console.log('GET: ' + this.url);
		console.log(this.http);
		return this.intercept(this.http.get<T>(this.url, { headers: this.headers }));
	}
	patch(data: Partial<T>): Observable<T> {
		return this.intercept(this.http.patch<T>(this.url, data));
	}
	delete(): Observable<T> {
		return this.intercept(this.http.delete<T>(this.url));
	}

	private intercept<K>(o: Observable<K>) {
		return o.pipe(
			catchError((error: HttpErrorResponse): Observable<K> => {
				console.warn('CAUGHT ERROR', error);
				if (error === undefined)
					this.msgService.push(new Message('Login erforderlich', 'Bitte melden Sie sich zunächst an.', 'info'));
				if (error.status === 0) this.msgService.push(new Message(`Fehler`, `Server antwortet nicht`, 'error'));
				else if (error.status === 500)
					this.msgService.push(
						new Message(
							`Serverfehler`,
							error.error.error + '<br>' + error.error.exception.replace('<', '&lt;').replace('>', '&gt;'),
							'error',
						),
					);
				else if (error.status == 403) this.msgService.push(new Message(`Fehler`, `Keine Berechtigung`, 'warning'));
				else
					this.msgService.push(
						new Message(
							`Warnung: Unbekannter Fehler`,
							error.error.error + '<br>' + error.error.exception.replace('<', '&lt;').replace('>', '&gt;'),
							'warning',
						),
					);
				return of();
			}),
		);
	}
}
