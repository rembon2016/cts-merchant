import { useEffect, useRef, useState } from "react";

export default function useResizableModalBox({
  isOpen,
  bodyHeight = "70vh",
  onClose,
  sheetRef,
}) {
  const [sheetHeight, setSheetHeight] = useState(null);
  const maxHeightRef = useRef(0);
  const hideThresholdRef = useRef(0);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPositionsRef = useRef([]);

  const snapRatios = [0.7, 0.85, 0.95];
  const snapHeightsRef = useRef([]);

  const parseBodyHeight = (val) => {
    try {
      if (!val) return window.innerHeight * 0.7;
      if (typeof val === "string" && val.endsWith("vh")) {
        const num = Number.parseFloat(val.replace("vh", ""));
        return (window.innerHeight * num) / 100;
      }
      if (typeof val === "string" && val.endsWith("px")) {
        return Number.parseFloat(val.replace("px", ""));
      }
      return Number.parseFloat(val) || window.innerHeight * 0.7;
    } catch {
      return window.innerHeight * 0.7;
    }
  };

  const computeSnapHeights = (wh) => {
    snapHeightsRef.current = snapRatios.map((r) => Math.floor(wh * r));
  };

  const initializeHeights = () => {
    const wh = window.innerHeight;
    maxHeightRef.current = Math.floor(wh * 0.95);
    hideThresholdRef.current = Math.floor(wh * 0.2);
    computeSnapHeights(wh);
    const initial = parseBodyHeight(bodyHeight);
    const boundedInitial = Math.min(initial, maxHeightRef.current);
    setSheetHeight(boundedInitial);

    if (sheetRef?.current) {
      sheetRef.current.style.height = `${boundedInitial}px`;
      sheetRef.current.style.maxHeight = `${maxHeightRef.current}px`;
      sheetRef.current.style.transition = "height 200ms";
    }
  };

  useEffect(() => {
    const onResize = () => {
      const wh = window.innerHeight;
      const prevMax = maxHeightRef.current || wh;
      const ratio = sheetHeight ? sheetHeight / prevMax : null;
      maxHeightRef.current = Math.floor(wh * 0.95);
      hideThresholdRef.current = Math.floor(wh * 0.2);
      computeSnapHeights(wh);
      const newHeight = ratio
        ? Math.min(
            Math.floor(maxHeightRef.current * ratio),
            maxHeightRef.current
          )
        : Math.min(parseBodyHeight(bodyHeight), maxHeightRef.current);
      setSheetHeight(newHeight);
      if (sheetRef?.current)
        sheetRef.current.style.maxHeight = `${maxHeightRef.current}px`;
      if (sheetRef?.current) sheetRef.current.style.height = `${newHeight}px`;
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // intentionally not including sheetRef/bodyHeight/sheetHeight to avoid frequent resets
  }, [bodyHeight]);

  useEffect(() => {
    if (isOpen) initializeHeights();
    return () => {
      document.body.style.userSelect = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const immediateClose = () => {
    isDraggingRef.current = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    try {
      globalThis.removeEventListener("touchmove", touchMoveHandler);
      globalThis.removeEventListener("touchend", touchEndHandler);
      globalThis.removeEventListener("mousemove", mouseMoveHandler);
      globalThis.removeEventListener("mouseup", mouseUpHandler);
    } catch (e) {
      console.log("Error removing event listener: \n", e);
    }
    if (sheetRef?.current) {
      sheetRef.current.style.transition = "height 150ms ease";
      sheetRef.current.style.height = `0px`;
    }
    lastPositionsRef.current = [];
    setTimeout(() => {
      onClose?.();
    }, 160);
  };

  const onDragStart = (clientY) => {
    isDraggingRef.current = true;
    startYRef.current = clientY;
    startHeightRef.current =
      sheetHeight ||
      (sheetRef?.current
        ? sheetRef.current.getBoundingClientRect().height
        : parseBodyHeight(bodyHeight));
    lastPositionsRef.current = [{ y: clientY, t: Date.now() }];
    if (sheetRef?.current) sheetRef.current.style.transition = "none";
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  };

  const onDragMove = (clientY) => {
    if (!isDraggingRef.current) return;
    const delta = startYRef.current - clientY; // up => positive

    let newHeight = startHeightRef.current + delta;
    newHeight = Math.max(0, Math.min(newHeight, maxHeightRef.current));
    setSheetHeight(newHeight);
    if (sheetRef?.current) sheetRef.current.style.height = `${newHeight}px`;

    if (newHeight <= hideThresholdRef.current) {
      immediateClose();
      return;
    }

    const positions = lastPositionsRef.current;
    positions.push({ y: clientY, t: Date.now() });
    if (positions.length > 6) positions.shift();
    lastPositionsRef.current = positions;
  };

  const onDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    const positions = lastPositionsRef.current;
    let velocity = 0;
    if (positions.length >= 2) {
      const last = positions[positions.length - 1];
      const prev = positions[positions.length - 2];
      const dy = prev.y - last.y; // positive if moving up
      const dt = last.t - prev.t; // ms
      if (dt > 0) velocity = dy / dt; // px per ms
    }

    const momentumMs = 300;
    const predictedDelta = velocity * momentumMs;
    let targetHeight = sheetHeight + predictedDelta;
    targetHeight = Math.max(0, Math.min(targetHeight, maxHeightRef.current));

    if (targetHeight <= hideThresholdRef.current) {
      onClose?.();
      lastPositionsRef.current = [];
      return;
    }

    const snaps = snapHeightsRef.current.slice();
    if (!snaps.includes(maxHeightRef.current)) snaps.push(maxHeightRef.current);

    let nearest = snaps[0];
    let minDiff = Math.abs(snaps[0] - targetHeight);
    for (let i = 1; i < snaps.length; i++) {
      const diff = Math.abs(snaps[i] - targetHeight);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = snaps[i];
      }
    }

    const snapTolerance = Math.floor(window.innerHeight * 0.04);
    const velocityThreshold = 0.06; // px per ms

    const movedUp = targetHeight > startHeightRef.current;
    let shouldSnap =
      Math.abs(nearest - targetHeight) <= snapTolerance ||
      Math.abs(velocity) >= velocityThreshold;
    if (nearest < startHeightRef.current && movedUp) shouldSnap = false;

    const finalHeight = shouldSnap ? nearest : Math.round(targetHeight);

    if (sheetRef?.current)
      sheetRef.current.style.transition =
        "height 350ms cubic-bezier(0.22, 1, 0.36, 1)";
    setSheetHeight(finalHeight);
    if (sheetRef?.current) sheetRef.current.style.height = `${finalHeight}px`;

    lastPositionsRef.current = [];
  };

  console.log("sheetHeight:", sheetHeight);

  // mouse handlers (desktop)
  const mouseMoveHandler = (e) => onDragMove(e.clientY);
  const mouseUpHandler = () => {
    onDragEnd();
    globalThis.removeEventListener("mousemove", mouseMoveHandler);
    globalThis.removeEventListener("mouseup", mouseUpHandler);
  };

  // touch handlers (mobile)
  const touchMoveHandler = (e) => {
    if (e.touches?.[0]) {
      e.preventDefault();
      onDragMove(e.touches[0].clientY);
    }
  };

  const touchEndHandler = () => {
    onDragEnd();
    globalThis.removeEventListener("touchmove", touchMoveHandler);
    globalThis.removeEventListener("touchend", touchEndHandler);
  };

  // attachers called from component
  const handleMouseDown = (e) => {
    e.preventDefault();
    onDragStart(e.clientY);
    globalThis.addEventListener("mousemove", mouseMoveHandler);
    globalThis.addEventListener("mouseup", mouseUpHandler);
  };

  const handleTouchStart = (e) => {
    if (e.touches?.[0]) {
      onDragStart(e.touches[0].clientY);
      globalThis.addEventListener("touchmove", touchMoveHandler, {
        passive: false,
      });
      globalThis.addEventListener("touchend", touchEndHandler);
    }
  };

  useEffect(() => {
    return () => {
      try {
        globalThis.removeEventListener("touchmove", touchMoveHandler);
        globalThis.removeEventListener("touchend", touchEndHandler);
        globalThis.removeEventListener("mousemove", mouseMoveHandler);
        globalThis.removeEventListener("mouseup", mouseUpHandler);
      } catch (e) {
        console.log("Error removing event listener: \n", e);
      }
    };
  }, []);

  const sheetStyle = {
    height: sheetHeight ? `${sheetHeight}px` : undefined,
    maxHeight: maxHeightRef.current ? `${maxHeightRef.current}px` : undefined,
  };

  return {
    sheetStyle,
    sheetHeight,
    handleMouseDown,
    handleTouchStart,
  };
}
