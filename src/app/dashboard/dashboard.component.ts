import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../shared/http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    //  this.videoArr = this.processArray(this.videoArr);
    this.httpService.getAuthRequestOptions();
  }

  ngOnInit(): void {
    this.http
      .get<any>(
        'https://graph.microsoft.com/v1.0/me/drive/root/children',
        this.httpOptions
      )
      .subscribe((res) => {
        this.files = res.value;
        console.log(this.files);
      });
  }
  binarydata: any;
  Upload(event) {
    this.selectedFile = event.target.files;
    console.log(event.target.files);
    let name = event.target.files[0].name;
    let formData = new FormData();
    formData.append('myfile', event.target.files[0], name);
    this.uploadDocument(name, formData);

    const filereader = new FileReader();
    filereader.onload = async (event) => {
      // await this.uploadDocument(name, event.target.result);
    };
    filereader.readAsArrayBuffer(event.target.files[0]);
  }
  videoRead(event) {
    if (this.viewedArr.filter((s) => s.id == event.target.id).length == 0) {
      this.viewedArr.push(
        this.videoArr.filter((s) => s.id == event.target.id)[0]
      );
    }
    //  this.viewedArr = this.processArray(this.viewedArr);
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
    console.log(name, file);
    this.binarydata = file;
  }
  // Doesn't work
  uploadFile(file, binarydata) {
    //   // this.http.put<any>('https://graph.microsoft.com/v1.0/me/drives/'+ res.id +'/items/'+file.id+'/content'
    //   this.http.get<any>('https://graph.microsoft.com/v1.0/me/drives/'+ res.id +'/items/'+ file.id +'/content', this.httpOptions)
    //   // this.http.put<any>('https://graph.microsoft.com/v1.0/me/drives/res.id'+'root:/Home/FileB.txt:/content', this.httpOptions)

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
          .put<any>(url, binarydata, this.httpOptionforupload)
          .subscribe((resd) => {
            this.files = resd.value;
            console.log(this.files);

            // localStorage.setItem('credential','')
          });
      });
  }
  //this function gets called when someone click on the folder
  openFolder(file) {
    console.log(file);
    //this will goto the main drive and gets the drive id so that we can access the sub folders using that drive id
    this.http
      .get<any>('https://graph.microsoft.com/v1.0/me/drive', this.httpOptions)
      .subscribe((res) => {
        //here we will use the drive id and access the sub folders
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
