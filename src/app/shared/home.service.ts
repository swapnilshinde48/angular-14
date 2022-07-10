import { Injectable } from '@angular/core';
import { HttpService } from '../shared/http.service';
import * as request from 'superagent';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  url = 'https://graph.microsoft.com/v1.0';
  file = 'demo1.xlsx';
  table = 'Table1';
  async uploadChunks(file, uploadUrl) {
    const homeService = this;
    var reader = new FileReader();
    var position = 0;
    var chunkLength = 320 * 1024;
    console.log('File size is: ' + file.size);
    var continueRead = true;
    while (continueRead) {
      var chunk;
      try {
        continueRead = true;
        try {
          let stopB = position + chunkLength;
          console.log(
            'Sending Asynchronous request to read in chunk bytes from position ' +
              position +
              ' to end ' +
              stopB
          );
          chunk = await this.readFragmentAsync(file, position, stopB);
          console.log(
            'UploadChunks: Chunk read in of ' + chunk.byteLength + ' bytes.'
          );
          if (chunk.byteLength > 0) {
            continueRead = true;
          } else {
            break;
          }
          console.log('Chunk bytes received = ' + chunk.byteLength);
        } catch (e) {
          console.log('Bytes Received from readFragmentAsync:: ' + e);
          break;
        }
        // Try to upload the chunk.
        try {
          console.log('Request sent for uploadFragmentAsync');
          let res: any;
          res = await homeService.uploadChunk(
            chunk,
            uploadUrl,
            position,
            file.size
          );
          if (res[0] != 202 && res[0] != 201 && res[0] != 200)
            throw 'Put operation did not return expected response';
          if (res[0] === 201 || res[0] === 200) {
            console.log(
              'Reached last chunk of file.  Status code is: ' + res[0]
            );
            continueRead = false;
          } else {
            console.log('Continuing - Status Code is: ' + res[0]);
            position = Number(res[1].nextExpectedRanges[0].split('-')[0]);
          }

          console.log('Response received from uploadChunk.');
          console.log('Position is now ' + position);
        } catch (e) {
          console.log('Error occured when calling uploadChunk::' + e);
        }
        //
      } catch (e) {
        continueRead = false;
      }
    }
    location.reload();
  }
  readFragmentAsync(file, startB, stopB) {
    var frag: any;
    const reader = new FileReader();
    console.log('startBytes :' + startB + ' stopBytes :' + stopB);
    var blob = file.slice(startB, stopB);
    reader.readAsArrayBuffer(blob);
    return new Promise((resolve, reject) => {
      reader.onloadend = (event) => {
        console.log('onloadend called  ' + reader.result?.toString());
        if (reader.readyState == reader.DONE) {
          frag = reader.result;
          resolve(frag);
        }
      };
    });
  }

  // Upload each chunk using PUT
  uploadChunk(chunk, uploadURL, position, totalLength) {
    //: Observable<any> {
    let max = position + chunk.byteLength - 1;
    let contentLength = position + chunk.byteLength;
    console.log(chunk.byteLength);
    return new Promise((resolve, reject) => {
      console.log('uploadURL:: ' + uploadURL);
      try {
        console.log('Just before making the PUT call to uploadUrl.');
        let crHeader = `bytes ${position}-${max}/${totalLength}`;
        console.log('Content-Range header being set is : ' + crHeader);
        request
          .put(uploadURL)
          .set({ 'Content-Range': crHeader })
          .send(chunk)
          .end((err, res) => {
            if (err) {
              console.error(err);
              reject(err);
              return;
            }
            console.log(res.status);
            console.log(res.body);
            resolve([res.status, res.body]);
          });
      } catch (e) {
        console.log('exception inside uploadFragmentAsync::  ' + e);
        reject(e);
      }
    });
  }
}
