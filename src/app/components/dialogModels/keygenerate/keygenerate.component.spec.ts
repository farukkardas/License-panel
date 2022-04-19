import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeygenerateComponent } from './keygenerate.component';

describe('KeygenerateComponent', () => {
  let component: KeygenerateComponent;
  let fixture: ComponentFixture<KeygenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeygenerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeygenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
