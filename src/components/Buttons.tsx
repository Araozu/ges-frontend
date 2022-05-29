import { StyleSheet, css } from "aphrodite/no-important";
import { createSignal, createMemo, JSX } from "solid-js";

const styles = StyleSheet.create({
    button: {
        border: "solid 1px transparent",
        padding: "0.5rem 1rem",
        borderRadius: "1rem",
        backgroundColor: "var(--bg-color)",
        color: "var(--color)",
        cursor: "pointer",
    },
    filledTonalButton: {
        backgroundColor: "var(--secondary-container)",
        color: "var(--on-secondary-container)",
        transition: "box-shadow 150ms",
        ":hover": {
            boxShadow: "var(--elevation-level1)",
        },
    },
    filledTonalButtonPressed: {
        borderColor: "var(--secondary)",
    },
});

function usePressedState(): [() => boolean, () => void] {
    const [isPressed, setIsPressed] = createSignal(false);

    function press() {
        setIsPressed((prev) => !prev);
    }

    return [isPressed, press];
}

const filledTonalButtonClass = css(styles.button, styles.filledTonalButton);
const filledTonalButtonPressedClass = css(styles.button, styles.filledTonalButton, styles.filledTonalButtonPressed);
export function FilledTonalButton(props: {children: JSX.Element}) {
    const [isPressed, press] = usePressedState();
    const buttonClass = createMemo(() => (isPressed() ? filledTonalButtonPressedClass : filledTonalButtonClass));

    return (
        <button class={buttonClass()} onClick={press}>
            {props.children}
        </button>
    );
}
