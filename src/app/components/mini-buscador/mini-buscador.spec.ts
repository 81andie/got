import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniBuscador } from './mini-buscador';

describe('MiniBuscador', () => {
  let component: MiniBuscador;
  let fixture: ComponentFixture<MiniBuscador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniBuscador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniBuscador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
