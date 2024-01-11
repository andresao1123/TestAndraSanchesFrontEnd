import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function exactLengthValidator(length: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      // Handle optional validation if the control value is empty
      return null;
    }

    const value = control.value.toString(); // Ensure we are working with a string

    if (value.length !== length) {
      return {
        exactLengthValidator: {
          requiredLength: length,
          actualLength: value.length,
        },
      };
    }

    return null; // Validation passed
  };
}

export function validateEcuadorianDocumentId(
  control: AbstractControl
): ValidationErrors | null {
  const value: string = control.value;

  // Check if the value is not empty
  if (!value) {
    return { required: true };
  }

  // Check the length of the document ID
  if (value.length !== 10) {
    return { exactLength: true };
  }

  // Check if the document ID contains only numeric characters
  if (!/^\d+$/.test(value)) {
    return { numericOnly: true };
  }

  // Validate the check digit (last digit)
  const checkDigit = parseInt(value.charAt(9), 10);
  const sum = Array.from(value.substring(0, 9))
    .reverse()
    .map(Number)
    .reduce((acc, digit, index) => {
      const doubled = index % 2 === 0 ? digit * 2 : digit;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }, 0);

  const calculatedCheckDigit = (10 - (sum % 10)) % 10;

  // Return ValidationErrors object if the check digit is invalid
  if(calculatedCheckDigit === checkDigit){
    return null; // Validation passed
  }
  else{
    return{ invalidaEcuadorianDocumentId: true };
  }
}
