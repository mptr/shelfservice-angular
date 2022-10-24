import { Accept } from 'src/util/Accept.decorator';

export class WebWorkerResultDto {
	@Accept()
	log = '';

	@Accept()
	result = false;
}
