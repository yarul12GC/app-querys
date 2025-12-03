import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryEschema } from './query-eschema';

describe('QueryEschema', () => {
  let component: QueryEschema;
  let fixture: ComponentFixture<QueryEschema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryEschema]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryEschema);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
