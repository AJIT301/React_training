// src/components/helpers/AutoEqualHeightGrid.jsx
import { useEffect, useRef } from "react";

export default function AutoEqualHeightGrid({ children }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const boxes = Array.from(container.children);

        const resizeObserver = new ResizeObserver(() => {
            // reset heights
            boxes.forEach(box => (box.style.height = "auto"));

            // find tallest box
            const maxHeight = boxes.reduce(
                (max, box) => Math.max(max, box.offsetHeight),
                0
            );

            // set all boxes to tallest
            boxes.forEach(box => (box.style.height = maxHeight + "px"));
        });

        boxes.forEach(box => resizeObserver.observe(box));

        return () => resizeObserver.disconnect();
    }, [children]);

    return (
        <div ref={containerRef} className="grid-row">
            {children}
        </div>
    );
}