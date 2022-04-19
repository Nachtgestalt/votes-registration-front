import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TemplatesService} from "../../../../data/services/templates.service";
import Swal from "sweetalert2";
import {FileHandle} from "../../../../shared/directives/drop-files.directive";
import {catchError, switchMap} from "rxjs";

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {
  form!: FormGroup;
  files!: FileHandle[]

  constructor(
    public dialogRef: MatDialogRef<TemplateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateService: TemplatesService
  ) { }

  ngOnInit(): void {
    this.createFormGroup()
  }

  createFormGroup() {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'description': new FormControl('', [Validators.required]),
    })

    if(this.data.edit) {
      this.form.addControl('id', new FormControl());
      this.form.patchValue(this.data.payload)
    }
  }

  save() {
    console.log(this.files);
    this.form.markAllAsTouched();
    if(this.form.invalid) {
      return;
    }
    if(this.data.edit) {
      this.templateService.update(this.form.value)
        .pipe(
          catchError(({error}) => {
            throw error.error
          }),
          switchMap((data: any) => {
            console.log(data);
            return this.templateService.uploadImage(this.files, data.id);
          })
        )
        .subscribe({
          next: (resp) => {
            Swal.fire('Exito', 'Se ha actualizado la plantilla', 'success');
            this.dialogRef.close(true)
          },
          error: ({error}) => {
            console.log(error)
            Swal.fire('Algo ha salido mal', error.error, 'error')
          }
      })
    } else {
      this.templateService.save(this.form.value)
        .pipe(
          catchError(({error}) => {
            throw error.error
          }),
          switchMap((data: any) => {
            console.log(data);
            return this.templateService.uploadImage(this.files, data.id);
          })
        )
        .subscribe({
        next: (resp) => {
          Swal.fire('Exito', 'Se ha creado la plantilla', 'success');
          this.dialogRef.close(true)
        },
        error: () => {
          Swal.fire('Servicio no disponible', 'Algo ha salido mal', 'error')
        }
      })
    }
  }

}
