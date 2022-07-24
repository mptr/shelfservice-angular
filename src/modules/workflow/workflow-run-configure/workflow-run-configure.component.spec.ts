import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowRunConfigureComponent } from './workflow-run-configure.component';

describe('WorkflowRunConfigureComponent', () => {
	let component: WorkflowRunConfigureComponent;
	let fixture: ComponentFixture<WorkflowRunConfigureComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
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
