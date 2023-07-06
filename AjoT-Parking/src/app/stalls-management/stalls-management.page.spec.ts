import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StallsManagementPage } from './stalls-management.page';

describe('StallsManagementPage', () => {
  let component: StallsManagementPage;
  let fixture: ComponentFixture<StallsManagementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StallsManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
