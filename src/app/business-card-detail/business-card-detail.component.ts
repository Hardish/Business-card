import { Component, OnInit, Input } from '@angular/core';


import { BusinessCard } from '../business-card';

@Component({
  selector: 'app-business-card-detail',
  templateUrl: './business-card-detail.component.html',
  styleUrls: ['./business-card-detail.component.css']
})
export class BusinessCardDetailComponent implements OnInit {

  @Input() businessCard: BusinessCard;
  @Input() searchBy: string;

  constructor() { }

  ngOnInit() {
  }

}
