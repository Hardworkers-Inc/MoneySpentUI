import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TransferType} from "../../models/transferType";
import {TransferService} from "../../services/transfer.service";
import {FormState} from "./form-state";
import {ExampleHeader} from "./datepicker-header";
import {Transfer} from "../../models/transfer";
import {ActivatedRoute, Router} from "@angular/router";
import {DateTimeUtils} from "../../shared/date-time-utils";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PopupComponent} from "../../popup/popup.component";

@Component({
  selector: 'app-transfer-create',
  templateUrl: './transfer-create.component.html',
  styleUrls: ['./transfer-create.component.scss']
})

export class TransferCreateComponent implements OnInit {
  currentSum = "1230.12"
  currency = "hrn"

  disabled = false
  TransferType = TransferType
  transferForm!: FormGroup
  firstButtonPress = true;
  secondButtonPress = false;
  exampleHeader = ExampleHeader;

  transferId: number | undefined
  isEdit: boolean = false

  constructor(
    private transferService: TransferService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.generateForm();
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty("transferId")) {
        this.transferId = params["transferId"]
        this.isEdit = true
        this.setDataToFields(this.transferId!)
      }
    })
  }

  generateForm(): void {
    this.transferForm = this.formBuilder.group({
      title: [new FormState("", this.disabled),
        [Validators.required, this.noWhitespaceValidator, Validators.maxLength(50)]],
      description: [new FormState(undefined, this.disabled),
        [Validators.maxLength(300)]],
      transferType: [new FormState(TransferType.INCOME, this.disabled),
        [Validators.required, this.noWhitespaceValidator]],
      dateTime: [new FormState(undefined, this.disabled),
        [Validators.required]],
      count: [new FormState("", this.disabled),
        [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]?)?$')]]
    })
  }

  setDataToFields(transferId: number): void {
    this.transferService.getById(transferId).subscribe((transfer: Transfer) => {
      transfer.dateTime = DateTimeUtils.fromArrayToFormatString(transfer.dateTime)
      this.transferForm.patchValue(transfer);
    })
  }

  get title(): FormControl {
    return this.transferForm.get("title") as FormControl
  }

  get description(): FormControl {
    return this.transferForm.get("description") as FormControl
  }

  get transferType(): FormControl {
    return this.transferForm.get("transferType") as FormControl
  }

  get tags(): FormControl {
    return this.transferForm.get("tags") as FormControl
  }

  get dateTime(): FormControl {
    return this.transferForm.get("dateTime") as FormControl
  }

  get count(): FormControl {
    return this.transferForm.get("count") as FormControl
  }

  refactor(value: string) {
    return value.substr(0, 1).toUpperCase() + value.substr(1).toLowerCase()
  }

  clickFirstButton() {
    this.firstButtonPress = true;
    this.secondButtonPress = false;
  }

  clickSecondButton() {
    this.firstButtonPress = false;
    this.secondButtonPress = true;
  }

  onSaveClick(): void {
    let newTransfer = this.generateTransfer()
    if (this.isEdit) {
      newTransfer.id = this.transferId
      this.transferService.update(newTransfer).subscribe(() => {
        this.redirect()
      })
    } else {
      this.transferService.create(newTransfer).subscribe(() => {
        this.redirect()
      })
    }
  }

  onCancelClick(): void {
    if (this.transferForm.dirty) {
      this.openDialogOnCancel()
    } else {
      this.redirect()
    }
  }

  openDialogOnCancel() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      question: 'Are you sure you want to discard your changes?',
      firstButton: 'Cancel',
      secondButton: 'Discard changes'
    };

    const dialogRef = this.dialog.open(PopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.redirect()
      }
    });
  }

  generateTransfer(): Transfer {
    return {
      title: this.title?.value,
      description: this.description?.value,
      transferType: this.transferType?.value,
      tags: [],
      dateTime: this.dateTime.value,
      count: this.count.value
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : {'whitespace': true};
  }

  onNowClick(): void {
    this.dateTime.patchValue(DateTimeUtils.getNowDateTimeInString())
  }

  getErroredFieldClass(formControl: FormControl): string {
    return this.isFieldErrored(formControl) ? "data-input-invalid" : ''
  }

  isFieldErrored(formControl: FormControl): boolean {
    return formControl.invalid && formControl.touched
  }

  private redirect(): void {
    let path = this.isEdit ? '../../' : '../'
    this.router.navigate([path], {relativeTo: this.route})
  }
}
