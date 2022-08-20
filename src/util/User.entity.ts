import { Accept } from './Accept.decorator';

export class User {
	@Accept()
	preferred_username?: string;
	@Accept()
	given_name?: string;
	@Accept()
	family_name?: string;
	@Accept()
	profile_picture?: string;
}
