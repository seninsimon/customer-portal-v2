"use client";

import React, { FC, useRef, useState } from "react";
import { FloatingIndicator as MantineFloatingIndicator, UnstyledButton } from "@mantine/core";
import classes from "./FloatingCarousel.module.css";

interface TabItem {
    label: string;
    value: string;
}

interface FloatingIndicatorProps {
    data: TabItem[];
    active: string;
    setActive: (value: string) => void;
}

const FloatingIndicator: FC<FloatingIndicatorProps> = ({ data, active, setActive }) => {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const controlsRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const setControlRef = (value: string) => (node: HTMLButtonElement | null) => {
        if (node) {
            controlsRefs.current[value] = node;
        }
    };

    return (
        <div className={classes.root} ref={setRootRef}>
            {data.map((item) => (
                <UnstyledButton
                    key={item.value}
                    className={classes.control}
                    data-active={active === item.value || undefined}
                    ref={setControlRef(item.value)}
                    onClick={() => setActive(item.value)}
                >
                    <span className={classes.controlLabel}>{item.label}</span>
                </UnstyledButton>

            ))}
            <MantineFloatingIndicator
                target={controlsRefs.current[active] || null}
                parent={rootRef}
                className={classes.indicator}
            />
        </div>
    );
};

export default FloatingIndicator;
