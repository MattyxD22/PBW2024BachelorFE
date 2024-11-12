import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';

type globalState = {
    showNonWorkingDays: any,
    showingWeek: {startOfWeek: string, endOfWeek: string}
};

const initialState: globalState = {
    showNonWorkingDays: false,
    showingWeek: {
        startOfWeek: '',
        endOfWeek: '',
    }
};

export const GlobalStore = signalStore(
    { providedIn: 'root' },

    withState(initialState),

    withComputed((state) => ({
        getShowNonWorkingDays: computed(() => state.showNonWorkingDays()),
    })),

    withMethods((store) => {
        return {
            setShowNonWorkingDays: (state: boolean) => {
                patchState(store, {showNonWorkingDays: state})
            },

            // stores the start and end days of a week, to be used when fetching users
            // that way, the backend knows from when the data should be retrieved 
            setShowingWeek: (startOfWeek: string, endOfWeek: string) => {
                patchState(store, {showingWeek: {startOfWeek, endOfWeek}})
            }

        }
    }),
);
