import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { WorkflowEditComponent } from './workflow-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

describe('WorkflowEditComponent', () => {
	let component: WorkflowEditComponent;
	let fixture: ComponentFixture<WorkflowEditComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MatDialogModule,
				RouterTestingModule,
				HttpClientModule,
				MatIconModule,
				MatCardModule,
				MatStepperModule,
				MatFormFieldModule,
				MatInputModule,
				BrowserAnimationsModule,
				MatExpansionModule,
				FormsModule,
				ReactiveFormsModule,
			],
			providers: [{ provide: KeycloakService, useValue: {} }],
			declarations: [WorkflowEditComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WorkflowEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
