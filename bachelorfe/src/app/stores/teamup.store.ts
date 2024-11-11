import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { TeamupService } from '../services/teamupServices/teamup.service';
import { userType } from '../types/user.type';
import { subcalendarType } from '../types/teamup-subcalendar.type';
import { teamupEventType } from '../types/teamup-events.type';

type teamupState = {
  users: userType[],
  subcalendars: subcalendarType[],
  userCalendar: teamupEventType[],
  userSearchString: string,
  parsedData: {
    userEmail: string,
    userEvents: any[],
  },
};

const initialState: teamupState = {
  users: [],
  subcalendars: [],
  userCalendar: [],
  userSearchString: '',
  parsedData: {
    userEmail: '',
    userEvents: [],
  },
};

export const TeamupStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    getUsers: computed(() => state.users()),
    getSubcalendars: computed(() => state.subcalendars()),
    getUserCalendar: computed(() => state.userCalendar()),
    getSearchedUsers: computed(() => 
      state.users().filter((user: userType) => 
        user.name.toLowerCase().includes(state.userSearchString().toLowerCase())
      )
    ),
  })),

  withMethods((store) => {
    const teamupService = inject(TeamupService);

    return {
      setUsers: () => {
        if (teamupService.isAuthenticated.value) {

          teamupService.teamupFetchUsers().subscribe({
            next: (res: any) => {
              patchState(store, { users: res });
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
        teamupService.teamupFetchUserCalendar(email, startDate, endDate).subscribe({
          next: (res: any) => {
            patchState(store, { userCalendar: res });
          },
          error: (error) => {
            console.log('Error fetching user calendar:', error);
          }
        });
      },
      setSubCalender: () => {
        teamupService.teamupFetchSubCalendar().subscribe({
          next: (res: any) => {
            patchState(store, { subcalendars: res })
          },
          error: (error) => {
            console.log('Error fetching user calendar');
          }
        })
      },
      setSearchUserString: (searchString: string) => {
        patchState(store, {userSearchString: searchString})
      },
      // only fetches data, does not patch it
      fetchUserEvents: (userEmail: string, startDate?: string, endDate?: string) => {
        return teamupService.teamupFetchUserCalendar(userEmail, startDate, endDate);
      }
    }
  }),
);
