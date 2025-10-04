export const zustandReactotron =
  (config) =>
  (set, get, api) =>
    config(
      (partial, replace, actionName) => {
        // 👇 importante: propagare il 3° argomento
        set(partial, replace, actionName);

        if (__DEV__ && (console).tron) {
          (console).tron.display?.({
            name: actionName || 'ZUSTAND STATE CHANGE',
            value: get(),
            preview: JSON.stringify(partial),
          });
        }
      },
      get,
      api
    );
