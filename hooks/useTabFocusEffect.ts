import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useRef } from 'react';

// Só o que precisamos do objeto de navegação
interface Nav {
  getState(): { type?: string; index: number } | undefined;
  getParent(): Nav | undefined;
}

type Effect = () => void | (() => void);

// Sobe a hierarquia de navegadores até achar o das abas
function findTabNavigator(navigation: Nav) {
  let nav: Nav | undefined = navigation;
  while (nav && nav.getState()?.type !== 'tab') nav = nav.getParent();
  return nav;
}

// Como useFocusEffect, mas ignora o foco causado por voltar de uma tela empilhada
// (ex.: fechar o veículo). Roda na primeira vez e a cada troca de aba.
export function useTabFocusEffect(effect: Effect) {
  const navigation = useNavigation<Nav>();
  const indexAtBlur = useRef<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      const tabs = findTabNavigator(navigation);
      const returning = indexAtBlur.current !== null && indexAtBlur.current === tabs?.getState()?.index;
      const cleanup = returning ? undefined : effect();
      return () => {
        indexAtBlur.current = tabs?.getState()?.index ?? null;
        cleanup?.();
      };
    }, [navigation, effect])
  );
}
