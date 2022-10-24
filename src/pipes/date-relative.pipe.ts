import { ChangeDetectorRef, Injectable, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { EMPTY, expand, Observable, of, skip, Subject, Subscription, timer } from 'rxjs';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

abstract class RelativeDateFormatter {
	abstract format(delta: number, short: boolean, precision: number, prefix: boolean): string;
}
class DErelativeDateFormatter extends RelativeDateFormatter {
	private readonly config = [
		{ label: 'Jahr', value: YEAR },
		{ label: 'Monat', value: MONTH },
		{ label: 'Woche', value: WEEK },
		{ label: 'Tag', value: DAY },
		{ label: 'Stunde', value: HOUR },
		{ label: 'Minute', value: MINUTE },
		{ label: 'Sekunde', value: SECOND },
	];

	private toPlural(label: string, count: number): string {
		if (count === 1) return label;
		return label + (label.endsWith('e') ? 'n' : 'en');
	}

	private formatItem(label: string, count: number, short: boolean): string {
		if (!short) return count + ' ' + this.toPlural(label, count);
		return count + label.toLowerCase()[0];
	}

	format(delta: number, short: boolean, precision: number, prefix: boolean): string {
		const result: string[] = [];
		let captureFromIndex: undefined | number = undefined;
		for (let i = 0; i < this.config.length; i++) {
			const c = this.config[i];
			const count = Math.floor(delta / c.value);

			if (captureFromIndex === undefined && count > 0) captureFromIndex = i;

			if (captureFromIndex !== undefined && captureFromIndex <= i && i < precision + captureFromIndex) {
				result.push(this.formatItem(c.label, count, short));
				delta -= count * c.value;
			}
		}
		return (prefix ? (delta < 0 ? 'in' : 'vor') : '') + ' ' + result.join(', ');
	}
}

@Injectable()
export class TimeRelativeClock {
	tick(then: number): Observable<number> {
		return of(0).pipe(
			expand(() => {
				const now = Date.now();
				const seconds = Math.round(Math.abs(now - then) / 1000);

				const period = seconds < MINUTE ? 1000 : seconds < HOUR ? 1000 * MINUTE : seconds < DAY ? 1000 * HOUR : 0;

				return period ? timer(period) : EMPTY;
			}),
			skip(1),
		);
	}
}

@Pipe({
	name: 'dateRelative',
	pure: false,
})
export class DateRelativePipe implements PipeTransform, OnDestroy {
	private date = 0;
	private value = '';
	private short = false;
	private doPrefix = true;
	private precision = 3;
	private clockSubscription: Subscription | null = null;
	stateChanges = new Subject<void>();
	private clock = new TimeRelativeClock();
	private formatter: RelativeDateFormatter = new DErelativeDateFormatter();

	constructor(cd: ChangeDetectorRef) {
		this.stateChanges.subscribe(() => {
			this.value = this.formatter.format(Date.now() - this.date, this.short, this.precision, this.doPrefix);
			cd.markForCheck();
		});
	}

	ngOnDestroy(): void {
		if (this.clockSubscription) this.clockSubscription.unsubscribe();
		this.clockSubscription = null;
		this.stateChanges.complete();
	}

	transform(value?: Date | string, ...args: ('short' | 'no-prefix' | number)[]): string {
		const _date = new Date(value ?? 0).valueOf();

		args.forEach(arg => {
			if (typeof arg === 'string') {
				if (arg === 'short') this.short = true;
				if (arg === 'no-prefix') this.doPrefix = false;
			} else {
				this.precision = arg;
			}
		});

		if (this.date === _date) {
			return this.value;
		}
		this.date = _date;

		if (!this.date) return this.value;

		if (this.clockSubscription) {
			this.clockSubscription.unsubscribe();
			this.clockSubscription = null;
		}
		this.clockSubscription = this.clock.tick(this.date).subscribe(() => this.stateChanges.next());
		this.stateChanges.next();

		return this.value;
	}
}
