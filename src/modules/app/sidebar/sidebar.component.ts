import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/modules/auth/auth.service';
import { User } from 'src/modules/auth/user.entity';
import { BookmarkService } from 'src/services/bookmark/bookmark.service';
import { RestService } from 'src/services/rest/rest.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
	constructor(
		public readonly bmService: BookmarkService,
		public readonly auth: AuthService,
		public readonly rest: RestService,
	) {}

	protected bookmarks = new Set<string>();

	protected currentUser?: User;

	async ngOnInit() {
		this.bmService.subject.subscribe(x => (this.bookmarks = x));
		if (await this.auth.isLoggedIn) this.currentUser = await this.rest.new.navigate('users', User).getOne('self');
	}
}
