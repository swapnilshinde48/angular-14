import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../shared/http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  commentList: any = [];
  videoFrom = {} as FormGroup;
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.videoFrom = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });
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
  closeResult: string;
  open(content, id) {
    var myVideo: any = document.getElementById(id);
    myVideo.pause();
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          var myVideo: any = document.getElementById(id);
          myVideo.pause();
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          var myVideo: any = document.getElementById(id);
          myVideo.pause();
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnInit(): void {}

  videoRead(event, content) {
    if (this.viewedArr.filter((s) => s.id == event.target.id).length == 0) {
      this.viewedArr.push(
        this.videoArr.filter((s) => s.id == event.target.id)[0]
      );
    }
    var myVideo: any = document.getElementById(event.target.id);
    // if (myVideo.play)
    myVideo.pause();
    this.open(content, event.target.id);
    // else myVideo.pause();
  }
  submit() {
    if (this.videoFrom.valid) {
      this.commentList.push(this.videoFrom.controls.comment.value);
      this.modalService.dismissAll();
      this.videoFrom.reset();
    }
  }
  get videoFormControl() {
    return this.videoFrom.controls;
  }
}
