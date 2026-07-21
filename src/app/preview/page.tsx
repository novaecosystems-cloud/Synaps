import React from 'react';

function ErrorFace() {
  return (
    <main className="my-custom-face-container">
      <svg className="face" viewBox="0 0 320 380">
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="25"
        >
          <g className="face__eyes" transform="translate(0,112.5)">
            <g transform="translate(15,0)">
              <polyline className="face__eye-lid" points="37,0 0,120 75,120"></polyline>
              <polyline
                className="face__pupil"
                points="55,120 55,155"
                strokeDasharray="35 35"
              ></polyline>
            </g>
            <g transform="translate(230,0)">
              <polyline className="face__eye-lid" points="37,0 0,120 75,120"></polyline>
              <polyline
                className="face__pupil"
                points="55,120 55,155"
                strokeDasharray="35 35"
              ></polyline>
            </g>
          </g>
          <rect
            className="face__nose"
            x="132.5"
            y="112.5"
            width="55"
            height="155"
            rx="4"
            ry="4"
          ></rect>
          <g transform="translate(65,334)" strokeDasharray="102 102">
            <path className="face__mouth-left" d="M 0 30 C 0 30 40 0 95 0"></path>
            <path className="face__mouth-right" d="M 95 0 C 150 0 190 30 190 30"></path>
          </g>
        </g>
      </svg>
    </main>
  );
}

function SuccessMessage() {
  return (
    <div className="modern-success-message w-full max-w-md">
      <button className="close-btn">×</button>
      <div className="icon-wrapper">
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="success-icon"
        >
          <path d="M9 12l2 2 4-4"></path>
          <circle r="10" cy="12" cx="12"></circle>
        </svg>
      </div>
      <div className="text-wrapper">
        <div className="title">Success</div>
        <div className="message">Operation completed successfully</div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-muted/40 p-8 flex flex-col items-center gap-16 pt-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">UI Components Preview</h1>
        <p className="text-muted-foreground">Custom error and success states</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-4xl items-center justify-items-center">
        <div className="flex flex-col items-center gap-4 w-full">
          <h2 className="text-xl font-semibold">Error State (Custom Face)</h2>
          <ErrorFace />
        </div>
        
        <div className="flex flex-col items-center gap-4 w-full">
          <h2 className="text-xl font-semibold">Success State (Modern Message)</h2>
          <SuccessMessage />
        </div>
      </div>
    </div>
  );
}
