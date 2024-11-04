import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { TeamupService } from '../services/teamupServices/teamup.service';
import { ClickupService } from '../services/clickupServices/clickup.service';

type clickupState = {
    members: any,
    tasks: any,
};

const initialState: clickupState = {
    members: [],
    tasks: [],
};

export const ClickupStore = signalStore(
    { providedIn: 'root' },

    withState(initialState),

    withComputed((state) => ({
        getMembers: computed(() => state.members()),
        getTasks: computed(() => state.tasks()),
    })),

    withMethods((store) => {
        const clickupService = inject(ClickupService);

        return {
            setMembers: () => {
                clickupService.clickupFetchMembers().subscribe({
                    next: (res: any) => {
                        console.log('members: ', res.members);

                        patchState(store, { members: res.members });
                    },
                    error: (error) => {
                        console.error('Error fetching users:', error);
                    }
                });
            },
            setTasks: (email: string) => {
                clickupService.clickupFetchTasks(email).subscribe({
                    next: (res: any) => {
                        console.log(res);
                        
                        patchState(store, { tasks: res });
                    },
                    error: (error) => {
                        console.log('Error fetching user calendar');
                    }
                })
            },
        }
    }),
);
