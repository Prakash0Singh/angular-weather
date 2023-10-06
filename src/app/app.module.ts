import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './weather/homepage/homepage.component';
import { PageNotFoundComponent } from './weather/page-not-found/page-not-found.component';
import { WeatherReportComponent } from './weather/weather-report/weather-report.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { CarouselModule } from 'ngx-owl-carousel-o';
// Material Import's
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { TodayForecastComponent } from './weather/today-forecast/today-forecast.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgCircleProgressModule } from 'ng-circle-progress';
import {MatTooltipModule} from '@angular/material/tooltip';
import { LoaderComponent } from './loader/loader.component'
import {MatDialogModule} from '@angular/material/dialog'
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    PageNotFoundComponent,
    WeatherReportComponent,
    TodayForecastComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CarouselModule,
    HighchartsChartModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      showImage: true,
      showBackground: false,
      lazy: true
    }),
    MatTooltipModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
