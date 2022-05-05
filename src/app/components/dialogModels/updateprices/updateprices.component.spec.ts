import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepricesComponent } from './updateprices.component';

describe('UpdatepricesComponent', () => {
  let component: UpdatepricesComponent;
  let fixture: ComponentFixture<UpdatepricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatepricesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatepricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
