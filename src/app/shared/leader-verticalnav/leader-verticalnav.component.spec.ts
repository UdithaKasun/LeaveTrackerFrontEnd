import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderVerticalnavComponent } from './leader-verticalnav.component';

describe('LeaderVerticalnavComponent', () => {
  let component: LeaderVerticalnavComponent;
  let fixture: ComponentFixture<LeaderVerticalnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderVerticalnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderVerticalnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
