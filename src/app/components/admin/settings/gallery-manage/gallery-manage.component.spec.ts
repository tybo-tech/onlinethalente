import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryManageComponent } from './gallery-manage.component';

describe('GalleryManageComponent', () => {
  let component: GalleryManageComponent;
  let fixture: ComponentFixture<GalleryManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
