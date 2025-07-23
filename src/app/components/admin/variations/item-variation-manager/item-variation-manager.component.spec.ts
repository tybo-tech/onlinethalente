import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVariationManagerComponent } from './item-variation-manager.component';

describe('ItemVariationManagerComponent', () => {
  let component: ItemVariationManagerComponent;
  let fixture: ComponentFixture<ItemVariationManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemVariationManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemVariationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
