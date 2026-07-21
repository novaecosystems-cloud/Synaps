import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="mb-4 scale-75 md:scale-100 origin-bottom">
        <main className="my-custom-face-container" style={{ height: '300px' }}>
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
      </div>
      
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Page not found</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Oops! It looks like you've stumbled upon a broken link or a page that doesn't exist anymore.
        </p>
        <div className="pt-6">
          <Link 
            href="/dashboard" 
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
