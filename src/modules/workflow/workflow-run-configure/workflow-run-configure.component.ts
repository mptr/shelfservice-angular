import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/services/rest/rest.service';
import { SetParameter, SetParameterFormControl } from '../parameter';
import { WorkflowDefinition } from '../workflow-definition';

@Component({
	selector: 'app-workflow-run-configure',
	templateUrl: './workflow-run-configure.component.html',
	styleUrls: ['./workflow-run-configure.component.scss'],
})
export class WorkflowRunConfigureComponent implements OnInit {
	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly rest: RestService,
		private readonly location: Location,
	) {}

	wfId?: string;
	wf?: WorkflowDefinition;

	paramForm?: FormArray<SetParameterFormControl>;

	ngOnInit(): void {
		this.wfId = this.activatedRoute.snapshot.url[0].path;
		if (!this.wfId) throw new Error('wfId missing');

		this.rest.new
			.navigate('workflows', WorkflowDefinition)
			.getOne(this.wfId)
			.then(fetched => {
				this.wf = fetched;
				this.paramForm = new FormArray(this.wf.parameterFields.map(p => new SetParameterFormControl(p)));
			});
	}

	start() {
		if (!this.wfId) throw new Error('cannot start: workflow id is unknown');
		if (!this.paramForm) throw new Error('cannot start: paramForm missing');
		if (!this.paramForm.valid) throw new Error('cannot start: param form invalid');
		this.rest.new
			.navigate('workflows')
			.navigate(this.wfId)
			.navigate('runs', Array<SetParameter>)
			.post(this.paramForm.controls.map(ctl => ctl.toSetParameter()))
			.then(console.log);
	}

	cancel() {
		this.location.back();
	}
}
