import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCarrousel } from './app-carrousel';

describe('AppCarrousel', () => {
  let component: AppCarrousel;
  let fixture: ComponentFixture<AppCarrousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCarrousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCarrousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
