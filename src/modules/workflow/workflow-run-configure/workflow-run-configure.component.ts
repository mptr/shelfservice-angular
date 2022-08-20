import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SetParameters, SetParameterFormControl } from 'src/modules/parameter/entities';
import { WorkflowRun } from 'src/modules/workflow-log/workflow-run';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowDefinition } from '../entities';

@Component({
	selector: 'app-workflow-run-configure',
	templateUrl: './workflow-run-configure.component.html',
	styleUrls: ['./workflow-run-configure.component.scss'],
})
export class WorkflowRunConfigureComponent implements OnInit {
	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly router: Router,
		private readonly rest: RestService,
		private readonly location: Location,
	) {}

	wfId?: string | null;
	wf?: WorkflowDefinition;

	paramForm?: SetParameters;

	ngOnInit(): void {
		this.wfId = this.activatedRoute.snapshot.paramMap.get('id');
		if (!this.wfId) throw new Error('wfId missing');

		this.rest.new
			.navigate('workflows', WorkflowDefinition)
			.getOne(this.wfId)
			.then(fetched => {
				this.wf = fetched;
				this.paramForm = new SetParameters(this.wf.parameterFields?.map(p => new SetParameterFormControl(p)) || []);
				console.log(this.paramForm);
			});
	}

	start() {
		if (!this.wfId) throw new Error('cannot start: workflow id is unknown');
		if (!this.paramForm) throw new Error('cannot start: paramForm missing');
		if (!this.paramForm.valid) throw new Error('cannot start: param form invalid');
		this.rest.new
			.navigate('workflows')
			.navigate(this.wfId)
			.navigate('runs', WorkflowRun)
			.post(this.paramForm.configObject)
			.then(r => this.router.navigate(['shelf', this.wfId, 'runs', r.id]));
	}

	cancel() {
		this.location.back();
	}
}
