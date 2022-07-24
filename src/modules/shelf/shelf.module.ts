import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShelfListComponent } from './shelf-list/shelf-list.component';
import { ShelfItemComponent } from './shelf-item/shelf-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	declarations: [ShelfListComponent, ShelfItemComponent],
	imports: [CommonModule, HttpClientModule, MatCardModule, MatButtonModule, MatIconModule],
})
export class ShelfModule {}
