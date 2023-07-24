import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalChangeBrightnessThresholdPage } from './modal-change-brightness-threshold.page';

describe('ModalChangeBrightnessThresholdPage', () => {
  let component: ModalChangeBrightnessThresholdPage;
  let fixture: ComponentFixture<ModalChangeBrightnessThresholdPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalChangeBrightnessThresholdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
