import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { WorkflowRun } from 'src/modules/workflow-log/workflow-run';
import { WebWorkerResultDto } from 'src/modules/workflow/entities/webWorker-result';
import { RestService } from '../rest/rest.service';

@Injectable({
	providedIn: 'root',
})
export class WorkflowWorkerService {
	constructor(private readonly rest: RestService) {}

	private logStore: Record<string, Observable<string>> = {};

	async start(run: WorkflowRun) {
		if (!run.workflowDefinition?.id) throw new Error('cannot start: workflow definition id missing');
		if (!run.id) throw new Error('cannot start: workflow run id missing');

		// prepare worker

		// fetch script
		const scriptUrl = await this.rest.new
			.navigate('workflows')
			.navigate(run.workflowDefinition.id)
			.navigate('runs')
			.navigate(run.id)
			.navigate('worker.js')
			.blob()
			.then(
				blob =>
					new Promise(r => {
						const a = new FileReader();
						a.onload = e => r(e.target?.result);
						a.readAsDataURL(blob);
					}),
			);
		// create worker instance
		const worker = new Worker('/assets/workflow.worker.js', { type: 'module' });
		// map variables from array to object
		const variables = run.variables.reduce((acc, { name, value }) => {
			acc[name] = value;
			return acc;
		}, {} as Record<string, unknown>);

		// subject and helper
		const subject = new ReplaySubject<string>();
		const quit = () => {
			subject.complete();
			worker.terminate();
			this.archive(run);
		};

		// subscribe to worker errors
		worker.onerror = e => {
			subject.error(e.error);
			console.warn('worker errored', e);
			quit();
		};
		worker.onmessageerror = e => {
			subject.error(e.data);
			console.error('comms sabotaged', e);
			quit();
		};
		worker.onmessage = ({ data }) => {
			switch (data.type) {
				case 'init':
					return;
				case 'log':
					return subject.next(data.data.replace(/^"/, '').replace(/"$/, '') + '\n');
				case 'done':
					return quit();
				default:
					subject.error('unknown message type: ' + data.type);
					return quit();
			}
		};

		// start the worker by posting worker script and variables
		worker.postMessage({
			variables,
			scriptUrl,
		});

		// store subject in log store to retrieve logs later on
		this.logStore[run.workflowDefinition.id + run.id] = subject;
	}

	logs(run: WorkflowRun) {
		const o = this.logStore[(run.workflowDefinition?.id || '') + (run.id || '')];
		if (!o)
			return new Observable<string>(s => {
				s.next('Keine Logs vorhanden\nEventuell wird dieser Workflow in einem anderen Browser ausgeführt.');
				s.complete();
			});
		return o;
	}

	private archive(run: WorkflowRun) {
		if (!run.workflowDefinition?.id) throw new Error('cannot archive run: workflow definition id missing');
		if (!run.id) throw new Error('cannot archive run: id missing');
		const o = this.logStore[run.workflowDefinition.id + run.id];
		if (!o) throw new Error('cannot archive: no logs found.');
		// collect
		const logs: string[] = [];
		let result = true;
		o.subscribe({
			next: log => logs.push(log),
			error: err => {
				result = false;
				return logs.push(err);
			},
		});
		// send
		this.rest.new
			.navigate('workflows')
			.navigate(run.workflowDefinition.id)
			.navigate('runs')
			.navigate(run.id)
			.navigate('log', WebWorkerResultDto)
			.post({ result, log: logs.join('') });
	}
}
