import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariationManagerComponent } from './product-variation-manager.component';

describe('ProductVariationManagerComponent', () => {
  let component: ProductVariationManagerComponent;
  let fixture: ComponentFixture<ProductVariationManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVariationManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductVariationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
