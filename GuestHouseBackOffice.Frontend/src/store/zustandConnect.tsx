import React from 'react';
import shallow from 'zustand/shallow';

//https://stackoverflow.com/questions/66084662/how-to-set-zustand-state-in-a-class-component

export default function connectZustand(useStore : any, selector : any) {
    return (Component : any) =>
        React.forwardRef((props, ref) => <Component ref={ref} {...props} {...useStore(selector, shallow)} />);
}
