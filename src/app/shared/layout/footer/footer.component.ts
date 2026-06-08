import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PopupService } from '../../services/popup.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopupType } from 'src/types/popup.type';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @ViewChild('popup') popup!: TemplateRef<ElementRef>
  dialogRef: MatDialogRef<any> | null = null;
  isError = false;
  isSubmitted = false;
  consultForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]]
  });

  constructor(private dialog: MatDialog, private fb: FormBuilder, private popupService: PopupService) { }

  ngOnInit(): void {
  }
  openPopup() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.dialogRef = this.dialog.open(this.popup, { autoFocus: false })
    this.dialogRef.backdropClick()
      .subscribe(() => {
        this.isSubmitted = false;
      })
 
  }

  closePopup() {
    this.isSubmitted = false;
    this.isError = false;
    this.consultForm.reset();
    this.dialogRef?.close();
  }

  orderService() {
    const formData = {
      ...this.consultForm.value,
      type: 'consultation'
    } as PopupType;
    if (this.consultForm.valid && formData.name && formData.phone) {
      this.popupService.makeOrder(formData)
        .subscribe({
          next: () => {
            this.isSubmitted = true;
            this.consultForm.reset();

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
