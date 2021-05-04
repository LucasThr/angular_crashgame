import { Component, OnInit } from '@angular/core';
import { from, Observable, of, TimeoutError } from 'rxjs';
import { Bet } from '../bet';
import { BetRecord } from '../bet';
import { Socket } from 'ngx-socket-io';
import { BetsService } from '../bets.service';
import { interval } from 'rxjs';
@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['../app.component.css'],
})
export class GraphicsComponent implements OnInit {
  money: number = 100;
  mise!: number;
  bets: BetRecord[] = [];
  // bet: Bet = { id: 1, value: 0 };
  time!: number;
  timer!: number;
  isCrash: boolean = false;
  isWithdraw: boolean = false;
  constructor(private betService:BetsService) {
    this.time = 1.0;
    // this.socket.on('test',(message:string="ok") => {
    //   console.log("ok")
    // })
  }

 
  start() {
    var crash: number;
    var max: number;
    this.isWithdraw = false;
    max = (Math.floor(Math.random() * (500 - 0) + 0) / 100) * 100;
    this.timer = window.setInterval(() => {
      if (this.time > 0 && this.time < 2) {
        this.time = Number(
          Number(Math.round((this.time += 0.01) * 100) / 100).toFixed(2)
        );
      }
      if (this.time < 5 && this.time >= 2) {
        this.time = Number(
          Number(Math.round((this.time += 0.04) * 100) / 100).toFixed(2)
        );

        max = max / 2;
      }
      if (this.time < 100 && this.time >= 5) {
        this.time = Number(
          Number(Math.round((this.time += 0.08) * 100) / 100).toFixed(2)
        );
        max = max / 2;
      }
      crash = (Math.floor(Math.random() * (max - 1) + 1) / 100) * 100;
      console.log(crash);
      if (crash == 1) {
        clearTimeout(this.timer);
        this.isCrash = true;
        if(!this.isWithdraw){
        this.addBet(this.mise, this.time,true);
        }
      }
    }, 100);
  }

  stop() {
    clearTimeout(this.timer);
  }

   MyObservable:Observable<any> = of(1, 2, 3);

  // Create observer object
  // myObserver:Observable<string> = {
  //   next: x => console.log('Observer got a next value: ' + x),
  //   error: err => console.error('Observer got an error: ' + err),
  //   complete: () => console.log('Observer got a complete notification'),
  // };

  // // Execute with the observer object
  // myObservable.subscribe(myObserver);


// Create an Observable that will publish a value on an interval
  //  secondsCounter = interval(1000);
  // Subscribe to begin publishing values
  //  subscription = this.secondsCounter.subscribe(n =>
  //   console.log(`It's been ${n + 1} seconds since subscribing!`));

  onMise(): void {
    // this.secondsCounter.subscribe()
    this.betService.start()
    if (!this.mise) return;
    if((this.money-this.mise)<0) return;
    this.money=this.fixedDecimal(this.money- this.mise);
    this.isCrash = false;
    this.time = 1.0;
    this.start();
  }

  addMoney(time: number) {
    // Number(this.money+= time * this.mise).toFixed(2);
    this.money= Number((this.money+ time * this.mise).toFixed(2));

  }

  addBet(initial: number, value: number,isLose?:boolean) {
    this.bets.push({ initial: initial, value: value, gain: isLose ? 0 :this.fixedDecimal(initial * value)  });
  }

  onRetrait(): void {
    if (this.isWithdraw) return;
    this.isWithdraw = true;
    console.log('RETRAIT');
    this.addMoney(this.time);
    this.addBet(this.mise, this.time);
  }

  fixedDecimal(number: number): number {
    return Number(number.toFixed(2));
  }

  
  ngOnInit(): void {
    this.betService
        .getMessage()
        // .subscribe(msg => {
        //   console.log('Incoming msg', msg);
        // });
  }
}
