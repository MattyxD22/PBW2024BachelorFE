import {
  signalStore,
  withComputed,
  withState,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { TeamupService } from '../services/teamupServices/teamup.service';
import { ClickupService } from '../services/clickupServices/clickup.service';
import { userType } from '../types/user.type';
import { clickupTaskType } from '../types/clickup-task.type';

type clickupState = {
  members: userType[];
  tasks: clickupTaskType[];
  activeMembers: userType[];
};

const initialState: clickupState = {
  members: [],
  tasks: [],
  activeMembers: [],
};

export const ClickupStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    getMembers: computed(() => state.members()),
    getTasks: computed(() => state.tasks()),
    getActiveMembers: computed(() => state.activeMembers()),
  })),

  withMethods((store) => {
    const clickupService = inject(ClickupService);

    return {
      setMembers: () => {
        clickupService.clickupFetchMembers().subscribe({
          next: (res: any) => {
            patchState(store, { members: res });
          },
          error: (error) => {
            console.error('Error fetching users:', error);
          },
        });
      },
      setTasks: (email: string) => {
        clickupService.clickupFetchTasks(email).subscribe({
          next: (res: any) => {
            patchState(store, { tasks: res });
          },
          error: (error) => {
            console.log('Error fetching user calendar');
          },
        });
      },

      // only fetches data, does not patch it
      fetchTaskForUser: (email: string) => {
        return clickupService.clickupFetchTasks(email);
      },

      toggleActiveMember: (member: userType) => {
        const currentMembers = store.activeMembers();
        const isMemberActive = currentMembers.some(
          (m) => m.email === member.email
        );

        patchState(store, {
          activeMembers: isMemberActive
            ? currentMembers.filter((m) => m.email !== member.email) // Remove if already selected
            : [...currentMembers, member], // Add if not selected
        });

        return isMemberActive;
      },
    };
  })
);
