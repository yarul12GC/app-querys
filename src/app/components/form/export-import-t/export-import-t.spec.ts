import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportImportT } from './export-import-t';

describe('ExportImportT', () => {
  let component: ExportImportT;
  let fixture: ComponentFixture<ExportImportT>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportImportT]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportImportT);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
