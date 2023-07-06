import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddParkingPage } from './modal-add-parking.page';

describe('ModalAddParkingPage', () => {
  let component: ModalAddParkingPage;
  let fixture: ComponentFixture<ModalAddParkingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalAddParkingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
