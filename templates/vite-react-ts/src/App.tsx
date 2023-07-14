import React, { useRef } from "react";
import styled from "@emotion/styled";

const StyledApp = styled.div(
  () => `
    width: 100%;
    height: 600px;
    
    svg {
      background: #eee;

      @keyframes draw {
        from {
          stroke-dashoffset: 1;
        }
        to {
          stroke-dashoffset: 0;
        }
      }

      .heart {
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
        stroke: red;
        stroke-width: 5;
        fill: none;
        animation: draw 5s linear alternate infinite;
      }
    }
  `
);

export function App() {
  const width = 346;
  const height = 320;
  const ref = useRef(null);
  return (
    <StyledApp>
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={() => {
          // console.log();
        }}
      >
        <g transform={"rotate(225,152,122)"}>
          <path
            className="heart"
            d="M0 200 v-200 h200 a100,100 90 0,1 0,200 a100,100 90 0,1 -200,0 z"
            pathLength="1"
          ></path>
        </g>
      </svg>
    </StyledApp>
  );
}
