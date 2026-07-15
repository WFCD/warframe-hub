'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

type PreviewState = {
  name: string;
  src: string;
  top: number;
  left: number;
};

type SynthesisPreviewContextValue = {
  open: (name: string, src: string, anchor: HTMLElement) => void;
  close: () => void;
};

const SynthesisPreviewContext = createContext<SynthesisPreviewContextValue | null>(null);

export const useSynthesisPreview = () => useContext(SynthesisPreviewContext);

type SynthesisPreviewProviderProps = {
  page: number;
  children: ReactNode;
};

export const SynthesisPreviewProvider: FC<SynthesisPreviewProviderProps> = ({
  page,
  children,
}: SynthesisPreviewProviderProps) => {
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const close = useCallback(() => setPreview(null), []);

  const open = useCallback((name: string, src: string, anchor: HTMLElement) => {
    const rect = anchor.getBoundingClientRect();
    setPreview({
      name,
      src,
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  }, []);

  useEffect(() => {
    setPreview(null);
  }, [page]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <SynthesisPreviewContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' && preview
        ? createPortal(
          <div
            role='tooltip'
            className='synth-portrait-preview'
            style={{ top: preview.top, left: preview.left }}
          >
            <img src={preview.src} alt={preview.name} className='synth-portrait-tooltip__img' />
            <div className='synth-portrait-preview__label'>{preview.name}</div>
          </div>,
          document.body
        )
        : null}
    </SynthesisPreviewContext.Provider>
  );
};
