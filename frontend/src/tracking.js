const TRACKING_MARKER = "data-framegallery-tracking";

export const trackEvent = (category, action, name) => {
    const matomoQueue = Array.isArray(window._paq) ? window._paq : (window._paq = []);
    matomoQueue.push(["trackEvent", category, action, name]);

    if (typeof window.gtag === "function") {
        window.gtag("event", action, {
            event_category: category,
            event_label: name
        });
    }

    if (window.frameGalleryAnalytics && typeof window.frameGalleryAnalytics.trackEvent === "function") {
        window.frameGalleryAnalytics.trackEvent({category, action, name});
    }
};

export const installTrackingCode = (code, enabled) => {
    document.head.querySelectorAll(`[${TRACKING_MARKER}]`).forEach(element => element.remove());

    if (!enabled || !code?.trim()) {
        return;
    }

    const template = document.createElement("template");
    template.innerHTML = code;
    const scripts = template.content.querySelectorAll("script");

    if (scripts.length === 0) {
        const script = document.createElement("script");
        script.setAttribute(TRACKING_MARKER, "true");
        script.textContent = code;
        document.head.appendChild(script);
        return;
    }

    scripts.forEach(source => {
        const script = document.createElement("script");
        script.setAttribute(TRACKING_MARKER, "true");
        Array.from(source.attributes).forEach(attribute => {
            script.setAttribute(attribute.name, attribute.value);
        });
        script.textContent = source.textContent;
        document.head.appendChild(script);
    });
};

export const installButtonTracking = () => {
    const handleClick = (event) => {
        const target = event.target instanceof Element ? event.target : event.target?.parentElement;
        const button = target?.closest("button, a");
        if (!button || !document.contains(button)) {
            return;
        }

        const category = button.dataset.trackCategory || "UI";
        const action = button.dataset.trackAction || "click";
        const name = button.dataset.trackName || button.textContent.trim().replace(/\s+/g, " ");
        if (name) {
            trackEvent(category, action, name);
        }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
};
