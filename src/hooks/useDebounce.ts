// Заимствовано от сюда: https://courses.webdevsimplified.com/view/courses/react-hooks-simplified/1327246-custom-hooks
// (по ссылке видео-описание)
import { useEffect, DependencyList } from "react";
import useTimeout from "./useTimeout";

type Callback = () => void;

const useDebounce = (callback: Callback, delay: number, dependencies: DependencyList) => {
  const { reset, clear } = useTimeout(callback, delay);

  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, []);
}

export default useDebounce;
