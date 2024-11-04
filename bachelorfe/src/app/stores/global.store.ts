import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';

type globalState = {
    showNonWorkingDays: any,
};

const initialState: globalState = {
    showNonWorkingDays: false,
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
        }
    }),
);
