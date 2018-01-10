import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVerticalnavComponent } from './admin-verticalnav.component';

describe('AdminVerticalnavComponent', () => {
  let component: AdminVerticalnavComponent;
  let fixture: ComponentFixture<AdminVerticalnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVerticalnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVerticalnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
