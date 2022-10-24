import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';

import { WorkflowRunConfigureComponent } from './workflow-run-configure.component';

describe('WorkflowRunConfigureComponent', () => {
	let component: WorkflowRunConfigureComponent;
	let fixture: ComponentFixture<WorkflowRunConfigureComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientModule, MatCardModule],
			providers: [{ provide: KeycloakService, useValue: {} }],
			declarations: [WorkflowRunConfigureComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WorkflowRunConfigureComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
