import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PopularArticlesType } from 'src/types/popular-articles.type';

@Injectable({
  providedIn: 'root'
})
export class PopularService {

  constructor(private http: HttpClient) { }

  getPopular(): Observable<PopularArticlesType[]> {
    return this.http.get<PopularArticlesType[]>(environment.api + 'articles/top')
  }
}
