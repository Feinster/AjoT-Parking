import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParkingPage } from './parking.page';

describe('ParkingPage', () => {
  let component: ParkingPage;
  let fixture: ComponentFixture<ParkingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParkingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
