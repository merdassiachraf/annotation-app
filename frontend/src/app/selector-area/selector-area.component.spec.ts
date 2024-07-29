import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorAreaComponent } from './selector-area.component';

describe('SelectorAreaComponent', () => {
  let component: SelectorAreaComponent;
  let fixture: ComponentFixture<SelectorAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
