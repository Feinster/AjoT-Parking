import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalChangeNumberStallsPage } from './modal-change-number-stalls.page';

describe('ModalChangeNumberStallsPage', () => {
  let component: ModalChangeNumberStallsPage;
  let fixture: ComponentFixture<ModalChangeNumberStallsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalChangeNumberStallsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
