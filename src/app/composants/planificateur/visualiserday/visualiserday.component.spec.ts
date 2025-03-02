import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualiserdayComponent } from './visualiserday.component';

describe('VisualiserdayComponent', () => {
  let component: VisualiserdayComponent;
  let fixture: ComponentFixture<VisualiserdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualiserdayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualiserdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
