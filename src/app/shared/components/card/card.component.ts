import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopularArticlesType } from 'src/types/popular-articles.type';
import { PopupService } from '../../services/popup.service';
import { PopupType } from 'src/types/popup.type';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() serviceCard: boolean = false;
  @Input() service: PopularArticlesType = {
    title: '',
    description: '',
    image: '',
  };

  @ViewChild('popup') popup!: TemplateRef<ElementRef>
  dialogRef: MatDialogRef<any> | null = null;
  isError = false;
  isSubmitted = false;
  serviceForm = this.fb.group({
    service: ['', [Validators.required, Validators.minLength(5)]],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]]
  });


  constructor(private dialog: MatDialog, private fb: FormBuilder, private popupService: PopupService) { }

  ngOnInit(): void {
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
