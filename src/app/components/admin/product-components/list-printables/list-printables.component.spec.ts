import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrintablesComponent } from './list-printables.component';

describe('ListPrintablesComponent', () => {
  let component: ListPrintablesComponent;
  let fixture: ComponentFixture<ListPrintablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPrintablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPrintablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
