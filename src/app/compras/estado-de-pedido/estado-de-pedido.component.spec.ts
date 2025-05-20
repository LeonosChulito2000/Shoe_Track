import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoDePedidoComponent } from './estado-de-pedido.component';

describe('EstadoDePedidoComponent', () => {
  let component: EstadoDePedidoComponent;
  let fixture: ComponentFixture<EstadoDePedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadoDePedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoDePedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
