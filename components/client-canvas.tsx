'use client';

import dynamic from 'next/dynamic';

const ThreeDCanvas = dynamic(() => import('./three-d-canvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10 bg-transparent" />,
});

export function ClientCanvas() {
  return <ThreeDCanvas />;
}
