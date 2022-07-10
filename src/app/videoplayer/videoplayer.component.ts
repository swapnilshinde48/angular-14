import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../shared/http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss'],
})
export class VideoplayerComponent implements OnInit {
  title = 'UIdeveloper';
  viewedArr = [];
  videoArr = [];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.httpService.getToken()}`,
    }),
  };
  Id: number;
  files: any[];
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.Id = this.route.snapshot.params.Id;
    this.videoArr = [];
    this.http
      .get<any>(
        'https://graph.microsoft.com/v1.0/me/drive/root/children',
        this.httpOptions
      )
      .subscribe((res) => {
        this.files = res.value;
        for (let i = 0; i < res.value.length; i++) {
          if (!!res.value[i].file) {
            if (res.value[i].file.mimeType == 'video/mp4')
              this.videoArr.push(res.value[i]);
          }
        }

        this.viewedArr.push(this.videoArr.filter((s) => s.id == this.Id)[0]);
      });
  }

  ngOnInit(): void {}

  videoRead(event) {
    if (this.viewedArr.filter((s) => s.id == event.target.id).length == 0) {
      this.viewedArr.push(
        this.videoArr.filter((s) => s.id == event.target.id)[0]
      );
    }
    var myVideo: any = document.getElementById(event.target.id);
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
  }
}
