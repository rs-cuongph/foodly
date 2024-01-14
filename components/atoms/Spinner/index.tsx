import React, { memo } from "react";
import styled, { keyframes } from "styled-components";

const Spinner = memo(
  ({
    styles,
    circleStyles,
  }: {
    styles?: React.CSSProperties;
    circleStyles?: React.CSSProperties;
  }) => {
    const spin = keyframes`
        to {
            transform: rotate(360deg);
        }
    `;

    const SpinnerWrapper = styled.div`
      display: inline-block;
      width: 40px;
      height: 40px;
      width: 100%;
      display: flex;
      justify-content: center;
      position: relative;
    `;

    const SpinnerCircle = styled.div`
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 32px;
      height: 32px;
      margin: 4px;
      border: 4px solid #f95c6b;
      border-radius: 50%;
      animation: ${spin} 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: #f95c6b transparent transparent transparent;
    `;

    return (
      <SpinnerWrapper style={styles}>
        <SpinnerCircle style={circleStyles} />
      </SpinnerWrapper>
    );
  }
);

Spinner.displayName = "Spinner";

export default Spinner;
