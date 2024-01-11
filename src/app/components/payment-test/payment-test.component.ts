import { Component, Directive, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  exactLengthValidator,
  validateEcuadorianDocumentId,
} from '../../Validators/validators';
import '../../../assets/js/indexPagoPlux.js';
import { PaymentData } from '../../models/paymentData';

// import * as indexPagoPlux from '../../../assets/js/indexPagoPlux.js';

declare var iniciarDatos: any;
declare var reload: any;

@Component({
  selector: 'app-payment-test',
  templateUrl: './payment-test.component.html',
  styleUrl: './payment-test.component.css',
})
export class PaymentTestComponent implements OnInit {

  paymentForm!: FormGroup;

  constructor(private paymentData: PaymentData){}

  data = this.paymentData.data;

  slideNumber_keyFilter(event: any): void {
    // Check if the key code is between 48 and 57 (ASCII codes for digits 0 to 9)
    if (
      !((event.charCode >= 48 && event.charCode <= 57) || event.charCode === 46)
    ) {
      event.preventDefault();
    }
  }

  slideNumberDecimal_keyFilter(event: any): void {
    const currentValue: string = event.target.value;

    // Check if the key code is between 48 and 57 (ASCII codes for digits 0 to 9) or if it is a decimal point
    if (
      !((event.charCode >= 48 && event.charCode <= 57) || event.charCode === 46)
    ) {
      event.preventDefault();
      return;
    }

    if (currentValue.includes('.') && event.charCode === 46) {
      event.preventDefault();
      return;
    }

    // If a decimal point already exists, check if there are more than two digits after it
    if (currentValue.includes('.') && currentValue.split('.')[1].length >= 2) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.paymentForm = this.createFormGroup();
    iniciarDatos(this.data);
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      phoneNumber: new FormControl('', [
        Validators.required,
        exactLengthValidator(10),
        Validators.pattern(/^09/),
      ]),
      direction: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      value: new FormControl('', [Validators.required]),
      documentId: new FormControl('', [
        Validators.required,
        exactLengthValidator(10),
        validateEcuadorianDocumentId,
      ]),
    });
  }

  callToApi() {
    this.data.PayboxSendmail = this.paymentForm.value.email;
    this.data.PayboxSendname = this.paymentForm.value.name;
    this.data.PayboxDirection = this.paymentForm.value.direction;
    this.data.PayboxBase12 = this.paymentForm.value.value;
    this.data.PayBoxClientPhone = this.paymentForm.value.phoneNumber;
    reload(this.data)
  }

  
}
