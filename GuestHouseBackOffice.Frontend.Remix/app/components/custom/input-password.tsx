import EyeSlashSvg from "~/icons/eye-slash";
import {InputIcon} from "~/components/custom/input-icon";
import React, {useRef} from "react";
import EyeSvg from "~/icons/eye";

export function InputPassword() {
    const [visible, setVisible] = React.useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleIconClick(e: React.MouseEvent<HTMLInputElement>) {
        e.preventDefault();
        e.stopPropagation();
        setVisible(!visible)
        const input = inputRef.current;
        if (input) {
            input.focus();
            const length = input.value.length;
            input.setSelectionRange(length, length);
        }
    }

    return (<InputIcon id="password" ref={inputRef} type={visible ? "input" : "password"}
                       endIcon={<div onClick={handleIconClick}>{visible ? <EyeSvg/> : <EyeSlashSvg/>}</div>}
                       placeholder="Password"/>);
}