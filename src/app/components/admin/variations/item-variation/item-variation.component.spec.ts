import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVariationComponent } from './item-variation.component';

describe('ItemVariationComponent', () => {
  let component: ItemVariationComponent;
  let fixture: ComponentFixture<ItemVariationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemVariationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemVariationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
