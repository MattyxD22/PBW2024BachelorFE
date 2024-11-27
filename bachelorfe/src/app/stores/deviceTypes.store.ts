// deviceType.store.ts
import {
  signalStore,
  withComputed,
  withState,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { UnitTypeStore } from './unitType.store';

type DeviceTypeState = {
  device: string;
};

const initialDeviceState: DeviceTypeState = {
  device: 'desktop',
};

export const DeviceTypeStore = signalStore(
  { providedIn: 'root' },

  // Initial state for the device type
  withState(initialDeviceState),

  // Computed properties to determine device types
  withComputed((state) => ({
    // Directly expose the current device type
    getDevice: computed(() => state.device()),

    // Getters for device status
    isMobile: computed(() => state.device() === 'mobile'),
    isTablet: computed(() => state.device() === 'tablet'),
    isDesktop: computed(() => state.device() === 'desktop'),
  })),

  withMethods((store) => {
    // Inject UnitTypeStore once in the methods context
    const unitTypeStore = inject(UnitTypeStore);

    return {
      updateDeviceType: (width: number) => {
        // Use unitTypeStore for determining breakpoints
        const mobileBreakpoint = unitTypeStore.mobile();
        const tabletBreakpoint = unitTypeStore.tablet();

        if (width <= mobileBreakpoint) {
          patchState(store, { device: 'mobile' });
        } else if (width > mobileBreakpoint && width <= tabletBreakpoint) {
          patchState(store, { device: 'tablet' });
        } else {
          patchState(store, { device: 'desktop' });
        }
      },
    };
  })
);
