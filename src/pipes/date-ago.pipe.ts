import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'dateAgo',
	pure: true,
})
export class DateAgoPipe implements PipeTransform {
	transform(value?: Date, args?: any): string {
		console.log(args);
		if (!value) return '';
		const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);

		const intervals: { [key: string]: number } = {
			Jahr: 31536000,
			Monat: 2592000,
			Woche: 604800,
			Tag: 86400,
			Stunde: 3600,
			Minute: 60,
			Sekunde: 1,
		};
		let counter;
		for (const i in intervals) {
			counter = Math.floor(seconds / intervals[i]);
			if (counter > 0)
				if (counter === 1) {
					return 'vor ' + counter + ' ' + i; // singular (1 day ago)
				} else {
					return 'vor ' + counter + ' ' + i + (i.endsWith('e') ? 'n' : 'en'); // plural (2 days ago)
				}
		}
		return '';
	}
}
