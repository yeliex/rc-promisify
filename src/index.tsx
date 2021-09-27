import { useState, useMemo, useEffect, useRef, useCallback, ComponentType, createElement } from 'react';

interface IProps<T> {
    component: ComponentType<T>;
    trigger: keyof T | Array<keyof T>;
}

export const Promisify = <T extends any>(props: IProps<T> & T) => {
    const { component, trigger, ...extraProps } = props as any;
    const [innerLoading, setInnerLoading] = useState(false);
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const triggers: Array<keyof T> = useMemo(() => {
        return Array.isArray(trigger) ? trigger : [trigger];
    }, [trigger]);

    const asyncHandler = useCallback(async (trigger: keyof T, ...args) => {
        const origin = props[trigger];

        if (!origin || typeof origin !== 'function') {
            return;
        }

        const handler = origin(...args);

        if (!handler?.then) {
            return;
        }

        try {
            mounted.current && setInnerLoading(true);

            await handler;
        } finally {
            mounted.current && setInnerLoading(false);
        }
    }, [triggers, props]);

    const mergedLoading = 'loading' in props ? (props as any).loading : innerLoading;

    const componentProps = {
        ...extraProps,
    };

    triggers.forEach((k) => {
        componentProps[k] = asyncHandler.bind(undefined, k);
    });

    componentProps.loading = mergedLoading;

    return createElement(component as any, componentProps);
};
