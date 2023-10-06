import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherApiService } from '../service/weather-api.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  unit:any;
constructor(public router:Router,private _apiWeather:WeatherApiService) {}

ngOnInit(){
  this.unit=JSON.parse(localStorage.getItem('tempUnit')||'true')
}



}
