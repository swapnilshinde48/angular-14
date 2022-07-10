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
  videoArr = [
    {
      id: 1,
      path: 'http://localhost:4200/assets/Pexels%20Videos%202764118.mp4',
    },
    {
      id: 2,
      path: 'http://localhost:4200/assets/production ID_4763824.mp4',
    },
  ];
  Id: number;
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.Id = this.route.snapshot.params.Id;
    this.viewedArr.push(this.videoArr.filter((s) => s.id == this.Id)[0]);
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
