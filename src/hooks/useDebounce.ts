import { useEffect, DependencyList } from "react";
import useTimeout from "./useTimeout";

type Callback = () => void;

// Хук `useDebounce` используется для отсрочки вызова функции на заданное количество миллисекунд.
// Это полезно, например, при обработке ввода пользователя, когда вы хотите подождать, пока пользователь закончит ввод, прежде чем что-то делать.
const useDebounce = (callback: Callback, delay: number, dependencies: DependencyList) => {
  // Используется вспомогательный хук `useTimeout` для управления таймаутом.
  const { reset, clear } = useTimeout(callback, delay);

  // При изменении зависимостей сбрасывается таймер, чтобы начать ожидание заново.
  useEffect(reset, [...dependencies, reset]);

  useEffect(clear, []);
}

export default useDebounce;
