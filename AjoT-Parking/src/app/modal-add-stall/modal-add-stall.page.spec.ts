import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddStallPage } from './modal-add-stall.page';

describe('ModalAddStallPage', () => {
  let component: ModalAddStallPage;
  let fixture: ComponentFixture<ModalAddStallPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalAddStallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
