import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateapplicationComponent } from './createapplication.component';

describe('CreateapplicationComponent', () => {
  let component: CreateapplicationComponent;
  let fixture: ComponentFixture<CreateapplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateapplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
