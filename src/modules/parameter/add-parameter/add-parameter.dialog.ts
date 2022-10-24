import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Parameter, ParameterType } from '../entities';

@Component({
	selector: 'app-add-parameter-dialog',
	templateUrl: 'add-parameter.dialog.html',
	styles: [
		`
			.grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				grid-gap: 1em;
				grid-auto-rows: 1fr;
				button {
					mat-icon {
						transform: scale(1.5);
						display: block;
						margin: 1em auto 0;
						margin-bottom: 0.5em;
					}
				}
			}
			.wide {
				grid-column: span 2;
			}
			@media (max-width: 600px) {
				.grid {
					grid-template-columns: 1fr;
				}
				.wide {
					grid-column: span 1;
				}
			}
		`,
	],
})
export class AddParameterDialogComponent {
	constructor(public dialogRef: MatDialogRef<AddParameterDialogComponent>) {}

	options = [
		{
			kind: ParameterType.STRING,
			label: 'String',
			desc: 'Ein- oder mehrzeiliger Text. Validierbar mit regulärem Ausdruck',
		},
		{
			kind: ParameterType.SELECT,
			label: 'Auswahl',
			desc: 'Auswahl aus vorgegebenen Optionen',
		},
		{
			kind: ParameterType.NUMBER,
			label: 'Zahl',
			desc: 'Zahl, Validierbar mit Minimal- und Maximalwert',
		},
		{
			kind: ParameterType.BOOLEAN,
			label: 'Ja/Nein',
			desc: 'Ja/Nein als Checkbox',
		},
		{
			kind: ParameterType.DATE,
			label: 'Datum',
			desc: 'Datumsangabe',
		},
	].map(x => ({
		...x,
		icon: Parameter.ctor(x.kind).iconName,
	}));

	select(pType: ParameterType): void {
		this.dialogRef.close(pType);
	}
	cancel() {
		this.dialogRef.close();
	}
}
