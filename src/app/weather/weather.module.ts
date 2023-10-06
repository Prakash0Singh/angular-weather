import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherRoutingModule } from './weather-routing.module';
import { WeatherComponent } from './weather.component';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatIconModule} from '@angular/material/icon';
import { SportsNewsComponent } from './sports-news/sports-news.component';
import { WeatherRecordsComponent } from './weather-records/weather-records.component';
import { TodayWeatherDataComponent } from './today-weather-data/today-weather-data.component'
import {MatCardModule} from '@angular/material/card'
import {MatExpansionModule} from '@angular/material/expansion'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    WeatherComponent,
    SportsNewsComponent,
    WeatherRecordsComponent,
    TodayWeatherDataComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    WeatherRoutingModule,
    HighchartsChartModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    CarouselModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ]
})
export class WeatherModule { }
