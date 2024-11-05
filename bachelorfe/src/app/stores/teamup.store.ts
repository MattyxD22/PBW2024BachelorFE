import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { TeamupService } from '../services/teamupServices/teamup.service';

type teamupState = {
  users: any[],
  subcalendars: any[],
  userCalendar: any[]
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
      setUserEvents: (email: string, startDate?: string, endDate?: string) => {
        if (!email) {
          console.log('No email provided to fetch user events');
          return; // Early exit if no email
        }

        console.log('userEmail: ', email);
        teamupService.teamupFetchUserCalendar(email, startDate, endDate).subscribe({
          next: (res: any) => {
            patchState(store, { userCalendar: res.events });
          },
          error: (error) => {
            console.log('Error fetching user calendar:', error);
          }
        });
      },
      setSubCalender: () => {
        teamupService.teamupFetchSubCalendar().subscribe({
          next: (res: any) => {
            patchState(store, { subcalendars: res.subcalendars })
          },
          error: (error) => {
            console.log('Error fetching user calendar');
          }
        })
      },
    }
  }),
);
