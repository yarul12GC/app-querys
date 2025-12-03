import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExportSchema } from './import-export-schema';

describe('ImportExportSchema', () => {
  let component: ImportExportSchema;
  let fixture: ComponentFixture<ImportExportSchema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportExportSchema]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportExportSchema);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
