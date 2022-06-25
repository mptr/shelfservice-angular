import { Component } from '@angular/core';
import packageInfo from '../../package.json';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	public version = packageInfo.version;
}
