import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { WorkflowDetailsComponent } from './workflow-details.component';

describe('WorkflowDetailsComponent', () => {
	let component: WorkflowDetailsComponent;
	let fixture: ComponentFixture<WorkflowDetailsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatCardModule],
			declarations: [WorkflowDetailsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(WorkflowDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
