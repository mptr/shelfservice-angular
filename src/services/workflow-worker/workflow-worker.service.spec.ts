/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';
import { firstValueFrom, toArray } from 'rxjs';
import { RestService } from '../rest/rest.service';
import { WorkflowWorkerService } from './workflow-worker.service';

const staticWorkerSpy: {
	postMessage: jest.Mock;
	terminate: jest.Mock;
} = {} as any;

class WorkerMock {
	postMessage(...args: any[]) {
		staticWorkerSpy.postMessage(...args);
		setTimeout(() => this.onmessage({ data: { type: 'init' } }), 0);
		setTimeout(() => this.onmessage({ data: { type: 'log', data: 'ok' } }), 300);
		setTimeout(() => this.onmessage({ data: { type: 'done' } }), 500);
	}
	terminate(...args: any[]) {
		staticWorkerSpy.terminate(...args);
	}
	onmessage(..._args: any[]) {
		return; // gets replaced
	}
}

// @ts-expect-error inject worker mock in global scope
window.Worker = WorkerMock;

const scriptToBlob = (script: string) => new Blob([script], { type: 'application/javascript' });
const scriptToDataUrl = (script: string) =>
	new Promise(r => {
		const a = new FileReader();
		a.onload = e => r(e.target?.result);
		a.readAsDataURL(scriptToBlob(script));
	});

describe('WorkflowWorkerService', () => {
	let service: WorkflowWorkerService;

	const restMock: {
		navigate: jest.Mock;
		blob: jest.Mock;
		post: jest.Mock;
	} = {} as any;

	const script = `console.log('hello world');`;

	beforeAll(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, RouterTestingModule],
			providers: [
				{ provide: KeycloakService, useValue: {} },
				{ provide: RestService, useValue: { new: restMock } },
			],
		});
		service = TestBed.inject(WorkflowWorkerService);

		restMock.navigate = jest.fn().mockImplementation(() => restMock);
		restMock.blob = jest.fn().mockImplementation(() => Promise.resolve(scriptToBlob(script)));
		restMock.post = jest.fn();

		staticWorkerSpy.postMessage = jest.fn();
		staticWorkerSpy.terminate = jest.fn();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	test.each([{ workflowDefinition: {} }, { workflowDefinition: { id: 'id' } }])(
		'should not start a workflow with incomplete data',
		async d => {
			await expect(service.start(d as any)).rejects.toThrow();
		},
	);

	const run = {
		id: 42,
		workflowDefinition: { id: 1337 },
		variables: [
			{ name: 'USERNAME', value: 'Max' },
			{ name: 'COUNT', value: '5' },
		],
	} as any;

	it('should fetch the worker script and start worker', async () => {
		await service.start(run);

		// fetch script
		expect(restMock.navigate.mock.calls.map(c => c[0]).join('/')).toEqual(
			`workflows/${run.workflowDefinition.id}/runs/${run.id}/worker.js`,
		);
		expect(restMock.blob).toBeCalledTimes(1);

		// worker launch
		expect(staticWorkerSpy.postMessage).toBeCalledTimes(1);
		expect(staticWorkerSpy.postMessage.mock.calls[0][0]).toEqual({
			variables: { USERNAME: 'Max', COUNT: '5' },
			scriptUrl: await scriptToDataUrl(script),
		});
	});

	it('should show logs as observable', async () => {
		await expect(firstValueFrom(service.logs(run).pipe(toArray()))).resolves.toEqual(['ok\n']);
	});

	it('should show logs as observable', async () => {
		await expect(firstValueFrom(service.logs({ ...run, id: -1 }))).resolves.toContain('Keine Logs vorhanden\n');
	});

	it('should quit worker and report logs to the backend', async () => {
		expect(staticWorkerSpy.terminate).toBeCalledTimes(1);
		expect(restMock.post).toBeCalledTimes(1);
		expect(restMock.post).toHaveBeenLastCalledWith({ result: true, log: 'ok\n' });
	});
});
