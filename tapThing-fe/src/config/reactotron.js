export const zustandReactotron =
  (config) =>
  (set, get, api) =>
    config(
      // qui accetti gli stessi parametri di set
      (partial, replace, actionName) => {
        set(partial, replace);

        if (__DEV__ && console.tron) {
          console.tron.display({
            name: actionName || 'ZUSTAND STATE CHANGE',
            value: get(),
            preview: JSON.stringify(partial),
          });
        }
      },
      get,
      api
    );