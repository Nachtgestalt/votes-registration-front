import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BasePersonalService} from "../../../../core/services/base-personal.service";
import Swal from "sweetalert2";
import {PrinterService} from "../../../../core/services/printer.service";

@Component({
  selector: 'app-add-base-staff',
  templateUrl: './add-base-staff.component.html',
  styleUrls: ['./add-base-staff.component.scss']
})
export class AddBaseStaffComponent implements OnInit {
  form!: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddBaseStaffComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private basePersonalService: BasePersonalService,
              private printerService: PrinterService) { }

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup() {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'last_name': new FormControl('', [Validators.required]),
      'mother_last_name': new FormControl('', [Validators.required]),
      'gender': new FormControl('', [Validators.required]),
      'denomination_job': new FormControl(''),
      'denomination_job_description': new FormControl(''),
      'cve_job_level': new FormControl(''),
      'phone_number': new FormControl('', [Validators.maxLength(10), Validators.minLength(10)]),
      'expedient': new FormControl('', [Validators.required]),
      'dependency': new FormControl('', [Validators.required]),
      'affiliation_area': new FormControl('', [Validators.required]),
      'exercise': new FormControl('N/A', [Validators.required]),
    })
  }

  save() {
    // if (!this.printerService.printCharacteristic) {
      // this.printerService.messageConnectPrinter();
      // return;
    // }
    this.form.markAllAsTouched();
    if(this.form.invalid) {
      return;
    }
    this.basePersonalService.save(this.form.value).subscribe({
      next: async () => {
        await Swal.fire('Compañero registrado', 'Se ha registrado correctamente', 'success');
        this.printerService.printAddBaseStaffTicket(this.form.value);
        this.dialogRef.close(true);
      },
      error: async err => {
        await Swal.fire('Error al registrar', 'Ha ocurrido un error, intentelo más tarde', 'error');
      }
    })
  }

}