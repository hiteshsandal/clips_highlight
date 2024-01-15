import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(
    public modalService: ModalService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  } 

  openModal($event: Event){
    $event.preventDefault();
    this.modalService.toggleModal("auth");
  }

  async logout($event: Event){
    $event.preventDefault();
    await this.authService.logoutUser();
  }
}
