import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningdayComponent } from './planningday.component';

describe('PlanningdayComponent', () => {
  let component: PlanningdayComponent;
  let fixture: ComponentFixture<PlanningdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanningdayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanningdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
