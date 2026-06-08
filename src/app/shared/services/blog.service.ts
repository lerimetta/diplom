import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticleType } from 'src/types/article.type';
import { BlogType } from 'src/types/blog.type';
import { CategoriesType } from 'src/types/categories.type';
import { CommentsParamsType } from 'src/types/comments-params.type';
import { CommentsType } from 'src/types/comments.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { PopularArticlesType } from 'src/types/popular-articles.type';
import { ReactionsType } from 'src/types/reactions.type';


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  getArticles(params: ActiveParamsType): Observable<BlogType> {
    return this.http.get<BlogType>(environment.api + 'articles', { params: params })
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url)
  }

  getComments(params: CommentsParamsType): Observable<CommentsType> {
    return this.http.get<CommentsType>(environment.api + 'comments', { params: params })
  }

  addComment(comment: string, articleId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', { text: comment, article: articleId })
  }

  addReactions(id: string, reaction: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', { action: reaction })
  }

  getRelatedArticles(url: string): Observable<PopularArticlesType[] | DefaultResponseType> {
    return this.http.get<PopularArticlesType[] | DefaultResponseType>(environment.api + 'articles/related/' + url)
  }

  getCategories(): Observable<CategoriesType[]> {
    return this.http.get<CategoriesType[]>(environment.api + 'categories')
  }

  getReactionsArticle(id: string): Observable<ReactionsType[]> {
    return this.http.get<ReactionsType[]>(environment.api + 'comments/article-comment-actions', { params: { articleId: id } })
  }

}
