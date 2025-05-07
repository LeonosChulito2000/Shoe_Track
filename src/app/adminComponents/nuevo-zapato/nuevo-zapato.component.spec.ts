import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoZapatoComponent } from './nuevo-zapato.component';

describe('NuevoZapatoComponent', () => {
  let component: NuevoZapatoComponent;
  let fixture: ComponentFixture<NuevoZapatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevoZapatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoZapatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
