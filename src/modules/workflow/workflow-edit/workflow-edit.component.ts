import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/services/rest/rest.service';
import { KubernetesWorkflowDefinition, WorkflowDefinition } from '../WorkflowDefinition';

@Component({
	selector: 'app-workflow-edit',
	templateUrl: './workflow-edit.component.html',
	styleUrls: ['./workflow-edit.component.scss'],
})
export class WorkflowEditComponent implements OnInit {
	editId?: string;

	kindControl = new FormControl<'kubernetes' | 'webworker' | undefined>(undefined, Validators.required);

	wf?: WorkflowDefinition;

	constructor(private readonly activatedRoute: ActivatedRoute, private readonly rest: RestService) {}

	ngOnInit(): void {
		this.editId = this.activatedRoute.snapshot.url[0].path;
		if (this.editId !== 'new') {
			// there exists an id, so we need to load the workflow
			this.rest.new
				.navigate('workflows', WorkflowDefinition)
				.getOne(this.editId)
				.then(fetched => {
					this.kindControl.setValue(fetched.kind);
					this.setWf(fetched, fetched.kind);
				});
		}
		this.kindControl.valueChanges.subscribe(x => {
			this.setWf(this.wf, x);
		});
	}

	private setWf(wf?: WorkflowDefinition, kind?: 'kubernetes' | 'webworker' | null) {
		if (kind === 'kubernetes') this.wf = new KubernetesWorkflowDefinition(wf);
		// if (kind === 'webworker') this.wf = new WebWorkerWorkflowDefinition(wf);
		else this.wf = undefined;
	}

	save() {
		if (!this.wf) return;
		console.log(this.wf.formGroup.value);
	}
}
