import { Component,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { WeatherApiService } from 'src/app/service/weather-api.service';

@Component({
  selector: 'app-sports-news',
  templateUrl: './sports-news.component.html',
  styleUrls: ['./sports-news.component.scss']
})
export class SportsNewsComponent implements OnInit {
  news: any;

  panelOpenState = false;
  constructor( private _apiWeather:WeatherApiService,public router:Router,private dialog:MatDialog){}

  ngOnInit(): void {
    this.dialog.open(LoaderComponent)
    this._apiWeather.sport_news().subscribe({
      next:(res:any)=>{
        //console.log(res);
        this.news=res
      },error:(err)=>{

      },complete:()=>{
        this.dialog.closeAll()
      }
    })
  }

}
