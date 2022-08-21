import { LOCALE_ID, NgModule } from '@angular/core';
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
registerLocaleData(localeDe, 'de-DE', localeDeExtra);

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
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
