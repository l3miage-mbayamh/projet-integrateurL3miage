import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjusterdayComponent } from './ajusterday.component';

describe('AjusterdayComponent', () => {
  let component: AjusterdayComponent;
  let fixture: ComponentFixture<AjusterdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjusterdayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjusterdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
