import { TestBed } from '@angular/core/testing';

import { WorkflowWorkerService } from './workflow-worker.service';

describe('WorkflowWorkerService', () => {
	let service: WorkflowWorkerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(WorkflowWorkerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
