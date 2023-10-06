import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { WeatherApiService } from 'src/app/service/weather-api.service';

@Component({
  selector: 'app-today-forecast',
  templateUrl: './today-forecast.component.html',
  styleUrls: ['./today-forecast.component.scss']
})
export class TodayForecastComponent implements OnInit {
  
  location='';
  today_weather_data:any=[]
  today_forecast: any;
  today_data:any=[];
  latitude: any;
  longitude: any;
  feels_like: any[]=[];
  pressure: any=[]
  precipitations: any=[];
  wind: any=[]
  my_location= "iaskfklasdlkjflkakj";
  more_details: any
  astro_details: any;
  dew_points:any=[]
  heat_index: any=[];
  last_update: any;
  winddirection:any=[];
  rain_chance: any=[];
  today_alerts: any=[];
  date=new Date()
  unit: boolean=false;

  constructor(private activateRoute:ActivatedRoute,private _apiWeather:WeatherApiService,private dialog:MatDialog) {}

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  ngOnInit(){

    this.dialog.open(LoaderComponent)
    
  this.unit=JSON.parse(localStorage.getItem('tempUnit')||'false')

  this.location=this.activateRoute.snapshot.params['id'] 
  const quadinates=(this.location.split('/'));

  this.latitude=Number(quadinates[0])
  this.longitude=Number(quadinates[1])



  this.weather_forecast_function()
  }

  weather_forecast_function(){
    this._apiWeather.weather_forecast(this.latitude,this.longitude).subscribe({
      next:(res:any)=>{
        //console.log(res.alerts);
        this.today_alerts=res.alerts.alert

        this.my_location=res.location.name+','+res.location.country;
        this.last_update=res.location.localtime

        this.more_details=res.forecast.forecastday[0].day
        this.astro_details=res.forecast.forecastday[0].astro
        this.today_weather_data=res.forecast.forecastday[0].hour;

   
         res.forecast.forecastday[0].hour.forEach((data:any)=>{
          if (this.unit) {
            this.today_data.push(data.temp_f)
          }
          else{
            this.today_data.push(data.temp_c)
          }
          // this.today_data.push(data.temp_c)
          this.wind.push([data.wind_mph,data.wind_degree])
          this.rain_chance.push(data.cloud)
        })
        
      },error:(err)=>{

      },complete:()=>{
 
        console.log(this.wind)

        this.wind_report()
        // this.temprature_report();
        this.chance_of_rain_report()
        this.temp_report()
        
        this.dialog.closeAll()
        
      }
    })
  }


wind_report(){

  const chart = Highcharts.chart('wind-report', {

    chart:{
        // backgroundColor: 'transparent',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    title: {
        text: this.my_location,
        align: 'left'
    },
    subtitle:{
      text:this.last_update+' , (Wind Chart)',
      align:'left'
    },
    xAxis: {
        type: 'datetime',
        offset: 40,
    },

    yAxis: {
        title: {
            text: 'Wind speed (mp/h)'
        },
        visible:false
    },


    plotOptions: {
        series: {
            pointStart: Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()),
            pointInterval: 36e5
        }
    },

    series: [
      {
        type: 'windbarb',
        data: this.wind,
        name: 'Wind',
        color: '#003760',
        showInLegend: false,
        tooltip: {
          valueSuffix: ' m/s'
        }
      },
     {
        type: 'area',
        keys: ['y'], // wind direction is not used here
        marker: {
          enabled: false
        },
        data: this.wind,
        color: '#3333ff',
        fillColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0.1, y2: 1 },
            stops: [
                [0, '#1a1aff'],
                [1,Highcharts.color('#9999ff').setOpacity(0.25).get()]
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
        },
        
    }]

} as any);
}

// temprature_report(){
//   const chart = Highcharts.chart('temprature-report',
//    {   
//       chart: {
//         zoomType: 'xy',
//         backgroundColor: 'rgba(255, 255, 255, 0.2)',
//         // backgroundColor: 'white',
//     },
    
