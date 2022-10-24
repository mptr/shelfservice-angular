import { plainToClassFromExist } from 'class-transformer';
import { Accept } from 'src/util/Accept.decorator';
import { WorkflowDefinitionList } from '../workflow/entities';

export class User {
	@Accept()
	given_name?: string;
	@Accept()
	family_name?: string;
	@Accept()
	email?: string;
	@Accept()
	preferred_username?: string;
	@Accept()
	profilePicture?: string;
	@Accept()
	id?: string;

	get name() {
		return `${this.given_name} ${this.family_name}`;
	}

	owns(workflow: WorkflowDefinitionList) {
		if (!Array.isArray(workflow.owners)) throw new Error('Cant check ownership of a workflow without owners list');
		return workflow.owners.map(o => o.id).includes(this.id);
	}

	constructor(data?: Partial<User>) {
		plainToClassFromExist(this, data);
	}
}
