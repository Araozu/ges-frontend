import { StyleSheet, css } from "aphrodite/no-important";
import { JSX } from "solid-js";

const style = StyleSheet.create({
    card: {
        padding: "1rem",
        borderRadius: "0.5rem",
    },
    filledCard: {
        backgroundColor: "var(--surface-variant)",
    },
});

export function FilledCard(props: {children: JSX.Element}) {
    return (
        <div className={css(style.card, style.filledCard)}>
            {props.children}
        </div>
    );
}

export function OutlinedCard(props: {children: JSX.Element}) {
    return (
        <div className={css(style.card)}>
            {props.children}
        </div>
    );
}

export function ElevatedCard(props: {children: JSX.Element}) {
    return (
        <div className={css(style.card)}>
            {props.children}
        </div>
    );
}
