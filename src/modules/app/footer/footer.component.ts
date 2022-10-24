import { Component } from '@angular/core';
import packageInfo from 'src/../package.json';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
	public version = packageInfo.version;
}
