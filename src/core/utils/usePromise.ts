const usePromise = <T = unknown>() => {
  let resolve: (value?: T) => void = () => {};
  const P = new Promise((r) => {
    resolve = r;
  });
  return [resolve, P] as [(value?: T) => void, Promise<T>];
};
export default usePromise;
