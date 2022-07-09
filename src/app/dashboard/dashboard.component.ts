import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  title = 'UIdeveloper';
  private selectedFile: File;
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
  constructor() {
    //  this.videoArr = this.processArray(this.videoArr);
  }

  ngOnInit(): void {}
  Upload(event) {
    this.selectedFile = event.target.files;
    console.log(event.target.files);
  }
  videoRead(event) {
    if (this.viewedArr.filter((s) => s.id == event.target.id).length == 0) {
      this.viewedArr.push(
        this.videoArr.filter((s) => s.id == event.target.id)[0]
      );
    }
    //  this.viewedArr = this.processArray(this.viewedArr);
    var myVideo: any = document.getElementById(event.target.id);
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
  }
  processArray(arr: any) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].hashid = this.getnewHashid();
    }
    return arr;
  }
  getnewHashid() {
    return Math.floor(Math.random() * 100);
  }
}
