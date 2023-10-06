import {  Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherApiService } from 'src/app/service/weather-api.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsWindbars from 'highcharts/modules/windbarb';
import * as moment from 'moment';
HighchartsMore(Highcharts);
HighchartsWindbars(Highcharts);
@Component({
  selector: 'app-today-weather-data',
  templateUrl: './today-weather-data.component.html',
  styleUrls: ['./today-weather-data.component.scss']
})
export class TodayWeatherDataComponent implements OnInit  {

  uv_value=0;
  sunrise_time=0
  sunset_time=0;
  winddirection: any=[];
  windspeed_data: any=[];
  
  constructor( private _apiWeather:WeatherApiService,public router:Router)
  {
    let now = moment(); 
    let date=now.format('yyyy-MM-DD');  
  }

  ngOnInit(): void {
    let default_locatiion = JSON.parse(localStorage.getItem("location") || '[26.92,75.82]')
    this.weather_report_function(default_locatiion[0],default_locatiion[1]);
  }




  weather_report_function(lat:number,lon:number) {
    this._apiWeather.user_city_weather(lat,lon).subscribe({
      next: (res: any) => {
        this.uv_value=res.current.uv
      },
      complete: () => {

        let now = moment(); 
        let date=now.format('yyyy-MM-DD');
    
        this._apiWeather.weather_astronomy(date,lat,lon).subscribe({
          next: (res: any) => {
            
            this.sunrise_time =Number( moment(res.astronomy.astro.sunrise, 'hh:mm A').format('HH'))
            this.sunset_time =Number( moment(res.astronomy.astro.sunset, 'hh:mm A').format('HH'))
            //console.log(this.sunrise_time);
            //console.log(this.sunset_time);
            this.weather_forecast_function()
          },
          complete: () => {
            this.uv_index_function();
            // this.sun_timinge()
          }
        });

      }
    });
  }

 



  // AQI
 
  uv_index_function(){

    const chart = Highcharts.chart('uv-index', {
      chart: {
        type: 'solidgauge',
        height: '100%',
        backgroundColor: 'green'
    },
    credits: {enabled: false},
    title: {
        text: 'Uv Index',
        style: {'font-family': 'Muli, Helvetica Neue, Arial, sans-serif', 'font-size': '36px','color':'white'}
    },
    pane: {
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: 'white',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc',
            borderColor: 'transparent',
        }
    },
    tooltip: {
        enabled: false
    },
    yAxis: {
        stops: [
            [.25, 'lightgreen'],
            [.50, 'yellow'],
            [.75, 'orange'],
            [1, 'red'],
            // [15, 'purple'],
        ],
        length: 5,
        lineWidth: 0,
        minorTicks: false,
        tickAmount: 0,
        tickColor: 'transparent',
        labels: {
            enabled: false,
        },
        min: 1,
        max: 15,

    },
    plotOptions: {
        solidgauge: {
            threshold: 0,
            dataLabels: {
                style: {'fontSize': '36px', 'font-family': 'Muli, Helvetica Neue, Arial, sans-serif', 'fontWeight': 'light'},
                y: -50,
                borderWidth: 0,
            }
        }
    },
    series: [
        {
            data: [this.uv_value]
        }
    ]
    } as any);
  }
 
  sun_timinge(){

    const chart = Highcharts.chart('sun-time', {
      chart: {
        type: 'solidgauge',
        height: '100%',
        backgroundColor: 'green'
    },
    credits: {enabled: false},
    title: {
      text: 'Sunrise and sunset',
      style: {'font-family': 'Muli, Helvetica Neue, Arial, sans-serif', 'font-size': '36px','color':'white'}
     },
    pane: {
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: 'white',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc',
            borderColor: 'transparent',
        }
    },
    tooltip: {
        enabled: false
    },
    yAxis: {
        stops: [
          
            [0, 'yellow'],
            
            // [.25, 'yellow'],
            // [.25, 'blue'],
            // [.25, 'grey'],
            // [15, 'purple'],
        ],
        length: 5,
        lineWidth: 0,
        minorTicks: false,
        tickAmount: 0,
        tickColor: 'transparent',
        labels: {
            enabled: false,
        },
        min: 4,
        max: this.sunset_time,

    },
    plotOptions: {
        solidgauge: {
            threshold: 0,
            dataLabels: {
                style: {'fontSize': '0px', 'font-family': 'Muli, Helvetica Neue, Arial, sans-serif', 'fontWeight': 'light'},
                y: -50,
                borderWidth: 0,
            }
        }
    },
    series: [
        {
            data: [new Date().getHours()]
            // data: [21]
        }
    ]
    } as any);
  }

  data = [
    [4.9, 246],
    [4.1, 242],
    [3.2, 262],
    [1.5, 284],
    [1.1, 294],
    [0.4, 192],
    [0.2, 30],
    [1.1, 110],
    [1.4, 112],
    [2.1, 132],
    [1.6, 134],
    [1.5, 128],
    [0.7, 91],
    [0.7, 275],
    [0.6, 341],
    [4.5, 236],
    [4.9, 241],
    [3.4, 234],
    [0.7, 260],
    [1.1, 274],
    [0.9, 327],
    [0.5, 336],
    [0.4, 331],
    [1.4, 157]
  ];

  wind_report(){
    const chart = Highcharts.chart('wind-report', {

      title: {
          text: 'Observed wind in Vik, 30. July 2022',
          align: 'left'
      },
  
      subtitle: {
          text: 'Source: ' +
              '<a href="https://www.yr.no/nb/historikk/graf/1-137598/Norge/Vestland/Vik/Vik%C3%B8yri?q=2022-07-30"' +
              'target="_blank">YR</a>',
          align: 'left'
      },
  
      xAxis: {
          type: 'datetime',
          offset: 40
      },
  
      yAxis: {
          title: {
              text: 'Wind speed (mp/h)'
          }
      },
  
  
      plotOptions: {
          series: {
              pointStart: Date.UTC(2023, 6, 29),
              pointInterval: 36e5
          }
      },
  
      series: [
      //   {
      //     type: 'windbarb',
      //     data: this.winddirection,
      //     name: 'Wind',
      //     color:'blue',
      //     showInLegend: false,
      //     tooltip: {
      //         valueSuffix: ' m/s'
      //     }
      // },
       {
          type: 'area',
          keys: ['y'], // wind direction is not used here
          data: this.windspeed_data,
          color: 'skyblue',
          fillColor: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                  [0, 'blue'],
                  [1,Highcharts.color('#6a6ae0b8').setOpacity(0.25).get()]
              ]
          },
          name: 'Wind speed',
          tooltip: {
              valueSuffix: ' mp/h'
          },
          states: {
              inactive: {
                  opacity: 1
              }
          }
      }]
  
  } as any);
  }
  
  weather_forecast_function(){
    let default_locatiion = JSON.parse(localStorage.getItem("location") || '[26.92,75.82]')

    this._apiWeather.weather_forecast(default_locatiion[0],default_locatiion[1]).subscribe({
      next:(res:any)=>{

         res.forecast.forecastday[0].hour.forEach((data:any)=>{
          this.windspeed_data.push(data.wind_mph)
          this.winddirection.push(data.wind_degree)

        })
        
      },error:(err)=>{

      },complete:()=>{
        this.wind_report()
      }
    })
  }

}