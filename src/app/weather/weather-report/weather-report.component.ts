import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { WeatherApiService } from 'src/app/service/weather-api.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
import * as moment from 'moment';
import { style } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
@Component({
  selector: 'app-weather-report',
  templateUrl: './weather-report.component.html',
  styleUrls: ['./weather-report.component.scss']
})
export class WeatherReportComponent implements OnInit  {

  current_weather: any;
  current_location: any;
  today_forecast: any[]=[];
  img: any;
  search_result: any=[];
  forecast_day:any=[]
  current_date=new Date().getDate()
  uv_value=0;
  show_default=false;
  
  @ViewChild('searchlocation')searchlocation!:ElementRef;

  unit: boolean=false;

  constructor( private _apiWeather:WeatherApiService,public router:Router ,private snackbar:MatSnackBar, private dialog: MatDialog){}
  
  ngOnInit(): void {

    
    this.dialog.open(LoaderComponent)
    
    let default_locatiion = JSON.parse(localStorage.getItem("location") || '[26.92,75.82]')
    //console.log(default_locatiion);
    
    this.weather_report_function(default_locatiion[0],default_locatiion[1]);

    this.unit=JSON.parse(localStorage.getItem('tempUnit')||'false')
    
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
        items: 4
      }
    },
    nav: true
  }

  weather_report_function(lat:number,lon:number) {
    this.dialog.open(LoaderComponent)
    this._apiWeather.user_city_weather(lat,lon).subscribe({
      next: (res: any) => {
        //console.log(res);
        this.current_weather = res.current;
        this.uv_value=res.current.uv
        this.current_location = res.location;
        
      },
      complete: () => {
        //console.log(Math.floor(this.current_weather?.air_quality?.pm2_5));
        this.next_days_forecast(lat,lon);
        this.createChartGauge();
        // this.uv_index_function()
        // this.dialog.closeAll()  
        this.search_result=[]
        // //console.log(  );
        // this.searchlocation.nativeElement.blur()
        document.getElementById("abc")?.blur()
        this.show_default=false
      }
    });
  }

  searching_data(event:any){
  
    let data=event.target.value
    if (data.length>2) {
      this.show_default=true
      this._apiWeather.search_weather(data).subscribe({
        next:(res:any)=>{
            //console.log(res);
            this.search_result=res
        },error:(err)=>{}
        ,complete:()=>{}
      })
    }
    else{
      this.search_result=[]
      this.show_default=false
    }
   
  }

