import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutWrapper } from './layout-wrapper';

describe('LayoutWrapper', () => {
  let component: LayoutWrapper;
  let fixture: ComponentFixture<LayoutWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutWrapper],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
