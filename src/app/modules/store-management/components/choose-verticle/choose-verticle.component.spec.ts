import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseVerticleComponent } from './choose-verticle.component';

describe('ChooseVerticleComponent', () => {
  let component: ChooseVerticleComponent;
  let fixture: ComponentFixture<ChooseVerticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseVerticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseVerticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
