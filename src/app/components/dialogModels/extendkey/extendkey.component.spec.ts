import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendkeyComponent } from './extendkey.component';

describe('ExtendkeyComponent', () => {
  let component: ExtendkeyComponent;
  let fixture: ComponentFixture<ExtendkeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendkeyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendkeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
