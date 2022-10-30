import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UserActions from 'src/app/state/actions/user.actions';
import * as UserSelector from 'src/app/state/selector/user.selector';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  info$ = this.store.select(UserSelector.getUser);
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(UserActions.get());
  }

}
