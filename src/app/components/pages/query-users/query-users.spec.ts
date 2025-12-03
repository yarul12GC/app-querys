import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryUsers } from './query-users';

describe('QueryUsers', () => {
  let component: QueryUsers;
  let fixture: ComponentFixture<QueryUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
