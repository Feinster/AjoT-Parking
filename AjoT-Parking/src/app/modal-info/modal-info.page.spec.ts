import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalInfoPage } from './modal-info.page';

describe('ModalInfoPage', () => {
  let component: ModalInfoPage;
  let fixture: ComponentFixture<ModalInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
