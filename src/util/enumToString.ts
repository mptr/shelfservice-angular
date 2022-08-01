// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const enumToString = <T = string>(x: any): T[] => {
	return Object.values(x).filter(x => typeof x !== 'number') as T[];
};
