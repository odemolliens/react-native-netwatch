type ModuleLoader<T> = () => T | { default: T };

const hasDefaultExport = <T>(module: T | { default: T }): module is { default: T } =>
  typeof module === 'object' && module !== null && 'default' in module;

export const resolveFirstAvailableModule = <T>(loaders: ReadonlyArray<ModuleLoader<T>>, errorMessage: string): T => {
  for (const load of loaders) {
    try {
      const module = load();

      return hasDefaultExport(module) ? module.default : module;
    } catch {
      // Try the next compatible module location.
    }
  }

  throw new Error(errorMessage);
};