user_current_location(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {

          // this.lat = position.coords.latitude;
          // this.lng = position.coords.longitude;
          // //console.log(this.lat);
          // //console.log(this.lng);
          this.city_weather(position.coords.latitude,position.coords.longitude)
        }
      },
        (error: any) =>{ 
          //console.log(error.message)
          this.snackbar.open(error.message,'',{
            duration: 3000,
          })
        });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  city_weather(lat:number,lon:number){
    //console.log(lat,lon);
    let my_data=[lat,lon]
    localStorage.setItem('location',JSON.stringify(my_data))

    this.weather_report_function(lat,lon);

  }

  next_days_forecast(lat:number,lon:number) {
    var now = moment();
    let day = now.add(8, 'days').format('DD');
    this._apiWeather.weather_timeline(day,lat,lon).subscribe({
      next: (res: any) => {
        // this.forecast_day=res.forecast.forecastday
        res.forecast.forecastday.shift();
        this.forecast_day = res.forecast.forecastday;
        //console.log(this.forecast_day);
      }, error: (err) => {
        //console.log(err);
      }, complete: () => {
        this.dialog.closeAll()
      }
    });
  }

  // AQI Cart
 
  createChartGauge(){
    const chart = Highcharts.chart('chart-gauge', {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: '75%',
        // backgroundColor: 'transparent'
        // backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgb(0 0 0 / 49%)'
    },
    title: {
      text: 'AQI Index',
      style:{color:'white'}
    },
    subtitle: {
      text: this.current_location?.localtime,
      align: 'center',
      style: {
        fontSize: '10px',
        color:'white'
    },
    },
    
      credits: {
        enabled: false,
      },
      pane: {
        startAngle: -90,
        endAngle: 89.9,
        background: null,
        center: ['50%', '75%'],
        size: '110%',
      },

      yAxis: {
        min: 0,
        max: 250,
        // tickPixelInterval: 52,
        tickPosition: 'inside',
        tickColor: 'transparent',
        // tickLength: 20,
        tickWidth: 2,
        minorTickInterval: null,
        labels: {
            distance: 20,
            style: {
                fontSize: '0px'
            },
            
        },
        
        lineWidth: 0,
        plotBands: [{
            from: 0,
            to: 50,
            color: 'lightgreen',
            thickness: 20,
            
        }, {
            from: 51,
            to: 100,
            color: 'yellow',
            thickness: 20
        }, {
            from: 101,
            to: 150,
            color: 'orange',
            thickness: 20
        },
        {
          from: 151,
          to: 200,
          color: 'red',
          thickness: 20
      },
      {
        from: 201,
        to: 250,
        color: 'purple',
        thickness: 20
    },
      ]
    },
      series: [{
        name: 'AQI ',
        data: [Math.floor(this.current_weather?.air_quality?.pm2_5)],
        tooltip: {
            valueSuffix: ' PM2.5'
        },
        dataLabels: {
            
            borderWidth: 0,
            color: (
                Highcharts.defaultOptions.title &&
                Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color
            ) || '#333333',
            style: {
                fontSize: '0px'
            }
        },
        dial: {
            radius: '80%',
            backgroundColor: 'black',
            baseWidth: 5,
            baseLength: '0%',
            rearLength: '0%'
        },
        pivot: {
            backgroundColor: 'black',
            radius: 3
        }

    }]
    } as any);
  }

  // UV Index Chart

  // uv_index_function(){

  //   const chart = Highcharts.chart('uv-index', {
  //     chart: {
  //       type: 'solidgauge',
  //       height: '160px',
  //       // backgroundColor: 'transparent'
  //       backgroundColor: 'rgba(255, 255, 255, 0.2)',
  //   },
  //   credits: {enabled: false},
  //   title: {
  //       text: 'Uv Index',
  //       style: {'font-family': 'Muli, Helvetica Neue, Arial, sans-serif', 'font-size': '16px','color':'white'}
  //   },
  //   pane: {
  //       startAngle: -90,
  //       endAngle: 90,
  //       background: {
  //           backgroundColor: 'white',
  //           innerRadius: '60%',
  //           outerRadius: '100%',
  //           shape: 'arc',
  //           borderColor: 'transparent',
  //       }
  //   },
  //   tooltip: {
  //       enabled: false
  //   },
  //   yAxis: {
  //       stops: [
  //           [.25, 'lightgreen'],
  //           [.50, 'yellow'],
  //           [.75, 'orange'],
  //           [1, 'red'],
  //           // [15, 'purple'],
  //       ],
  //       length: 5,
  //       lineWidth: 0,
  //       minorTicks: false,
  //       tickAmount: 0,
  //       tickColor: 'transparent',
  //       labels: {
  //           enabled: false,
  //       },
  //       min: 1,
  //       max: 15,

  //   },
  //   plotOptions: {
  //       solidgauge: {
  //           threshold: 0,
  //           dataLabels: {
  //               // style: {'fontSize': '', 'font-family': 'Muli, Helvetica Neue, Arial, sans-serif', 'fontWeight': 'light'},
  //               borderWidth: 0,
  //               valueSuffix: ' Ui '
  //           }
  //       }
  //   },
  //   series: [
  //       {
  //           data: [this.uv_value]
  //       }
  //   ]
  //   } as any);
  // }
 
  change_degree(event:any){
    console.log(event.target.checked);
    localStorage.setItem('tempUnit',event.target.checked)

    this.unit=JSON.parse(localStorage.getItem('tempUnit')||'false')
   }
}
