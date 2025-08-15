import React, { forwardRef } from "react";
import SimpleBar, { type Props as SimpleBarProps } from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

type ScrollAreaProps = SimpleBarProps & {
  className?: string;
  children: React.ReactNode;
  /** Hide horizontal overflow on the scrollable node */
  noX?: boolean;
};

// Thin wrapper around SimpleBar to keep our import and defaults in one place.
const ScrollArea = forwardRef<HTMLElement, ScrollAreaProps>(function ScrollArea(
  { className, children, autoHide = true, noX = false, ...rest },
  ref,
) {
  const sProps = (rest as any).scrollableNodeProps || {};
  const scrollableNodeProps = {
    ...sProps,
    ref: ref as any,
    style: { ...(sProps.style || {}), ...(noX ? { overflowX: "hidden" } : {}) },
  };
  // Remove scrollableNodeProps from rest to avoid duplication
  const { scrollableNodeProps: _omit, ...passThrough } = rest as any;
  return (
    <SimpleBar className={className} autoHide={autoHide} scrollableNodeProps={scrollableNodeProps} {...passThrough}>
      {children}
    </SimpleBar>
  );
});

export default ScrollArea;
