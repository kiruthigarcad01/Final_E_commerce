import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { countryCodeService } from '../service/country-code.service';
import { HttpClient } from '@angular/common/http';

export function phoneNumberLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && value.length > maxLength) {
      return { maxLengthExceeded: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  maxDate: Date;
  countryCodes: any[] = [];
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private countryCodeService: countryCodeService,
    private router: Router,
    private http: HttpClient
  ) {
    this.signUpForm = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      location: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, phoneNumberLengthValidator(10)]],
      countryCode: ['', Validators.required],
      dob: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.fetchCountryCodes();
  }

  fetchCountryCodes(): void {
    this.countryCodeService.getCountryCodes().subscribe(
      (data: any) => {
        this.countryCodes = data
          .filter((country: any) => country.idd && country.idd.root)
          .map((country: any) => ({
            country: country.name.common,
            code: `${country.idd.root}${
              country.idd.suffixes ? country.idd.suffixes[0] : ''
            }`,
          }));

        const india = this.countryCodes.find((c) => c.country === 'India');
        const america = this.countryCodes.find(
          (c) => c.country === 'United States'
        );

        this.countryCodes = this.countryCodes.filter(
          (c) => c.country !== 'India' && c.country !== 'United States'
        );

        if (india) {
          this.countryCodes.unshift(india);
        }
        if (america) {
          this.countryCodes.unshift(america);
        }
      },
      (error: any) => {
        console.error('Error fetching country codes', error);
      }
    );
  }

  get f() {
    return this.signUpForm.controls;
  }

  onSubmit() {
    this.isLoading = true;
    const newPassword = this.signUpForm.get('password')?.value;
    const confirmNewPassword = this.signUpForm.get('confirmPassword')?.value;

    if (newPassword !== confirmNewPassword) {
      this.snackBar.open('Passwords do not match.', '', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (this.signUpForm.valid) {
      const dob = new Date(this.signUpForm.value.dob);
      const age = this.calculateAge(dob);

      if (age < 18) {
        this.snackBar.open('Employee must be greater than 18 years.', '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
        return;
      }

      console.log('Form Submitted!', this.signUpForm.value);

      this.userService.registerUser(this.signUpForm.value).subscribe(
        (response: any) => {
          this.snackBar.open('User registered successfully!', '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/login']);
        },
        (error: any) => {
          if (error.status === 400 && error.error.message) {
            this.snackBar.open(error.error.message, '', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            });
          } else {
            this.snackBar.open(
              'Error registering user. Please try again.',
              '',
              {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              }
            );
          }
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }
}
