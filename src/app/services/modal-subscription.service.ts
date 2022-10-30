import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalSubscriptionService {
  closeModal$ = new BehaviorSubject<string>('');
  closeModalObservable$ = this.closeModal$.asObservable();
  constructor() { }

  closeModal(modalName: string) {
    this.closeModal$.next(modalName);
  }
}
