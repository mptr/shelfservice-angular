import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HowToComponent } from './how-to/how-to.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
	declarations: [HowToComponent],
	imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatTabsModule],
})
export class HowToModule {}
