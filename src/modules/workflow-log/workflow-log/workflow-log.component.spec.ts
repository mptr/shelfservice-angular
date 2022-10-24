import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';

import { WorkflowLogComponent } from './workflow-log.component';

describe('WorkflowLogComponent', () => {
	let component: WorkflowLogComponent;
	let fixture: ComponentFixture<WorkflowLogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				HttpClientModule,
				MatDialogModule,
				MatIconModule,
				MatInputModule,
				MatFormFieldModule,
				MatTableModule,
				MatPaginatorModule,
				BrowserAnimationsModule,
			],
			providers: [{ provide: KeycloakService, useValue: {} }],
			declarations: [WorkflowLogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(WorkflowLogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
