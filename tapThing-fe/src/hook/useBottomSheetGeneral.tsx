// hooks/useBottomSheetGeneral.ts
import { BottomSheetGeneralRef } from '@/components/bottomSheetGeneral/BottomSheetGeneral';
import { useRef, useCallback } from 'react';

export function useBottomSheetGeneral() {
  const ref = useRef<BottomSheetGeneralRef>(null);

  const present = useCallback(() => {
    ref.current?.present();
  }, []);

  const dismiss = useCallback(() => {
    ref.current?.dismiss();
  }, []);

  return { ref, present, dismiss };
}
