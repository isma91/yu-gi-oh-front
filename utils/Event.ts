export function CancelPropagation(event: React.MouseEvent) {
    if (event.stopPropagation) {
        event.stopPropagation();
    }
}

export function CreateReactSyntheticEvent<El extends Element, E extends Event>(): React.SyntheticEvent<El, E> {
    const event = new Event("change", { bubbles: true }) as E;

    let isDefaultPrevented = false;
    let isPropagationStopped = false;
    const preventDefault = () => {
        isDefaultPrevented = true;
        event.preventDefault();
    }
    const stopPropagation = () => {
        isPropagationStopped = true;
        event.stopPropagation();
    }
    return {
        nativeEvent: event,
        currentTarget: event.currentTarget as EventTarget & El,
        target: event.target as EventTarget & El,
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        defaultPrevented: event.defaultPrevented,
        eventPhase: event.eventPhase,
        isTrusted: event.isTrusted,
        preventDefault,
        isDefaultPrevented: () => isDefaultPrevented,
        stopPropagation,
        isPropagationStopped: () => isPropagationStopped,
        persist: () => {},
        timeStamp: event.timeStamp,
        type: event.type,
    };
}