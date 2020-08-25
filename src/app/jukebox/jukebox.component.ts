import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AudioService } from './audio.service';

@Component({
  selector: 'app-jukebox',
  templateUrl: './jukebox.component.html',
  styleUrls: ['./jukebox.component.scss']
})
export class JukeboxComponent implements OnInit {

  @ViewChild("documentSection", {static: false})
    private documentSection: ElementRef;
    private progressBarWidth: number;
    public ngAfterViewInit(): void {
        this.progressBarWidth = this.documentSection.nativeElement.offsetWidth;
    }

  constructor(public audioService : AudioService) { }

  ngOnInit() {
  }

  setBarWidth() {
    let style = {
      'width' : this.audioService.getPercentElapsed()+'%'
    }
    return style;
  }

  get image() {
    return this.audioService.currentSong.albumCoverURL;
  }

  seekSong(event:any){
    let updateWidth = Math.floor((event.offsetX/this.progressBarWidth)*this.audioService.audio.duration);
    this.audioService.seekAudio(updateWidth);
  }
}
