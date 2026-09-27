import { useCallback, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useTabFocusEffect } from './useTabFocusEffect';

// Devolve um ref para o ScrollView que volta ao topo (scrollY = 0) a cada troca de aba (voltar de uma tela empilhada mantém a posição).
export function useScrollToTopOnFocus() {
  const ref = useRef<ScrollView>(null);

  useTabFocusEffect(
    useCallback(() => {
      ref.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return ref;
}
