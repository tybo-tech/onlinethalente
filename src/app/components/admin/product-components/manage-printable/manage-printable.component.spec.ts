import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePrintableComponent } from './manage-printable.component';

describe('ManagePrintableComponent', () => {
  let component: ManagePrintableComponent;
  let fixture: ComponentFixture<ManagePrintableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePrintableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePrintableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
