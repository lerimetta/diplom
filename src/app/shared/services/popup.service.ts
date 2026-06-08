import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PopularArticlesType } from 'src/types/popular-articles.type';
import { PopupType } from 'src/types/popup.type';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private http: HttpClient) { }

  makeOrder(param: PopupType): Observable<PopularArticlesType[]> {
    return this.http.post<PopularArticlesType[]>(environment.api + 'requests', param)
  }
}
