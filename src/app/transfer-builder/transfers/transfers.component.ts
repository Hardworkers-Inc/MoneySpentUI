import {Component, OnInit} from '@angular/core';
import {Transfer} from "../../models/transfer";
import {TransferType} from "../../models/transferType";
import {TransferService} from "../../services/transfer.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PopupComponent} from "../../popup/popup.component";
import {ActivatedRoute, Router} from "@angular/router";
import {DateTimeUtils} from "../../shared/date-time-utils";

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss']
})
export class TransfersComponent implements OnInit {
  transfers: Transfer[] = []
  TransferType = TransferType

  currentSum = "1230.12"
  currency = "hrn"

  constructor(
    private transferService: TransferService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.transferService.get()
      .subscribe((transfers: Transfer[]) => {
        this.transfers = transfers
      })
  }

  setDateAndTime(dateAndTime: any): string {
    return DateTimeUtils.fromArrayToViewingString(dateAndTime)
  }

  openDialog(idTransfer: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      question: 'Are you sure you want to remove this transfer?',
      firstButton: 'Cancel',
      secondButton: 'Remove'
    };

    const dialogRef = this.dialog.open(PopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.transferService.delete(idTransfer).subscribe(() => {
          this.loadData();
        });
      }
    });
  }

  onEditClick(idTransfer: any) {
    this.router.navigate([idTransfer, 'edit'], {relativeTo: this.route})
  }
}
