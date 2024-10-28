import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSideComponent } from './user-side.component';

describe('UserSideComponentComponent', () => {
  let component: UserSideComponent;
  let fixture: ComponentFixture<UserSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
