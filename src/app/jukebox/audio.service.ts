// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AudioService {

//   constructor() { }
// }


import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { songs } from './songsList';
import {songInfo } from './songInfo';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

    public audio: HTMLAudioElement;
    public currentSong: songInfo;
    public songsOrder: Array<number>;
    public idx: number;
    public timeElapsed: BehaviorSubject<string> = new BehaviorSubject('00:00');
    public timeRemaining: BehaviorSubject<string> = new BehaviorSubject('-00:00');
    public percentElapsed: BehaviorSubject<number> = new BehaviorSubject(0);
    public percentLoaded: BehaviorSubject<number> = new BehaviorSubject(0);
    public playerStatus: BehaviorSubject<string> = new BehaviorSubject('paused');

    constructor() { 
        this.idx = 0;
        this.songsOrder=[];
        for(let i=0;i<songs.length;i++){
            var temp = this.songsOrder.push(i);
        } 
        this.currentSong= songs[this.songsOrder[this.idx]];
        this.audio = new Audio(songs[this.idx].songURL);
        this.attachListeners();        
    }

    private attachListeners(): void {
        this.audio.addEventListener('timeupdate', this.calculateTime, false);
        this.audio.addEventListener('playing', this.setPlayerStatus, false);
        this.audio.addEventListener('pause', this.setPlayerStatus, false);
        this.audio.addEventListener('progress', this.calculatePercentLoaded, false);
        this.audio.addEventListener('waiting', this.setPlayerStatus, false);
        this.audio.addEventListener('ended', this.setPlayerStatus, false);
    }

    private calculateTime = (evt) => {
        let ct = this.audio.currentTime;
        let d = this.audio.duration;
        this.setTimeElapsed(ct);
        this.setPercentElapsed(d, ct);
        this.setTimeRemaining(d, ct);
    }

    private calculatePercentLoaded = (evt) => {
        if (this.audio.duration > 0) {
            for (var i = 0; i < this.audio.buffered.length; i++) {
                if (this.audio.buffered.start(this.audio.buffered.length - 1 - i) < this.audio.currentTime) {
                    let percent = (this.audio.buffered.end(this.audio.buffered.length - 1 - i) / this.audio.duration) * 100;
                    this.setPercentLoaded(percent);
                    break;
                }
            }
        }
    }

    private setPlayerStatus = (evt) => {
        switch (evt.type) {
            case 'playing':
                this.playerStatus.next('playing');
                break;
            case 'pause':
                this.playerStatus.next('paused');
                break;
            case 'waiting':
                this.playerStatus.next('loading');
                break;
            case 'ended':
                this.playerStatus.next('ended');
                this.playNext();
                break;
            default:
                this.playerStatus.next('paused');
                break;
        }
    }

    public getAudio(): HTMLAudioElement {
        return this.audio;
    }

    public setAudio(src: string): void {
        this.audio.src = src;
        this.playAudio();
    }

    public playAudio(): void {
        this.audio.play();
    }

    public shuffleList(): void {
        for(let i=this.songsOrder.length-1;i>0;i--){
            let j=Math.floor(Math.random() * (i+1));
            let temp = this.songsOrder[i];
            this.songsOrder[i]=this.songsOrder[j];
            this.songsOrder[j]=temp;
        }
        this.idx=-1;
        this.playNext();
    }

    public playNext(): void {
        this.idx = (this.idx+1)%songs.length;
        this.currentSong= songs[this.songsOrder[this.idx]];
        this.setAudio(songs[this.songsOrder[this.idx]].songURL);
    }

    public playPrev(): void {
        this.idx = (this.idx-1+songs.length)%songs.length;
        this.currentSong= songs[this.songsOrder[this.idx]];
        this.setAudio(songs[this.songsOrder[this.idx]].songURL);
    }

    public pauseAudio(): void {
        this.audio.pause();
    }

    public seekAudio(position:number): void {
        this.audio.currentTime = position;
    }

    private setTimeElapsed(ct: number): void {
        let seconds     = Math.floor(ct % 60),
            displaySecs = (seconds < 10) ? '0' + seconds : seconds,
            minutes     = Math.floor((ct / 60) % 60),
            displayMins = (minutes < 10) ? '0' + minutes : minutes;

        this.timeElapsed.next(displayMins + ':' + displaySecs);
    }

    private setTimeRemaining(d: number, t: number): void {
        let remaining;
        let timeLeft = d - t,
            seconds = Math.floor(timeLeft % 60) || 0,
            remainingSeconds = seconds < 10 ? '0' + seconds : seconds,
            minutes = Math.floor((timeLeft / 60) % 60) || 0,
            remainingMinutes = minutes < 10 ? '0' + minutes : minutes,
            hours = Math.floor(((timeLeft / 60) / 60) % 60) || 0;

            // remaining = (hours === 0)
        if (hours === 0) {
            remaining = '-' + remainingMinutes + ':' + remainingSeconds;
        } else {
            remaining = '-' + hours + ':' + remainingMinutes + ':' + remainingSeconds;
        }
        this.timeRemaining.next(remaining);
    }

    private setPercentElapsed(d: number, ct: number): void {
        this.percentElapsed.next(( Math.floor(( 100 / d ) * ct )) || 0 );
    }

    private setPercentLoaded(p): void {
        this.percentLoaded.next(parseInt(p, 10) || 0 );
    }

    public getPercentLoaded(): Observable<number> {
        return this.percentLoaded.asObservable();
    }

    public getPercentElapsed(): number {
        return this.percentElapsed.getValue();
    }

    public getTimeElapsed(): string {
        return this.timeElapsed.getValue();
    }

    public getTimeRemaining(): string {
        return this.timeRemaining.getValue();
    }

    public getPlayerStatus(): string {
        return this.playerStatus.getValue();
    }

    public toggleAudio(): void {
        (this.audio.paused) ? this.audio.play() : this.audio.pause();
    }


}