import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnplannedLeavesComponent } from './unplanned-leaves.component';

describe('UnplannedLeavesComponent', () => {
  let component: UnplannedLeavesComponent;
  let fixture: ComponentFixture<UnplannedLeavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnplannedLeavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnplannedLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
