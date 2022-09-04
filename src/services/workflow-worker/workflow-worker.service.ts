import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { WorkflowRun } from 'src/modules/workflow-log/workflow-run';
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

		const scriptBlob = await this.rest.new
			.navigate('workflows')
			.navigate(run.workflowDefinition.id)
			.navigate('runs')
			.navigate(run.id)
			.navigate('worker.js')
			.blob();

		// load worker from blob
		const url = URL.createObjectURL(scriptBlob);
		console.log(url);
		const worker = new Worker(url, { type: 'module' });

		const variables = run.parameters.reduce((acc, { name, value }) => {
			acc[name] = value;
			return acc;
		}, {} as Record<string, unknown>);

		const subject = new ReplaySubject<string>();

		worker.onmessage = msg => {
			if (msg.data === '__complete') {
				subject.complete();
				worker.terminate();
				// TODO: hand in the logs
			} else subject.next(msg.data.replace(/(^"|"$)/gm, '') + '\n');
		};
		worker.onmessageerror = data => {
			subject.error(data);
			console.warn(data);
		};
		worker.onerror = ev => {
			subject.error(ev);
			console.warn(ev);
		};
		worker.postMessage(variables);

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
}
