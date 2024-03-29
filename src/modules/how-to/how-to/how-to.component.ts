import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'src/services/message/Message';
import { MessageService } from 'src/services/message/message.service';

type ExampleKeys = 'new-kubernetes' | 'new-webworker' | 'datelogger-kubernetes' | 'datelogger-webworker';

@Component({
	selector: 'app-how-to',
	templateUrl: './how-to.component.html',
	styleUrls: ['./how-to.component.scss'],
})
export class HowToComponent {
	private readonly examples: Record<ExampleKeys, Record<string, unknown>> = {
		'new-kubernetes': {
			kind: 'kubernetes',
		},
		'new-webworker': {
			kind: 'webworker',
		},
		'datelogger-kubernetes': {
			name: 'DateLogger (k8s)',
			description: 'Dieser Workflow gibt sekündlich das Datum aus.',
			icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnDQpzdHlsZT0idHJhbnNmb3JtLW9yaWdpbjpjZW50ZXI7dHJhbnNmb3JtOnNjYWxlKDAuNyk7Ig0KPg0KCTxwYXRoIGQ9Ik0xMjYuNzU5LDQ0Ny44OThjLTI1LjU4OSwwLTQ2LjQyNi0yMC44MzUtNDYuNDI2LTQ2LjQ0MlYxOTguNzI2aDMyOS43MjJ2MTA4LjA5N2MxMi4xNjgsMi45NSwyMy41NjEsNy44LDMzLjkyMSwxNC4yMw0KCQlMNDQzLjUzMiw5Ni41NGMtMC4wMy0xNS4zODEtMTIuNTA3LTI3LjgzMy0yNy44ODgtMjcuODMzaC0wLjAxMlY1Ny4yOGMwLTI2Ljk4NC0yMS45NS00OC45MTctNDkuNTY3LTQ4LjkxNw0KCQljLTI2Ljk2MiwwLTQ4LjkwNywyMS45MzItNDguOTA3LDQ4LjkxN3YxMS40MjZoLTIyLjcyMlY1Ny4yOGMwLTI2Ljk4NC0yMS45NS00OC45MTctNDkuNTcyLTQ4LjkxNw0KCQljLTI2Ljk1OCwwLTQ4LjkwOCwyMS45MzItNDguOTA4LDQ4LjkxN3YxMS40MjZoLTIyLjcyMlY1Ny4yOGMwLTI2Ljk4NC0yMS45NDUtNDguOTE3LTQ5LjU2Ny00OC45MTcNCgkJYy0yNi45NjIsMC00OC44OTQsMjEuOTMyLTQ4Ljg5NCw0OC45MTd2MTEuNDI2Yy0xNS4zODYsMC0yNy44NjYsMTIuNDYtMjcuODksMjcuODQ1bC0wLjQ3MywzMDQuOTA1DQoJCWMwLDQ0LjMxNSwzNi4wNDgsODAuMzU2LDgwLjM0OCw4MC4zNTZoMTU2LjEyM2MtNi40MTYtMTAuMzYzLTExLjIxNy0yMS43NjQtMTQuMTY1LTMzLjkxNUgxMjYuNzU5eiBNMzUxLjA2LDU3LjI3OQ0KCQljMC04LjI2Nyw2LjcyMS0xNS4wMDQsMTUuNjQ2LTE1LjAwNGM4LjI3LDAsMTQuOTg2LDYuNzM3LDE0Ljk4NiwxNS4wMDR2NTcuNTkyYzAsOC4yNjgtNi43MTcsMTQuOTg2LTE0Ljk4NiwxNC45ODZoLTAuNjQyDQoJCWMtOC4yODMsMC0xNS4wMDQtNi43MTktMTUuMDA0LTE0Ljk4NlY1Ny4yNzl6IE0yMjkuODY0LDU3LjI3OWMwLTguMjY3LDYuNzM1LTE1LjAwNCwxNS42NDYtMTUuMDA0DQoJCWM4LjI2NSwwLDE1LjAwNCw2LjczNywxNS4wMDQsMTUuMDA0djU3LjU5MmMwLDguMjY4LTYuNzM5LDE0Ljk4Ni0xNS4wMDQsMTQuOTg2aC0wLjY2Yy04LjI1MSwwLTE0Ljk4Ni02LjcxOS0xNC45ODYtMTQuOTg2VjU3LjI3OQ0KCQl6IE0xMDguNjgxLDU3LjI3OWMwLTguMjY3LDYuNzE3LTE1LjAwNCwxNS42MzItMTUuMDA0YzguMjgzLDAsMTQuOTg2LDYuNzM3LDE0Ljk4NiwxNS4wMDR2NTcuNTkyDQoJCWMwLDguMjY4LTYuNzAzLDE0Ljk4Ni0xNC45ODYsMTQuOTg2aC0wLjY0NmMtOC4yNywwLTE0Ljk4Ni02LjcxOS0xNC45ODYtMTQuOTg2VjU3LjI3OXoiLz4NCgk8cGF0aCBkPSJNMzgyLjQwMSwzMzcuMjk1Yy00NS45MjQsMC04My4xNTIsMzcuMjM5LTgzLjE1Miw4My4xNjhjMCw0NS45NDEsMzcuMjI4LDgzLjE3NCw4My4xNTIsODMuMTc0DQoJCWM0NS45NTksMCw4My4xODgtMzcuMjMyLDgzLjE4OC04My4xNzRDNDY1LjU4OSwzNzQuNTM0LDQyOC4zNjEsMzM3LjI5NSwzODIuNDAxLDMzNy4yOTV6IE00MTQuNzYxLDQ0MC40OTINCgkJYy0xLjYxLDIuNTk2LTQuMzg0LDQuMDE0LTcuMjE5LDQuMDE0Yy0xLjUxNywwLTMuMDYtMC40MDQtNC40NDctMS4yNjZsLTI1LjE0LTE1LjU2N2MtMi41MTMtMS41NDYtNC4wMjktNC4yNjktNC4wMjktNy4yMXYtNDkuMTUNCgkJYzAtNC42ODgsMy44MDUtOC40ODQsOC40NzYtOC40ODRjNC43MDcsMCw4LjQ5NCwzLjc5Niw4LjQ5NCw4LjQ4NHY0NC40MjhsMjEuMTI5LDEzLjA3Nw0KCQlDNDE1Ljk4Niw0MzEuMjgzLDQxNy4yMjksNDM2LjUwMyw0MTQuNzYxLDQ0MC40OTJ6Ii8+DQoJPHBhdGggZD0iTTI2OC4xMTksMzE3Ljg2OXYtMC41MjVjMjAuNzI1LTcuMjYsMzAuODQzLTIxLjIzOSwzMC44NDMtMzkuMTI2YzAtMjMuMDUyLTE5Ljk0OS00MS45NzEtNTUuOTY1LTQxLjk3MQ0KCQljLTE3LjU1NCwwLTM0LjA5NCw0LjA0OS00NS4xMzksOS4wMWMtNC4wNjcsMS44MjctNi4xOTMsNi4zNTgtNC45ODIsMTAuNjQ5bDMuMTYsMTEuMjAzYzAuNjk2LDIuNDY3LDIuNDExLDQuNTIxLDQuNzE0LDUuNjQ2DQoJCWMyLjMwMywxLjEyNiw0Ljk3NywxLjIxNCw3LjM1MiwwLjI1YzcuMzkzLTMuMDAxLDE2LjkwOC01LjY1NywyNi4wNzktNS42NTdjMTYuNjAyLDAsMjQuODg0LDcuNTE4LDI0Ljg4NCwxNy42MTMNCgkJYzAsMTQuMjUzLTE2Ljg1NywxOS4xNzctMzAuMDcxLDE5LjQzNWgtNi4yNzJjLTQuOTc0LDAtOS4wMDYsNC4wMzItOS4wMDYsOS4wMDZ2MTAuMjJjMCw0Ljk3NCw0LjAzMiw5LjAwNiw5LjAwNiw5LjAwNmg3LjA2Mg0KCQljMTcuMzU1LDAsMzMuOTM5LDcuNTI3LDMzLjkzOSwyNC4xMDhjMCwxMi42OTEtMTAuMzY0LDIyLjU0NC0zMC44MjksMjIuNTQ0Yy0xMC45MzQsMC0yMS44NTMtMy4xMTgtMjkuOTIxLTYuMjUzDQoJCWMtMi4zNzktMC45MjUtNS4wNC0wLjc5NS03LjMxOSwwLjM1NGMtMi4yOCwxLjE0OS0zLjk3MywzLjIxMS00LjY0Myw1LjY3NWwtMy4zODUsMTIuNDUyYy0xLjE2Nyw0LjI5MywwLjk3MSw4Ljc3NCw1LjAzNiwxMC41ODINCgkJYzEwLjQ0NSw0LjY0MywyNS42ODIsOC4yNzYsNDMuMDY4LDguMjc2YzExLjUyMiwwLDIxLjcwOC0xLjY5MiwzMC42MTktNC41NzdjMy4zMDMtMjYuMTA0LDE1LjE0OC00OS41NjksMzIuNzI4LTY3LjQxNg0KCQlDMjkyLjYxMywzMjcuNTQ1LDI4MS4yMzksMzIwLjIyMywyNjguMTE5LDMxNy44Njl6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==',
			parameterFields: [
				{
					name: 'GREET',
					displayName: 'Nachricht',
					description: 'Textnachricht wird dem Nutzer zu Beginn angezeigt.',
					required: false,
					hint: '',
					hide: false,
					exampleValue: 'Heute ist ein guter Tag',
					multiline: false,
					password: false,
					kind: 'string',
				},
				{
					name: 'COUNT',
					displayName: 'Anzahl',
					description: 'Wie häufig soll das Datum ausgegeben werden?',
					required: true,
					hint: 'Das Datum wird sekündlich ausgegeben',
					hide: false,
					min: '1',
					max: '100',
					step: '1',
					kind: 'number',
				},
			],
			image: 'alpine',
			command: [
				'/bin/sh',
				'-c',
				'echo "Hallo $IDENTITY_FIRSTNAME"; echo "$GREET"; for i in `seq 1 $COUNT`; do date; sleep 1; done',
			],
			kind: 'kubernetes',
		},
		'datelogger-webworker': {
			name: 'DateLogger (js)',
			description: 'Dieser Workflow gibt sekündlich das Datum aus.',
			icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnDQpzdHlsZT0idHJhbnNmb3JtLW9yaWdpbjpjZW50ZXI7dHJhbnNmb3JtOnNjYWxlKDAuNyk7Ig0KPg0KCTxwYXRoIGQ9Ik0xMjYuNzU5LDQ0Ny44OThjLTI1LjU4OSwwLTQ2LjQyNi0yMC44MzUtNDYuNDI2LTQ2LjQ0MlYxOTguNzI2aDMyOS43MjJ2MTA4LjA5N2MxMi4xNjgsMi45NSwyMy41NjEsNy44LDMzLjkyMSwxNC4yMw0KCQlMNDQzLjUzMiw5Ni41NGMtMC4wMy0xNS4zODEtMTIuNTA3LTI3LjgzMy0yNy44ODgtMjcuODMzaC0wLjAxMlY1Ny4yOGMwLTI2Ljk4NC0yMS45NS00OC45MTctNDkuNTY3LTQ4LjkxNw0KCQljLTI2Ljk2MiwwLTQ4LjkwNywyMS45MzItNDguOTA3LDQ4LjkxN3YxMS40MjZoLTIyLjcyMlY1Ny4yOGMwLTI2Ljk4NC0yMS45NS00OC45MTctNDkuNTcyLTQ4LjkxNw0KCQljLTI2Ljk1OCwwLTQ4LjkwOCwyMS45MzItNDguOTA4LDQ4LjkxN3YxMS40MjZoLTIyLjcyMlY1Ny4yOGMwLTI2Ljk4NC0yMS45NDUtNDguOTE3LTQ5LjU2Ny00OC45MTcNCgkJYy0yNi45NjIsMC00OC44OTQsMjEuOTMyLTQ4Ljg5NCw0OC45MTd2MTEuNDI2Yy0xNS4zODYsMC0yNy44NjYsMTIuNDYtMjcuODksMjcuODQ1bC0wLjQ3MywzMDQuOTA1DQoJCWMwLDQ0LjMxNSwzNi4wNDgsODAuMzU2LDgwLjM0OCw4MC4zNTZoMTU2LjEyM2MtNi40MTYtMTAuMzYzLTExLjIxNy0yMS43NjQtMTQuMTY1LTMzLjkxNUgxMjYuNzU5eiBNMzUxLjA2LDU3LjI3OQ0KCQljMC04LjI2Nyw2LjcyMS0xNS4wMDQsMTUuNjQ2LTE1LjAwNGM4LjI3LDAsMTQuOTg2LDYuNzM3LDE0Ljk4NiwxNS4wMDR2NTcuNTkyYzAsOC4yNjgtNi43MTcsMTQuOTg2LTE0Ljk4NiwxNC45ODZoLTAuNjQyDQoJCWMtOC4yODMsMC0xNS4wMDQtNi43MTktMTUuMDA0LTE0Ljk4NlY1Ny4yNzl6IE0yMjkuODY0LDU3LjI3OWMwLTguMjY3LDYuNzM1LTE1LjAwNCwxNS42NDYtMTUuMDA0DQoJCWM4LjI2NSwwLDE1LjAwNCw2LjczNywxNS4wMDQsMTUuMDA0djU3LjU5MmMwLDguMjY4LTYuNzM5LDE0Ljk4Ni0xNS4wMDQsMTQuOTg2aC0wLjY2Yy04LjI1MSwwLTE0Ljk4Ni02LjcxOS0xNC45ODYtMTQuOTg2VjU3LjI3OQ0KCQl6IE0xMDguNjgxLDU3LjI3OWMwLTguMjY3LDYuNzE3LTE1LjAwNCwxNS42MzItMTUuMDA0YzguMjgzLDAsMTQuOTg2LDYuNzM3LDE0Ljk4NiwxNS4wMDR2NTcuNTkyDQoJCWMwLDguMjY4LTYuNzAzLDE0Ljk4Ni0xNC45ODYsMTQuOTg2aC0wLjY0NmMtOC4yNywwLTE0Ljk4Ni02LjcxOS0xNC45ODYtMTQuOTg2VjU3LjI3OXoiLz4NCgk8cGF0aCBkPSJNMzgyLjQwMSwzMzcuMjk1Yy00NS45MjQsMC04My4xNTIsMzcuMjM5LTgzLjE1Miw4My4xNjhjMCw0NS45NDEsMzcuMjI4LDgzLjE3NCw4My4xNTIsODMuMTc0DQoJCWM0NS45NTksMCw4My4xODgtMzcuMjMyLDgzLjE4OC04My4xNzRDNDY1LjU4OSwzNzQuNTM0LDQyOC4zNjEsMzM3LjI5NSwzODIuNDAxLDMzNy4yOTV6IE00MTQuNzYxLDQ0MC40OTINCgkJYy0xLjYxLDIuNTk2LTQuMzg0LDQuMDE0LTcuMjE5LDQuMDE0Yy0xLjUxNywwLTMuMDYtMC40MDQtNC40NDctMS4yNjZsLTI1LjE0LTE1LjU2N2MtMi41MTMtMS41NDYtNC4wMjktNC4yNjktNC4wMjktNy4yMXYtNDkuMTUNCgkJYzAtNC42ODgsMy44MDUtOC40ODQsOC40NzYtOC40ODRjNC43MDcsMCw4LjQ5NCwzLjc5Niw4LjQ5NCw4LjQ4NHY0NC40MjhsMjEuMTI5LDEzLjA3Nw0KCQlDNDE1Ljk4Niw0MzEuMjgzLDQxNy4yMjksNDM2LjUwMyw0MTQuNzYxLDQ0MC40OTJ6Ii8+DQoJPHBhdGggZD0iTTI2OC4xMTksMzE3Ljg2OXYtMC41MjVjMjAuNzI1LTcuMjYsMzAuODQzLTIxLjIzOSwzMC44NDMtMzkuMTI2YzAtMjMuMDUyLTE5Ljk0OS00MS45NzEtNTUuOTY1LTQxLjk3MQ0KCQljLTE3LjU1NCwwLTM0LjA5NCw0LjA0OS00NS4xMzksOS4wMWMtNC4wNjcsMS44MjctNi4xOTMsNi4zNTgtNC45ODIsMTAuNjQ5bDMuMTYsMTEuMjAzYzAuNjk2LDIuNDY3LDIuNDExLDQuNTIxLDQuNzE0LDUuNjQ2DQoJCWMyLjMwMywxLjEyNiw0Ljk3NywxLjIxNCw3LjM1MiwwLjI1YzcuMzkzLTMuMDAxLDE2LjkwOC01LjY1NywyNi4wNzktNS42NTdjMTYuNjAyLDAsMjQuODg0LDcuNTE4LDI0Ljg4NCwxNy42MTMNCgkJYzAsMTQuMjUzLTE2Ljg1NywxOS4xNzctMzAuMDcxLDE5LjQzNWgtNi4yNzJjLTQuOTc0LDAtOS4wMDYsNC4wMzItOS4wMDYsOS4wMDZ2MTAuMjJjMCw0Ljk3NCw0LjAzMiw5LjAwNiw5LjAwNiw5LjAwNmg3LjA2Mg0KCQljMTcuMzU1LDAsMzMuOTM5LDcuNTI3LDMzLjkzOSwyNC4xMDhjMCwxMi42OTEtMTAuMzY0LDIyLjU0NC0zMC44MjksMjIuNTQ0Yy0xMC45MzQsMC0yMS44NTMtMy4xMTgtMjkuOTIxLTYuMjUzDQoJCWMtMi4zNzktMC45MjUtNS4wNC0wLjc5NS03LjMxOSwwLjM1NGMtMi4yOCwxLjE0OS0zLjk3MywzLjIxMS00LjY0Myw1LjY3NWwtMy4zODUsMTIuNDUyYy0xLjE2Nyw0LjI5MywwLjk3MSw4Ljc3NCw1LjAzNiwxMC41ODINCgkJYzEwLjQ0NSw0LjY0MywyNS42ODIsOC4yNzYsNDMuMDY4LDguMjc2YzExLjUyMiwwLDIxLjcwOC0xLjY5MiwzMC42MTktNC41NzdjMy4zMDMtMjYuMTA0LDE1LjE0OC00OS41NjksMzIuNzI4LTY3LjQxNg0KCQlDMjkyLjYxMywzMjcuNTQ1LDI4MS4yMzksMzIwLjIyMywyNjguMTE5LDMxNy44Njl6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==',
			parameterFields: [
				{
					name: 'GREET',
					displayName: 'Nachricht',
					description: 'Textnachricht wird dem Nutzer zu Beginn angezeigt.',
					required: false,
					hint: '',
					hide: false,
					exampleValue: 'Heute ist ein guter Tag',
					multiline: false,
					password: false,
					kind: 'string',
				},
				{
					name: 'COUNT',
					displayName: 'Anzahl',
					description: 'Wie häufig soll das Datum ausgegeben werden?',
					required: true,
					hint: 'Das Datum wird sekündlich ausgegeben',
					hide: false,
					min: 1,
					max: 100,
					step: 1,
					kind: 'number',
				},
			],
			script: `const sleep = (seconds) => new Promise(r => setTimeout(r, seconds * 1000))

const main = async ({ IDENTITY_FIRSTNAME, GREET, COUNT }) => {
	console.log("Hallo " + IDENTITY_FIRSTNAME);
	console.log(GREET);
	for (let i = 0; i < Number(COUNT); i++) {
		console.log(new Date());
		await sleep(1);
	}
}

await main(self.variables);
`,
			kind: 'webworker',
		},
	};

	constructor(private readonly router: Router, private readonly msgService: MessageService) {}

	protected goto(dst: ExampleKeys) {
		if (this.examples[dst]['name'])
			this.msgService.push(
				new Message(
					'Beispiel geladen',
					`Der Beispielworkflow ${this.examples[dst]['name']} wurde in den Editor geladen.`,
					'success',
				),
			);
		this.router.navigate(['/shelf/new'], {
			state: { workflow: this.examples[dst] },
		});
	}

	k8sExampleVisible = false;
	webworkerExampleVisible = false;
}
