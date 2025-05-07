import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogginAdminComponent } from './loggin-admin.component';

describe('LogginAdminComponent', () => {
  let component: LogginAdminComponent;
  let fixture: ComponentFixture<LogginAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogginAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogginAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
