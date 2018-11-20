import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { LoginService } from '../login/login.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

import { CloudVisionService } from '../service/cloud-vision.service';


import { BusinessCard } from '../business-card';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchConditionEmail: string = '';
  businessCardSearchedByEmail: BusinessCard;

  businessCards: BusinessCard[];
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  useCamera: boolean = false;
  imageTaken: boolean = false;
  trigger: Subject<void> = new Subject<void>();
  webcamImage: WebcamImage = null;
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    //width: {ideal: 1024},
    //height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];



  businessCardsRef: any;

  constructor(
    private cloudVisionService: CloudVisionService,
    private authService: LoginService,
    private firebaseDB: AngularFireDatabase
  ) {
    this.businessCardsRef =
      this.firebaseDB.list<BusinessCard>(`businessCards/${this.authService.userUid}`)
   }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    // this.dbService.getAllBusinessCards().subscribe(
    //   (results) => {
    //     console.log('Get all business cards from Firebase successfully!');
    //     console.log(results);

    //     this.businessCards = results;
    //   },
    //   (error) => {
    //     console.log('Failed to get all business cards from Firebase!');
    //   }
    // );
  }

  textDetection() {
    if (this.imageTaken !== true) {
      return;
    }

    let imageUri = this.webcamImage.imageAsBase64;
    //let imageUri = 'https://lh3.googleusercontent.com/-sQsJlPZIPTc/ThwkpQeADtI/AAAAAAAAAuI/MWUH1I_7X0A/w530-h289-n/patrick-bateman-card.png';
    
    // detect text in the image
    this.cloudVisionService.detectTextInImage(imageUri).subscribe(
      (response) => {
        console.log('Detected text in the image successfully!');
        console.log(response);
        
        // parse the original text to get a business card object
        let businessCard = this.getBusinessCardInfo(response);
        
        // add the business card to Firebase
        //this.addBusinessCardToDB(businessCard);

      
      },
      (error) => {
        console.log('Failed to detect text in the image!');
        console.log(error);
      }
    );

  }

  getBusinessCardInfo(imageTexts: any[]): BusinessCard {
    let businessCard = new BusinessCard();
    let imageFullText = imageTexts[0].description;
  
    let businessCard1 = new BusinessCard();
    businessCard1 =  this.parseBusinessCard(imageFullText);
    // parse phone number
    businessCard.phoneNumber = this.parsePhoneNumber(imageFullText);
    // parse email
     businessCard.email = this.parseEmail(imageFullText);
    // // image uri base64
     businessCard.imageUri = this.webcamImage.imageAsDataUrl;




  
   console.log(businessCard.email);
    

    return businessCard;
  }

  parseBusinessCard(businessCardText: string): BusinessCard {
    const businessCard = new BusinessCard();
    let text = businessCardText;
    const { emails, stringWithoutEmails } = this.removeEmails(text);
    text = stringWithoutEmails;
    const { phoneNumbers, stringWithoutPhoneNumbers } = this.removePhoneNumbers(text);
    text = stringWithoutPhoneNumbers;
    const { postalCode, stringWithoutPostalCode } = this.removePostcodes(text);
    text = stringWithoutPostalCode;
    console.log(emails);
    console.log(phoneNumbers);
    console.log(postalCode);
    console.log(text);
    // this.languageService.getRelevantStrings(text, { 'LOCATION': '', 'PERSON': '' });
    return null;
  }

  postcodeRegex =
    /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/i;
 removePostcodes = str => {
    const { matches, cleanedText } = this.removeByRegex(str, this.postcodeRegex);
    return { postalCode: matches.map(s => s.toUpperCase()), stringWithoutPostalCode: cleanedText };
};

// Regex from https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
phoneNumberRegex =
    /\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*/;
removePhoneNumbers = str => {
    const {matches, cleanedText } = this.removeByRegex(str, this.phoneNumberRegex);
    return {phoneNumbers: matches, stringWithoutPhoneNumbers: cleanedText };
}


removeByRegex = (str, regex) => {
  const matches = [];
  const cleanedText = str
      .split('\n')
      .filter(line => {
          const hits = line.match(regex);
          if (hits != null) {
              matches.push(hits[0]);
              return false;
          }
          return true;
      })
      .join('\n');
  return { matches, cleanedText };
};

   emailRegex =
    /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
 removeEmails = str => {
    const { matches, cleanedText } = this.removeByRegex(str, this.emailRegex);
    return { emails: matches, stringWithoutEmails: cleanedText };
};
 
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info("received webcam image", webcamImage);
    this.webcamImage = webcamImage;
    this.imageTaken = true;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log("active device: " + deviceId);
    this.deviceId = deviceId;
  }



  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
  

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  parseEmail(imageFullText: string): string {
    // regular expression for email
    let emailRegexp = new RegExp(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'g');

    let matchResult = emailRegexp.exec(imageFullText);
    
    return matchResult !== null ? matchResult[0] : '';
  }

  parsePhoneNumber(imageFullText: string): string {
  
    let phoneNumberRegexp = new RegExp(/((\d)\D)?(\(?(\d\d\d)\)?)?\D(\d\d\d)\D(\d\d\d\d)/, 'g');

    let matchResult = phoneNumberRegexp.exec(imageFullText);
    
    return matchResult !== null ? matchResult[0] : '';
  }

  searchByEmail() {
    if (this.searchConditionEmail.length === 0) {
      return;
    }

    this.businessCardSearchedByEmail = this.businessCards.find(businessCard => {
      return businessCard.email === this.searchConditionEmail;
    });


  }

  addHistory(userBehaviorMsg: string) {
    
  }

  // addBusinessCardToDB(businessCard: BusinessCard) {
    
    addBusinessCard(businessCard: BusinessCard) {
      this.businessCardsRef.push({ [businessCard.getKey()]: businessCard });
    }
    // this.dbService.addBusinessCard(businessCard).then(
    //   (_) => {
    //     console.log('Added the business card to Firebase successfully!');      
    //   },
    //   (error) => {
    //     console.log('Failed to add the business card to Firebase!');
    //   }
    // );
  // }
}
