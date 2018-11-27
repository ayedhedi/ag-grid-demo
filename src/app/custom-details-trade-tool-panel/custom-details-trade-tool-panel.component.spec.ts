import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomStatsToolPanel } from './custom-stats-tool-panel.component';

describe('CustomStatsToolPanel', () => {
  let component: CustomStatsToolPanel;
  let fixture: ComponentFixture<CustomStatsToolPanel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomStatsToolPanel ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomStatsToolPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
