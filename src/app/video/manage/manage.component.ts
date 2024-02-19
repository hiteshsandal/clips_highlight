import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1'; //ascending
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(private router: Router,
    private routes: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
    ) { 
      this.sort$ = new BehaviorSubject<string>(this.videoOrder);
    }

  ngOnInit(): void {
    this.routes.queryParams.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
      this.sort$.next(this.videoOrder);
    });

    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = [];

      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      });
      console.log(this.clips);
    });


  }

  sort(event: Event){
    const { value } = (event.target as HTMLSelectElement);
    // this.router.navigateByUrl(`/manage?sort=${value}`); 
    this.router.navigate([], {
      relativeTo: this.routes,
      queryParams: {
        sort: value
      }
    });   
  }

  openModal($event: Event, clip: IClip){
    $event.preventDefault();
    this.activeClip = clip;
    this.modal.toggleModal('editClip');
  }

  update($event: IClip){
    const clip = this.clips.find(element => element.docID == $event.docID);
    if(clip){
      clip.title = $event.title;
    }
  }

  deleteClip($event: Event, clip: IClip){
    $event.preventDefault();
    this.clipService.deleteClip(clip);

    this.clips = this.clips.filter(x => x.docID != clip.docID);
  }

  async copyToClipboard($event: MouseEvent, docID: string | undefined){
    $event.preventDefault();

    if(!docID)
      return;

    const url = `${location.origin}/clip/${docID}`;
    await navigator.clipboard.writeText(url);
    alert('link copied');
  }
}
