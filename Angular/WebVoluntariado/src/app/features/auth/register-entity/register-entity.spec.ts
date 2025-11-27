import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEntity } from './register-entity';

describe('RegisterEntity', () => {
  let component: RegisterEntity;
  let fixture: ComponentFixture<RegisterEntity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterEntity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterEntity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
