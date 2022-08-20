import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShelfListComponent } from './shelf-list/shelf-list.component';
import { ShelfItemComponent } from './shelf-item/shelf-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { ShelfItemDetailsDialogComponent } from './shelf-item-details/shelf-item-details.dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { WorkflowModule } from '../workflow/workflow.module';

@NgModule({
	declarations: [ShelfListComponent, ShelfItemComponent, ShelfItemDetailsDialogComponent],
	imports: [
		CommonModule,
		HttpClientModule,
		RouterModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatDividerModule,
		MatTooltipModule,
		MatMenuModule,
		WorkflowModule,
	],
})
export class ShelfModule {}
