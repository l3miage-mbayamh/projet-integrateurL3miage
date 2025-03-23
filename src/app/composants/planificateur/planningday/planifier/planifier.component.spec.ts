import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanifierComponent } from './planifier.component';

describe('PlanifierComponent', () => {
  let component: PlanifierComponent;
  let fixture: ComponentFixture<PlanifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanifierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
