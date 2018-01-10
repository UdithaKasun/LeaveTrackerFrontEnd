import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentviewComponent } from './contentview.component';

describe('ContentviewComponent', () => {
  let component: ContentviewComponent;
  let fixture: ComponentFixture<ContentviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
