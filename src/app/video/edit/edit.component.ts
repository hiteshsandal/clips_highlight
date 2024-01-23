import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();

  alertMsg = "Please wait! Updating clip.";
  alertColor = "blue";
  showAlert = false;
  inSubmission = false;

  clipID: FormControl = new FormControl('');
  title: FormControl = new FormControl('', [
    Validators.required, 
    Validators.minLength(3)
  ]);
  editForm: FormGroup = new FormGroup({
    title: this.title,
    clipID: this.clipID
  });

  constructor(
    private modal: ModalService,
    private clipService: ClipService
    ) { }

  ngOnInit(): void {
    this.modal.register("editClip");
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.inSubmission = false;
    this.showAlert = false;
    
    if(!this.activeClip){
      return;
    }

    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);

  }

  ngOnDestroy(): void {
    this.modal.unregister("editClip");
  }

  async submit(){
    if(!this.activeClip)
      return;

    this.showAlert = true;
    this.inSubmission = true;
    this.alertMsg = "Please wait! Updating clip.";
    this.alertColor = "blue";

    try{
      await this.clipService.updatingClip(this.clipID.value, this.title.value);
    }
    catch(e){
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try again later.';
    }

    this.activeClip.title = this.title.value as string;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = "green";
    this.alertMsg = "Success!";
  }

}
