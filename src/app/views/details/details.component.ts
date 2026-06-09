import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { BlogService } from 'src/app/shared/services/blog.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ArticleType } from 'src/types/article.type';
import { CommentType } from 'src/types/comment.type';
import { PopularArticlesType } from 'src/types/popular-articles.type';
import { ReactionsType } from 'src/types/reactions.type';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  article: ArticleType | null = null;
  relatedArticles: PopularArticlesType[] = [];
  comments: CommentType[] = [];
  userReactions: ReactionsType[] = [];
  isLogged: boolean = false;
  commentsOffset: number = 3;
  hasMoreComments: boolean = true;
  noComments: boolean = true;

  myForm = this.fb.group({
    commentText: ['', [Validators.required, Validators.minLength(5)]]
  });

  constructor(private fb: FormBuilder, private blogService: BlogService, private activatedRoute: ActivatedRoute, private _snackBar: MatSnackBar, private authService: AuthService,private loaderService:LoaderService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn) => {
      this.isLogged = isLoggedIn;
    })

    this.activatedRoute.params.subscribe(params => {
      this.blogService.getArticle(params['url'])
        .subscribe(data => {
          this.article = data;
          this.comments = data.comments;
          if (data.commentsCount <= 3) {
            this.hasMoreComments = false;
          }
          if (this.comments.length > 0) {
            this.noComments = false;
          }

          this.blogService.getRelatedArticles(params['url'])
            .subscribe(data => {
              this.relatedArticles = data as PopularArticlesType[];

            })
          if (this.isLogged) {
            this.blogService.getReactionsArticle(this.article.id)
              .subscribe(data => {
                this.userReactions = data;
              })
          }

        })
    })

  }

  addComment() {
    if (this.isLogged) {
      if (this.myForm.valid) {
        const commentValue = this.myForm.value.commentText;
        if (commentValue && this.article) {
          this.blogService.addComment(commentValue, this.article.id)
            .subscribe(() => {
              this.blogService.getComments({ article: this.article!.id, offset: 0 })
                .subscribe(data => {
                  this.comments = data.comments;
                  if (this.noComments) {
                    this.noComments = false;
                  }
                })
            })
        }
      }
    }
  }

  addReactions(id: string, reaction: string) {
    if (this.isLogged) {
      if (reaction === 'like' || reaction === 'dislike') {
        const comment = this.comments.find((c: any) => c.id === id);
        if (comment) {
          const existingReaction = this.userReactions.find(item => item.comment === id);
          const isSameReaction = existingReaction && existingReaction.action === reaction;
          comment.likesCount = comment.likesCount || 0;
          comment.dislikesCount = comment.dislikesCount || 0;

          if (existingReaction) {

            if (isSameReaction) {
              if (reaction === 'like') comment.likesCount--;
              if (reaction === 'dislike') comment.dislikesCount--;
            }

            else {
              if (reaction === 'like') {
                comment.likesCount++;
                comment.dislikesCount--;
              } else {
                comment.dislikesCount++;
                comment.likesCount--;
              }
            }
          } else {
            if (reaction === 'like') comment.likesCount++;
            if (reaction === 'dislike') comment.dislikesCount++;
          }
        }
      }
      const existingReaction = this.userReactions.find(item => item.comment === id);
      const isSameReaction = existingReaction && existingReaction.action === reaction;

      this.blogService.addReactions(id, reaction)
        .subscribe({
          next: () => {
            this.userReactions = this.userReactions.filter(item => item.comment !== id);
            if (!isSameReaction) {
              this.userReactions.push({ comment: id, action: reaction });
            }
            if (reaction === 'like' || reaction === 'dislike') {
              this._snackBar.open('Ваш голос учтен');
            } else {
              this._snackBar.open('Жалоба отправлена');
            }

          },
          error: (error: HttpErrorResponse) => {
            this._snackBar.open('Жалоба уже отправлена');
          }
        })
    }

  }

  isCommentLiked(commentId: string): boolean {
    return this.userReactions.some(item => item.comment === commentId && item.action === 'like');
  }
  isCommentDisLiked(commentId: string): boolean {
    return this.userReactions.some(item => item.comment === commentId && item.action === 'dislike');
  }

  loadMoreComments(): void {
    if (this.article) {
      this.loaderService.show();
      this.blogService.getComments({ article: this.article.id, offset: this.commentsOffset })
        .subscribe({
          next: data => {
            if (data && data.comments && data.comments.length > 0) {
              this.comments = [...this.comments, ...data.comments];
              this.commentsOffset += 10;
              if (data.comments.length < 10) {
                this.hasMoreComments = false;
              }
            } else {
              this.hasMoreComments = false;
            }
          },
          error: err => console.error('Ошибка при загрузке дополнительных комментариев:', err)
        });
        this.loaderService.hide();
    }
  }
}
