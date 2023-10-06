import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherComponent } from './weather.component';
import { WeatherReportComponent } from './weather-report/weather-report.component';
import { TodayForecastComponent } from './today-forecast/today-forecast.component';
import { SportsNewsComponent } from './sports-news/sports-news.component';
import { WeatherRecordsComponent } from './weather-records/weather-records.component';
import { TodayWeatherDataComponent } from './today-weather-data/today-weather-data.component';

const routes: Routes = [
  { path: '', component: WeatherComponent,children:[
    {path:'',redirectTo:'weather-report',pathMatch:'full'},
    {path:'weather-report',component:WeatherReportComponent},
    {path:'today-forecast/:id',component:TodayForecastComponent},
    // {path:'air-quality',component:TodayWeatherDataComponent},
    {path:'weather-record',component:WeatherRecordsComponent},
    {path:'sports-news',component:SportsNewsComponent},
    
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeatherRoutingModule { }
