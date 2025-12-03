import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryTables } from './query-tables';

describe('QueryTables', () => {
  let component: QueryTables;
  let fixture: ComponentFixture<QueryTables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryTables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryTables);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
