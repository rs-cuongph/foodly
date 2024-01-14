"use client";

import styled from "styled-components";
import SimpleBar from "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";
import { useCallback, useEffect, useRef } from "react";
import Spinner from "../Spinner";

interface ScrollerProps {
  height?: number | string;
  width?: number | string;
  direction?: "vertical" | "horizontal";
  children?: JSX.Element | JSX.Element[] | string;
  autoHide?: boolean;
  isFetching?: boolean;
  hasLoadMore?: boolean;
  hasStartLoadMore?: boolean;
  scrollPosition?: "top" | "bottom";
  scrollLength?: number;
  scrollPaddingBottom?: number;
  noScrollPadding?: boolean;
  onScrollEnd?: () => void;
  onScrollStart?: () => void;
  onScroll?: () => void;
  onLoaded?: (simpleBar: SimpleBar) => void;
  paddingRight?: number;
}

export const ScrollerRoot = styled.div<ScrollerProps>((props) => ({
  maxHeight: props.height || "auto",
  width: props.width || "auto",
  minWidth: props.width || "auto",
  overflowX: props.direction === "horizontal" ? "auto" : "hidden",
  overflowY: props.direction === "horizontal" ? "hidden" : "auto",
  ".simplebar-track.simplebar-vertical .simplebar-scrollbar:before": {
    opacity: 1,
    backgroundColor: "var(--a-divder, #d8d8d8)",
    borderRadius: "2px",
    width: "4px",
    marginLeft: "3px",
  },
  ".simplebar-scrollbar": {
    minHeight: 0,
  },
  ".simplebar-scrollable-y": {
    height: "100%",
    padding: props.noScrollPadding ? 0 : "0 16px 0 0",
  },
  ".simplebar-placeholder": {
    width: "auto !important",
  },
}));

const ScrollSpinner = styled.div<{ visible?: boolean; hasLoadMore?: boolean }>(
  (props) => ({
    height: props.hasLoadMore ? 50 : 0,
    display: "flex",
    alignItems: "center",
    visibility: props.visible ? "visible" : "hidden",
    overflow: "hidden",
  })
);

export const Scroller = ({
  children,
  autoHide,
  hasLoadMore,
  hasStartLoadMore,
  scrollPosition,
  scrollLength,
  onScrollEnd,
  onScrollStart,
  onScroll,
  onLoaded,
  ...rest
}: ScrollerProps) => {
  const simpleBarRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let simpleBar: SimpleBar;
    const scrollHandler = (event: Event) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target as HTMLDivElement;
      const isBottomReached =
        scrollHeight - Math.round(scrollTop) <= clientHeight;
      if (isBottomReached) {
        onScrollEnd?.();
      }

      if (scrollTop === 0) {
        onScrollStart?.();
      }

      onScroll?.();
    };
    if (simpleBarRef.current) {
      simpleBar = new SimpleBar(simpleBarRef.current as HTMLElement, {
        autoHide: autoHide || false,
      });

      if (scrollPosition === "bottom") {
        if (scrollLength) {
          const scrollInterval = setInterval(() => {
            const scrollHeight = simpleBar.getScrollElement()?.scrollHeight;
            if (
              childrenRef.current?.querySelectorAll(".message").length ===
              scrollLength
            ) {
              simpleBar.getScrollElement().scrollTo({
                behavior: "auto",
                top: scrollHeight,
              });
              clearInterval(scrollInterval);
            }
          }, 1000);
        } else {
          const scrollHeight = simpleBar.getScrollElement()?.scrollHeight;
          simpleBar.getScrollElement().scrollTo({
            behavior: "auto",
            top: scrollHeight,
          });
        }
      }

      simpleBar
        ?.getScrollElement?.()
        ?.addEventListener("scroll", scrollHandler);
      onLoaded?.(simpleBar);
    }

    return () => {
      if (simpleBar) {
        simpleBar
          ?.getScrollElement?.()
          ?.removeEventListener("scroll", scrollHandler);
      }
    };
  }, [simpleBarRef.current, onScrollEnd]);

  return (
    <ScrollerRoot {...rest}>
      <div
        style={{
          height: "100%",
        }}
      >
        <div
          ref={simpleBarRef}
          style={{
            maxHeight: rest.height,
            paddingRight: rest?.paddingRight,
          }}
        >
          <ScrollSpinner visible={true} hasLoadMore={hasStartLoadMore}>
            <Spinner></Spinner>
          </ScrollSpinner>
          <div ref={childrenRef}>{children}</div>
          <ScrollSpinner visible={true} hasLoadMore={hasLoadMore}>
            <Spinner></Spinner>
          </ScrollSpinner>
        </div>
      </div>
    </ScrollerRoot>
  );
};
