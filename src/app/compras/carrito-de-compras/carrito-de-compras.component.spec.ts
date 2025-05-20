import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoDeComprasComponent } from './carrito-de-compras.component';

describe('CarritoDeComprasComponent', () => {
  let component: CarritoDeComprasComponent;
  let fixture: ComponentFixture<CarritoDeComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarritoDeComprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoDeComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
