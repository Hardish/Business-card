import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { VisionKey } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudVisionService {

  /* 'https://vision.googleapis.com/v1/images:annotate?key=${environment.CSC436}' */
  cloudVisionApiBaseUrl = 'https://vision.googleapis.com/v1/images:annotate?';
  cloudVisionApiKeyParam = `key=${VisionKey}`;

  constructor(private http: HttpClient) {

  }

  detectTextInImage(imageUri: string): Observable<any> {
    const request: any = {
      'requests': [
        {
          'image': {
            'content': imageUri

          },
          'features': [
            {
              'type': 'TEXT_DETECTION',
              'maxResults': 1,
            }
          ]
        }
      ]
    };
    
    let apiUrl = `${this.cloudVisionApiBaseUrl}${this.cloudVisionApiKeyParam}`;

    return this.http.post(apiUrl, request).pipe(
      map(response => response['responses'][0]['textAnnotations'])
  
    );

  }


}
