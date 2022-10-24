import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';
import { WorkflowDetailsComponent } from '../../workflow/workflow-details/workflow-details.component';
import { WorkflowRunStatusComponent } from './workflow-run-status.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('WorkflowRunStatusComponent', () => {
	let component: WorkflowRunStatusComponent;
	let fixture: ComponentFixture<WorkflowRunStatusComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				HttpClientModule,
				MatCardModule,
				MatIconModule,
				MatCheckboxModule,
				FormsModule,
				ReactiveFormsModule,
			],
			providers: [{ provide: KeycloakService, useValue: {} }],
			declarations: [WorkflowRunStatusComponent, WorkflowDetailsComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WorkflowRunStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