//     title: {
//         text:this.my_location,
//         align: 'left'
//     },
//     subtitle: {
//         text: this.last_update+' , (Temprature Chart)',
//         align: 'left'
//     },
//     tooltip: {
//       shared: true,
//       useHTML: true,
//       headerFormat:
//           '<small>'+new Date().toDateString()+' - {point.x}</small><br>' 
    
//     },
//     xAxis:{
//      categories:["1 AM","2 AM","3 AM","4 AM","5 AM","6 AM","7 AM","8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM","9 PM","10 PM","11 PM","12 AM"],
//      crosshair: true,
//          visible:false
//     },
    
//     yAxis: [
//       { // temperature axis
//       title: {
//           text: null
//       },
//       labels: {
//           format: '{value}°',
//           style: {
//               fontSize: '10px'
//           },
//           x: -3
//       },
//       plotLines: [{ // zero plane
//           value: 0,
//           color: '#BBBBBB',
//           width: 1,
//           zIndex: 2
//       }],
//       maxPadding: 0.3,
//       // minRange: 8,
//       // tickInterval: 1,
//       gridLineColor: 'rgba(128, 128, 128, 0.1)'
    
//     }
//   ],
    
//     series: [{
//       name: 'Temperature',
//       data: this.today_data,
//       type: 'line',
//       marker: {
//           enabled: false,
//           states: {
//               hover: {
//                   enabled: true
//               }
//           }
//       },
//       tooltip: {
//           pointFormat: `<span style="color:{point.color}">\u25CF</span> ' +
//               '{series.name}: <b>{point.y}</b><br/>`
//       },
//       zIndex: 1,
//       color: '#FF3333',
//       negativeColor: '#48AFE8'
//     },
//   ]
// } as any);

// }

chance_of_rain_report(){
  const chart = Highcharts.chart('change-of-rain-report',
  {   
    chart:{
      // backgroundColor: 'transparent',
      type: 'area',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
    title: {
      text: this.my_location,
      align: 'left'
  },
  subtitle:{
    text:this.last_update+' , (Cloud cover In Sky)',
    align:'left'
  },

  yAxis: {
    title: {
        text: 'Cloud Cover %'
    },
    visible:false
},

  xAxis: {
      accessibility: {
          rangeDescription: 'Range: 0 to 24'
      },
 
        type: 'datetime',
  },


  plotOptions: {
    area: {
      marker: {
          enabled: false,
          symbol: 'circle',
          radius: 2,
          states: {
              hover: {
                  enabled: true
              }
          }
      }
  },
    series: {
        pointStart: Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()),
        pointInterval: 36e5,
        label: {
          connectorAllowed: true
        },
    },
},

  series: [{
    name: 'Clouds',
    color:'#5978bdb3',
    fillColor: {
      linearGradient: { x1: 0, x2: 0, y1: 0.1, y2: 1 },
      stops: [
          [0, '#5978bdb3'],
          [1,Highcharts.color('#9999ff').setOpacity(0.25).get()],
      ]
  },
    label: {
      connectorAllowed: true
    },
      data: this.rain_chance
  }],   
  } as any);
}

temp_report(){
  const chart = Highcharts.chart('temp-report', {
    chart:{
        // backgroundColor: 'transparent',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    title: {
        text: this.my_location,
        align: 'left'
    },
    subtitle:{
      text:this.last_update+' , (Temprature Chart)',
      align:'left'
    },
    xAxis: {
        type: 'datetime',
        offset: 40,
    },

    yAxis: {
        title: {
            text: '°C'
        },
        visible:false
    },


    plotOptions: {
        series: {
            pointStart: Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()),
            pointInterval: 36e5,
        },
    },

    series: [
     {
        type: 'area',
        keys: ['y'], 
        data: this.today_data,
        color: '#ff3333',
        fillColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0.1, y2: 1 },
            stops: [
                [0, '#ff4d4d'],
                [1,Highcharts.color('#ffcccc').setOpacity(0.25).get()]
            ]
        },
        name: 'Temprature',
        tooltip: {
            valueSuffix: `${this.unit?'°F':'°C'}`
        },
        states: {
            inactive: {
                opacity: 1
            }
        },
        marker: {
          enabled: false
      },
    }
    
  ]

} as any);
}


}
