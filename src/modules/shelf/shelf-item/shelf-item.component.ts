import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/modules/auth/user.entity';
import { BookmarkService } from 'src/services/bookmark/bookmark.service';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowDefinitionList } from '../../workflow/entities';
import { ShelfItemDetailsDialogComponent } from '../shelf-item-details/shelf-item-details.dialog';

@Component({
	selector: 'app-shelf-item',
	templateUrl: './shelf-item.component.html',
	styleUrls: ['./shelf-item.component.scss'],
})
export class ShelfItemComponent implements OnInit {
	@Input()
	workflow?: WorkflowDefinitionList;

	@Input()
	id?: string;

	@Input()
	minView = false;

	@Input()
	currentUser!: User;

	@Output()
	remove = new EventEmitter();

	constructor(
		private readonly dialog: MatDialog,
		private readonly router: Router,
		private readonly rest: RestService,
		protected readonly bmService: BookmarkService,
	) {}

	ngOnInit(): void {
		if (this.id)
			this.rest.new
				.navigate('workflows', WorkflowDefinitionList)
				.getOne(this.id)
				.then(x => {
					this.workflow = x;
					// update the bookmark state if id has changed
					if (this.id && this.id !== this.workflow.id) {
						const existed = this.bmService.delete(this.id);
						if (existed && typeof this.workflow.id === 'string') this.bmService.add(this.workflow.id);
					}
					this.id = this.workflow?.id;
				});
		else this.id = this.workflow?.id;

		this.bmService.subject.subscribe(x => {
			if (!this.id) this.bookmarked = false;
			else this.bookmarked = x.has(this.id);
		});
	}

	get ownerNames() {
		return this.workflow?.owners?.map(o => o.name).join(', ');
	}

	details() {
		if (!this.workflow?.id) throw new Error('cannot render dialog for unknown workflow id');
		this.dialog
			.open(ShelfItemDetailsDialogComponent, {
				autoFocus: false,
				data: this.workflow,
			})
			.afterClosed()
			.subscribe(
				ShelfItemDetailsDialogComponent.defaultSubscriber(this.workflow.id, this.router, this.rest, this.remove),
			);
	}

	bookmark() {
		if (!this.workflow?.id) return;
		this.bmService[this.bookmarked ? 'delete' : 'add'](this.workflow.id);
	}
	bookmarked = false;
}
