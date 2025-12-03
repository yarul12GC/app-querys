import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Headerr } from './headerr';

describe('Headerr', () => {
  let component: Headerr;
  let fixture: ComponentFixture<Headerr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Headerr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Headerr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
