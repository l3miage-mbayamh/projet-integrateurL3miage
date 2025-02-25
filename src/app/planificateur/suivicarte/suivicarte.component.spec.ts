import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuivicarteComponent } from './suivicarte.component';

describe('SuivicarteComponent', () => {
  let component: SuivicarteComponent;
  let fixture: ComponentFixture<SuivicarteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuivicarteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuivicarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
