import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShelfListComponent } from './shelf-list/shelf-list.component';
import { ShelfItemComponent } from './shelf-item/shelf-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [ShelfListComponent, ShelfItemComponent],
	imports: [CommonModule, HttpClientModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
})
export class ShelfModule {}
