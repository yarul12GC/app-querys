import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormQ } from './user-form-q';

describe('UserFormQ', () => {
  let component: UserFormQ;
  let fixture: ComponentFixture<UserFormQ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormQ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormQ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
