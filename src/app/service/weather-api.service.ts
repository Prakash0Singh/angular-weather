import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {

  constructor(private http:HttpClient,private router:Router) { }
  key='717dabdcd13140cb9b162910232606'

  search_weather(name:string){
    return this.http.get(`https://api.weatherapi.com/v1/search.json?key=${this.key}&q=${name}`)
  }

  user_city_weather(lat:number,lon:number){
    return this.http.get(`https://api.weatherapi.com/v1/current.json?key=${this.key}&q=${lat},${lon}&aqi=yes`)
  }
  
  weather_forecast(lat:number,lon:number){
    return this.http.get(`https://api.weatherapi.com/v1/forecast.json?key=${this.key}&q=${lat},${lon} &days=1&aqi=yes&alerts=yes`)
  }

  sport_news(){
    return this.http.get(`https://api.weatherapi.com/v1/sports.json?key=${this.key}&q=Jaipur`)
  }

  weather_timeline(day:string,lat:number,lon:number){
    return this.http.get(`https://api.weatherapi.com/v1/forecast.json?key=${this.key}&q=${lat},${lon}&days=${day}&aqi=no&alerts=no`)
  }

  weather_astronomy(date:string,lat:number,lon:number){
    return this.http.get(`https://api.weatherapi.com/v1/astronomy.json?key=${this.key}&q=${lat},${lon}&dt=${date}`)
  }

  weather_futrue(date:string,lat:number,lon:number){
    return this.http.get(`https://api.weatherapi.com/v1/future.json?key=${this.key}&q=${lat},${lon}&dt=${date}`)
  }

  weather_history(date:string,lat:number,lon:number){
    return this.http.get(`https://api.weatherapi.com/v1/history.json?key=${this.key}&q=${lat},${lon}&dt=${date}`)
  }
}
