import { RefObject } from "react";

export default interface AutocompleteInputProps {
    placeholder: string,
    ref: RefObject<HTMLInputElement>
}