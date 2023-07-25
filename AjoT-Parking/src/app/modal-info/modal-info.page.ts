import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.page.html',
  styleUrls: ['./modal-info.page.scss'],
})
export class ModalInfoPage implements OnInit {

  @Input() brightness: any;
  @Input() id: number = 0;
  @Input() belowThresholdAfterExceedancePerHour: any;
  chart: any;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    let brightnessCtx: any = document.getElementById('brightnessLineChart') as HTMLElement;

    var brightnessData = {
      labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      datasets: [
        {
          label: 'Brightness average',
          data: this.brightness,
          backgroundColor: 'blue',
          borderColor: 'lightblue',
          fill: false,
          lineTension: 0,
          radius: 5,
        }
      ],
    };

    let nStallOccupiedPerHourCtx: any = document.getElementById('nStallOccupiedPerHourLineChart') as HTMLElement;
    var nStallOccupiedPerHourData = {
      labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      datasets: [
        {
          label: 'Number of times a stall has been occupied',
          data: this.belowThresholdAfterExceedancePerHour,
          backgroundColor: 'red',
          borderColor: 'orange',
          fill: false,
          lineTension: 0,
          radius: 5,
        }
      ],
    };

    //options
    var options1 = {
      responsive: true,
      title: {
        display: true,
        position: 'top',
        text: 'Line Graph',
        fontSize: 18,
        fontColor: '#111',
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#333',
          fontSize: 16,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        }
      }
    };

    var brightnessChart = new Chart(brightnessCtx, {
      type: 'line',
      data: brightnessData,
      options: options1,
    });

    var options2 = {
      responsive: true,
      title: {
        display: true,
        position: 'top',
        text: 'Line Graph',
        fontSize: 18,
        fontColor: '#111',
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#333',
          fontSize: 16,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,    
          }
        }
      }
    };


    var chart2 = new Chart(nStallOccupiedPerHourCtx, {
      type: 'line',
      data: nStallOccupiedPerHourData,
      options: options2,
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
