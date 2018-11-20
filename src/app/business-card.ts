export class BusinessCard {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  extraText: string = '';
  imageUri: string = '';
  
  getKey() 
  {
    return Date +this.firstName + this.lastName;
}
}