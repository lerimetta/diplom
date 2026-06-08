import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { UserResponseType } from 'src/types/user-response.type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;
  userName: string = '';
  constructor(private authService: AuthService, private _snackBar: MatSnackBar,
    private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();

  }

  ngOnInit(): void {

    if (this.isLogged) {
      this.authService.getUserInfo()
      .subscribe({
        next: (data: DefaultResponseType | UserResponseType) => {
          this.userName = (data as UserResponseType).name;
        },
        error: (err) => console.error('Ошибка при загрузке имени', err)
      })
    }


    this.authService.isLogged$.subscribe((isLoggedIn) => {
      this.isLogged = isLoggedIn;
      if (this.isLogged) {
        this.authService.getUserInfo()
          .subscribe({
            next: (data: DefaultResponseType | UserResponseType) => {
              this.userName = (data as UserResponseType).name;
            },
            error: (err) => console.error('Ошибка при загрузке имени', err)
          })
      }
    })

  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }

  doLogout() {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
