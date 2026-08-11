declare module '@splinetool/runtime' {
  export class Application {
    constructor(canvas: HTMLCanvasElement);
    load(sceneUrl: string): Promise<void>;
    dispose(): void;
  }
}

declare module '@splinetool/react-spline' {
  import React from 'react';
  export interface SplineProps {
    scene: string;
    className?: string;
    style?: React.CSSProperties;
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
