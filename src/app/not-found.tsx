import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#000209] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-cyan-600/20 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Embedded CSS for Uiverse Animated SVG Face */}
      <style>{`
        .my-custom-face-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 240px;
          background: transparent;
          color: #0496ff;
        }

        .my-custom-face-container .face {
          width: 180px;
          filter: drop-shadow(0 0 20px rgba(4, 150, 255, 0.4));
        }

        .my-custom-face-container .face__eyes,
        .my-custom-face-container .face__eye-lid,
        .my-custom-face-container .face__mouth-left,
        .my-custom-face-container .face__mouth-right,
        .my-custom-face-container .face__nose,
        .my-custom-face-container .face__pupil {
          animation: eyes 1s 0.3s forwards;
        }

        .my-custom-face-container .face__eye-lid,
        .my-custom-face-container .face__pupil {
          animation-duration: 4s;
          animation-delay: 1.3s;
          animation-iteration-count: infinite;
        }

        .my-custom-face-container .face__eye-lid {
          animation-name: eye-lid;
        }
        .my-custom-face-container .face__mouth-left {
          animation-name: mouth-left;
        }
        .my-custom-face-container .face__mouth-right {
          animation-name: mouth-right;
        }
        .my-custom-face-container .face__nose {
          animation-name: nose;
        }
        .my-custom-face-container .face__pupil {
          animation-name: pupil;
        }

        @keyframes eye-lid {
          0%, 40%, 45%, 100% {
            transform: translateY(0);
          }
          42.5% {
            transform: translateY(17.5px);
          }
        }

        @keyframes eyes {
          from {
            transform: translateY(112.5px);
          }
          to {
            transform: translateY(15px);
          }
        }

        @keyframes pupil {
          0%, 37.5%, 40%, 45%, 87.5%, 100% {
            stroke-dashoffset: 0;
            transform: translate(0, 0);
          }
          12.5%, 25%, 62.5%, 75% {
            transform: translate(-35px, 0);
          }
          42.5% {
            stroke-dashoffset: 35;
            transform: translate(0, 17.5px);
          }
        }

        @keyframes mouth-left {
          from, 50% {
            stroke-dashoffset: -102;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes mouth-right {
          from, 50% {
            stroke-dashoffset: 102;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes nose {
          from {
            transform: translate(0, 0);
          }
          to {
            transform: translate(0, 22.5px);
          }
        }
      `}</style>

      {/* Main 404 Container Card */}
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center space-y-6 bg-slate-950/80 p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
        
        {/* Top Tag */}
        <div className="px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          <span>SYNAPS 404 · NODE UNREACHABLE</span>
        </div>

        {/* Animated Uiverse SVG Face */}
        <div className="w-full flex justify-center">
          <main className="my-custom-face-container">
            <svg className="face text-cyan-400" viewBox="0 0 320 380">
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

        {/* Text Section */}
        <div className="space-y-2.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-editorial tracking-tight">
            Uh oh, no Synaps for a while
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-sm mx-auto leading-relaxed font-sans">
            The knowledge node or page path you requested could not be retrieved from the Synaps Enterprise Graph.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            <span>Return to Workspace</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
