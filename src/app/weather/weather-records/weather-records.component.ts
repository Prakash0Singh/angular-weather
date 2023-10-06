import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { WeatherApiService } from 'src/app/service/weather-api.service';

@Component({
  selector: 'app-weather-records',
  templateUrl: './weather-records.component.html',
  styleUrls: ['./weather-records.component.scss']
})
export class WeatherRecordsComponent implements OnInit {
  default_locatiion:any=[];

  show_records=false;
  show_default=false;
  search_result: any=[];
  location_record: any;

  constructor( private _apiWeather:WeatherApiService,public router:Router,private dialog:MatDialog,private snackbar:MatSnackBar){
    this.default_locatiion = JSON.parse(localStorage.getItem("location") || '[26.92,75.82]')
  }

  minDate!:Date;
  maxDate!:Date ;
  myHolidayDates = [ new Date(),];
  weather_record:any=[];

    unit: boolean=false;

  ngOnInit(): void {

    this.unit=JSON.parse(localStorage.getItem('tempUnit')||'false')

    const d = new Date();
    // console.log(new Date(d.setDate(d.getDate()-366)).toLocaleDateString());
    for (let index = 1; index < 14; index++) {
      d.setDate(d.getDate() + 1);
      this.myHolidayDates.push(new Date(d))
    }

    this.minDate=new Date('1/1/2010')
    this.maxDate=new Date(d.setDate(d.getDate() + 299))

  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ["<i class='text-light bi bi-chevron-left'></i>", "<i class='text-light bi bi-chevron-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 4
      },
      940: {
        items: 5
      }
    },
    nav: true
  }




  myHolidayFilter = (d: any) => {
    const time = d?.toLocaleDateString();
    return !this.myHolidayDates.find(x => x.toLocaleDateString() == time);
  }

  user_pick_date(event:Date){
    this.show_records=false
    this.dialog.open(LoaderComponent)
    //console.log(event);
    let date=event.toLocaleDateString();

    let data=moment(date).format('YYYY-MM-DD');

    let current_date=new Date()
    // let user_date=event.getTime()

    if (current_date>event) {
      this._apiWeather.weather_history(data,this.default_locatiion[0],this.default_locatiion[1]).subscribe({
        next:(res:any)=>{
          //console.log(res);
          this.weather_record=res.forecast.forecastday[0];
          this.location_record=res.location
        },error:(err:any)=>{
          this.dialog.closeAll();
          this.snackbar.open('API key is limited to get history data. Please check our pricing page and upgrade to higher plan.','',{
            duration: 3000,
          })
        }
        ,complete:()=>{
          this.show_records=true
          //console.log(this.weather_record);
          this.dialog.closeAll()
        }
      })
    }
    else{
      // //console.log('Future');
      this._apiWeather.weather_futrue(data,this.default_locatiion[0],this.default_locatiion[1]).subscribe({
        next:(res:any)=>{
          this.weather_record=res.forecast.forecastday[0]
          this.location_record=res.location
        },error:(err:any)=>{
          this.dialog.closeAll();
          this.snackbar.open('API key is limited to get future data. Please check our pricing page and upgrade to higher plan.','',{
            duration: 3000,
          })
        }
        ,complete:()=>{
          this.show_records=true
          //console.log(this.weather_record);
          this.dialog.closeAll()
        }
      })

    }
  }

  searching_data(event:any){
  
    let data=event.target.value
    if (data.length>2) {
      this.show_default=true
      this._apiWeather.search_weather(data).subscribe({
        next:(res:any)=>{
            //console.log(res);
            this.search_result=res
        },error:(err)=>{
          this.dialog.closeAll();
          this.snackbar.open(err.message,'',{
            duration: 3000,
          })
        }
        ,complete:()=>{}
      })
    }
    else{
      this.search_result=[]
      this.show_default=false
    }
   
  }

  city_name(lat:number,lon:number){

    this.default_locatiion[0]=lat
    this.default_locatiion[1]=lon
    //console.log(this.default_locatiion);
  }

  user_current_location(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
 
          this.default_locatiion[0]=position.coords.latitude
          this.default_locatiion[1]=position.coords.longitude
          //console.log(this.default_locatiion);
        }
      },
        (error: any) =>{ 
          //console.log(error)
          this.snackbar.open(error.message,'',{
            duration: 3000,
          })
        });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  change_degree(event:any){
    console.log(event.target.checked);
    localStorage.setItem('tempUnit',event.target.checked)

    this.unit=JSON.parse(localStorage.getItem('tempUnit')||'false')
   }
}
