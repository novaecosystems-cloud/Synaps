declare module '@splinetool/react-spline' {
  import React from 'react';
  export interface SplineProps {
    scene: string;
    className?: string;
    style?: React.CSSProperties;
    onLoad?: (splineApp: any) => void;
    onMouseDown?: (e: any) => void;
    onMouseUp?: (e: any) => void;
    onMouseMove?: (e: any) => void;
  }
  const Spline: React.ComponentType<SplineProps>;
  export default Spline;
}

declare module '@splinetool/react-spline/next' {
  import React from 'react';
  export interface SplineProps {
    scene: string;
    className?: string;
    style?: React.CSSProperties;
  }
  const Spline: React.ComponentType<SplineProps>;
  export default Spline;
}
