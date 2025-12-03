import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionQuery } from './section-query';

describe('SectionQuery', () => {
  let component: SectionQuery;
  let fixture: ComponentFixture<SectionQuery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionQuery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionQuery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
