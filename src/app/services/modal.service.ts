import { Injectable } from '@angular/core';

interface  IModal{
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: "root"
})
export class ModalService {
  private modals:IModal[] = [];

  constructor() { }

  isModalOpen(id: string)
  {
    const requiredModal = this.getRequiredModal(id);
    return requiredModal ? requiredModal.visible : false;
  }

  toggleModal(id: string)
  {
    const requiredModal = this.getRequiredModal(id);
    if(requiredModal)
      requiredModal.visible = !requiredModal.visible;
  }

  getRequiredModal(id: string){
    if(id){
      const requiredModal = this.modals.find(x => x.id == id);
      return requiredModal ? requiredModal:null;
    }
    return null;
  }

  register(key: string){
    this.modals.push({ id: key, visible: false });
  }

  unregister(id: string){
    this.modals = this.modals.filter(x => x.id !== id);
  }
}
