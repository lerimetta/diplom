import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PopularService } from 'src/app/shared/services/popular.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { PopularArticlesType } from 'src/types/popular-articles.type';
import { PopupType } from 'src/types/popup.type';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  populars: PopularArticlesType[] = [];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    items: 1,
    nav: false,
    navText: ['', '']
  };

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    margin: 25,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  };

  reviews = [
    {
      name: "Станислав",
      image: "review1.png",
      text: "Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру."
    },
    {
      name: "Алёна",
      image: "review2.png",
      text: "Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть."
    },
    {
      name: "Мария",
      image: "review3.png",
      text: "Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!"
    },
    {
      name: "Аделина",
      image: "review4.png",
      text: "Suspendisse et dui justo. Vivamus eleifend cursus metus. Fusce placerat semper lorem sed ultricies. Sed iaculis dignissim laoreet. Nunc ligula eros, ultricies sed ornare et, tristique sit amet erat."
    },
    {
      name: "Яника",
      image: "review5.png",
      text: "Suspendisse et dui justo. Vivamus eleifend cursus metus. Fusce placerat semper lorem sed ultricies. Sed iaculis dignissim laoreet. Nunc ligula eros, ultricies sed ornare et, tristique sit amet erat."
    },
    {
      name: "Андрей",
      image: "review6.png",
      text: "Suspendisse et dui justo. Vivamus eleifend cursus metus. Fusce placerat semper lorem sed ultricies. Sed iaculis dignissim laoreet. Nunc ligula eros, ultricies sed ornare et, tristique sit amet erat.!"
    }
  ];

  services = [{
    image: 'website.png',
    title: 'Создание сайтов',
    description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!'
  },
  {
    image: 'promotion.png',
    title: 'Продвижение',
    description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!'
  },
  {
    image: 'advertisement.png',
    title: 'Реклама',
    description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.'
  },
  {
    image: 'copywriting.png',
    title: 'Копирайтинг',
    description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.'
  }
  ];

  @ViewChild('popup') popup!: TemplateRef<ElementRef>
  dialogRef: MatDialogRef<any> | null = null;
  isError = false;
  isSubmitted = false;
  serviceForm = this.fb.group({
    service: ['', [Validators.required]],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]]
  });
  constructor(private popularService: PopularService, private dialog: MatDialog, private fb: FormBuilder, private popupService: PopupService) { }

  ngOnInit(): void {
    this.popularService.getPopular()
      .subscribe(data => {
        this.populars = data;
      })
  }
  openPopup(title: string) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.dialogRef = this.dialog.open(this.popup, { autoFocus: false })
    this.dialogRef.backdropClick()
      .subscribe(() => {
        this.isSubmitted = false;
      })
    this.serviceForm.patchValue({
      service: title
    });
  }

  closePopup() {
    this.isSubmitted = false;
    this.isError = false;
    this.serviceForm.reset();
    this.dialogRef?.close();
  }

  orderService() {
    const formData = {
      ...this.serviceForm.value,
      type: 'order'
    } as PopupType;

    if (this.serviceForm.valid && formData.name && formData.phone && formData.service) {
      this.popupService.makeOrder(formData)
        .subscribe({
          next: () => {
            this.isSubmitted = true;
            this.serviceForm.reset();

          },
          error: () => this.isError = true
        }
        );
    }
  }

  reset() {
    this.isSubmitted = false;
    this.dialogRef?.close();
  }

}
