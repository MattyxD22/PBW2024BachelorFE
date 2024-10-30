import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { TeamupService } from '../services/teamupServices/teamup.service';
import { catchError, from, of, switchMap } from 'rxjs';
import { error } from 'console';

type teamupState = {
  users: any,
  subcalendars: any,
  userCalendar: any
};

const initialState: teamupState = {
  users: [],
  subcalendars: [],
  userCalendar: [],
};

export const TeamupStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    getUsers: computed(() => state.users()),
    getSubcalendars: computed(() => state.subcalendars()),
    getUserCalendar: computed(() => state.userCalendar()),
  })),

  withMethods((store) => {
    const teamupService = inject(TeamupService);

    return {
      setUsers: () => {
        if (teamupService.isAuthenticated.value) {

          teamupService.teamupFetchUsers().subscribe({
            next: (res: any) => {
              console.log(res.users);

              patchState(store, { users: res.users });
            },
            error: (error) => {
              console.error('Error fetching users:', error);
            }
          });
        } else {
          console.log('Authentication required before fetching users.');
        }
      },
      setUserEvents: (email: string) => {
        teamupService.teamupFetchUserCalendar(email).subscribe({
          next: (res: any) => {
            console.log(res.events);
            patchState(store, { userCalendar: res.events });
          },
          error: (error) => {
            console.log('Error fetching user calendar');
          }
        })
      },
      setCalender: () => {
        teamupService.teamupFetchCalendar().subscribe({
          next: (res: any) => {
            console.log(res)
            patchState(store, { userCalendar: res })
          },
          error: (error) => {
            console.log('Error fetching user calendar');
          }
        })
      }
    }
  }),
);
