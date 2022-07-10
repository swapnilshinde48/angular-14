import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../shared/http.service';
import {
  HttpClient,
  HttpHeaders,
  HttpClientModule,
} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HomeService } from '../shared/home.service';
import { catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  title = 'UIdeveloper';
  private selectedFile: File;
  viewedArr = [];
  videoArr = [];

  files: any[];
  subsGetUsers: Subscription;
  head = {} as any;
  //use to set the token and content type as a header for each request
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.httpService.getToken()}`,
    }),
  };
  httpOptionforupload = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.httpService.getToken()}`,
    }),
  };
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private httpService: HttpService,
    private router: Router,
    private homeService: HomeService
  ) {
    this.httpService.getAuthRequestOptions();
  }

  ngOnInit(): void {
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
      });
  }
  binarydata: any;
  Upload(event) {
    this.selectedFile = event.target.files;
    let name = event.target.files[0].name;
    this.onUpload(event.target.files[0]);
    const filereader = new FileReader();
    filereader.onload = async (event) => {
      await this.uploadDocument(name, event.target.result);
    };
    filereader.readAsArrayBuffer(event.target.files[0]);
  }
  videoRead(event) {
    if (this.viewedArr.filter((s) => s.id == event.target.id).length == 0) {
      this.viewedArr.push(
        this.videoArr.filter((s) => s.id == event.target.id)[0]
      );
    }
    var myVideo: any = document.getElementById(event.target.id);
    // if (myVideo.paused) myVideo.play();
    // else myVideo.pause();
    this.router.navigateByUrl('/videoplayer/' + event.target.id);
    //location.reload();
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

  deleteFile(file) {
    this.http
      .get<any>('https://graph.microsoft.com/v1.0/me/drive', this.httpOptions)
      .subscribe((res) => {
        this.http
          .delete<any>(
            'https://graph.microsoft.com/v1.0/me/drives/' +
              res.id +
              '/items/' +
              file.id,
            this.httpOptions
          )
          .subscribe((resd) => {
            this.files = resd.value;
            console.log(this.files);
          });
      });
  }
  uploadbtnClick() {
    this.uploadFile(this.selectedFile, this.binarydata);
  }
  uploadDocument(name, file) {
    this.binarydata = file;
  }
  onUpload(files) {
    var uploadUrl;
    var file = files;
    var homeService = this.homeService;
    var i = file.name.lastIndexOf('.');
    var fileType = file.name.substring(i + 1);
    var fileName = file.name.substring(0, i);
    this.getUploadSession(fileType, fileName).subscribe(function (data) {
      uploadUrl = data.uploadUrl;
      homeService.uploadChunks.call(homeService, file, uploadUrl);
    });
  }
  getUploadSession(fileType, name): Observable<any> {
    const token = window.sessionStorage.getItem('accessToken');
    const endpoint = `https://graph.microsoft.com/v1.0/me/drive/root:/${name}.${fileType}:/createUploadSession`;
    const body = {
      item: {
        '@microsoft.graph.conflictBehavior': 'rename',
      },
    };
    var options = this.httpService.getAuthRequestOptions();
    return this.http.post(endpoint, body, options).pipe(
      map((response: Response) => {
        return response;
      })
    );
  }
  uploadFile(file, binarydata) {
    let body = new Uint8Array(binarydata);
    let uIntBody = body.buffer;
    this.http
      .get<any>('https://graph.microsoft.com/v1.0/me/drive', this.httpOptions)
      .subscribe((res) => {
        console.log(res, file[0]);
        let url =
          'https://graph.microsoft.com/v1.0/me/drives/' +
          res.id +
          '/items/01LCCXMTZAF5UQV3ZVPRGJYCDEFSDAVIVD:/' +
          file[0].name +
          ':/contents';
        this.http
          .put<any>(url, uIntBody, this.httpOptionforupload)
          .subscribe((resd) => {
            this.files = resd.value;
            console.log(this.files);
          });
      });
  }
  openFolder(file) {
    console.log(file);
    this.http
      .get<any>('https://graph.microsoft.com/v1.0/me/drive', this.httpOptions)
      .subscribe((res) => {
        this.http
          .get<any>(
            'https://graph.microsoft.com/v1.0/me/drives/' +
              res.id +
              '/items/' +
              file.id +
              '/children',
            this.httpOptions
          )
          .subscribe((resd) => {
            this.files = resd.value;
            console.log(this.files);
          });
      });
  }
}
