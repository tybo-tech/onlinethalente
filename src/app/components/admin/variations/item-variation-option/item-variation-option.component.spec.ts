import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVariationOptionComponent } from './item-variation-option.component';

describe('ItemVariationOptionComponent', () => {
  let component: ItemVariationOptionComponent;
  let fixture: ComponentFixture<ItemVariationOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemVariationOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemVariationOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
