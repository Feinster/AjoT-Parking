import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalChooseDataPage } from './modal-choose-data.page';

describe('ModalChooseDataPage', () => {
  let component: ModalChooseDataPage;
  let fixture: ComponentFixture<ModalChooseDataPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalChooseDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
