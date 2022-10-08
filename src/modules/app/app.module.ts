import { Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from '../auth/auth.module';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageItemComponent } from './messages/message-item/message-item.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ShelfModule } from '../shelf/shelf.module';
import { WorkflowModule } from '../workflow/workflow.module';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { WorkflowLogModule } from '../workflow-log/workflow-log.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { HowToModule } from '../how-to/how-to.module';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Injectable()
class MyMatPaginatorIntl extends MatPaginatorIntl {
	override itemsPerPageLabel = 'Einträge pro Seite';
	override nextPageLabel = 'Nächste Seite';
	override previousPageLabel = 'Vorherige Seite';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	override getRangeLabel = (page: any, pageSize: any, length: any) => {
		if (length === 0 || pageSize === 0) {
			return '0 von ' + length;
		}
		length = Math.max(length, 0);
		const startIndex = page * pageSize;
		const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
		return startIndex + 1 + ' - ' + endIndex + ' von  ' + length;
	};
}

@NgModule({
	declarations: [
		AppComponent,
		NavComponent,
		FooterComponent,
		MessagesComponent,
		MessageItemComponent,
		SidebarComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		AuthModule,
		ShelfModule,
		WorkflowModule,
		WorkflowLogModule,
		HowToModule,
		MatSidenavModule,
		MatIconModule,
		MatCardModule,
		MatMenuModule,
		MatToolbarModule,
		MatButtonModule,
	],
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
		{ provide: LOCALE_ID, useValue: 'de-DE' },
		{
			provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
			useValue: {
				showDelay: 500,
				hideDelay: 0,
				touchendHideDelay: 0,
			},
		},
		{ provide: MatPaginatorIntl, useClass: MyMatPaginatorIntl },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
