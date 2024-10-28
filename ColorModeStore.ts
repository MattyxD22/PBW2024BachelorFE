// // Colormode store
// import {patchState, signalStore, withMethods, withState} from "@ngrx/signals";

// type ColorModeState = {
//   is_darkmode: boolean;
// };

// const initialState: ColorModeState = {
//   is_darkmode: true
// };

// export const ColorModeStore = signalStore(
//   {providedIn: "root"},
//   withState(initialState),
//   withMethods((store) => {
//     return {
//       init() {
//         // Check for stored preference in localStorage
//         const storedMode = localStorage.getItem('is_darkmode');
//         let isDarkMode;

//         if (storedMode !== null) {
//           isDarkMode = storedMode === 'true';
//         } else {
//           // If no preference stored, use system preference
//           isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
//           localStorage.setItem('is_darkmode', isDarkMode.toString());
//         }

//         patchState(store, { is_darkmode: isDarkMode });
//         setColorModePrimeNG(isDarkMode);
//         setColorModeTailwind(isDarkMode);
//       },

//       toggle() {
//         const newDarkMode = !store.is_darkmode();
//         patchState(store, { is_darkmode: newDarkMode });
//         localStorage.setItem('is_darkmode', newDarkMode.toString());
//         setColorModePrimeNG(store.is_darkmode())
//         setColorModeTailwind(store.is_darkmode())
//       },
//   }})
// );

// const setColorModePrimeNG = (isDarkMode: boolean) => {
//   const mode = isDarkMode ? 'dark' : 'light'

//   let linkElement = document.getElementById('app-theme') as HTMLLinkElement;

//   if (!linkElement) {
//     linkElement = document.createElement('link');
//     linkElement.id = 'app-theme';
//     linkElement.rel = 'stylesheet';
//     linkElement.href = mode + '.css';
//     document.head.appendChild(linkElement);
//   } else {
//     linkElement.href = mode + '.css';
//   }
// }

// const setColorModeTailwind = (isDarkMode: boolean) => {
//   if (isDarkMode) {
//     document.documentElement.classList.add('dark');
//   } else {
//     document.documentElement.classList.remove('dark');
//   }
// }
