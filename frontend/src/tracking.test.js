import {installButtonTracking, trackEvent} from "./tracking";

describe("tracking", () => {
    beforeEach(() => {
        delete window._paq;
        delete window.gtag;
        delete window.frameGalleryAnalytics;
    });

    test("queues Matomo events before the tracker has initialized", () => {
        trackEvent("UI", "click", "Save");

        expect(window._paq).toEqual([["trackEvent", "UI", "click", "Save"]]);
    });

    test("tracks delegated button clicks", () => {
        const removeTracking = installButtonTracking();
        const button = document.createElement("button");
        button.dataset.trackCategory = "Image modal";
        button.dataset.trackAction = "close";
        button.dataset.trackName = "close button";
        document.body.appendChild(button);

        button.click();

        expect(window._paq).toEqual([["trackEvent", "Image modal", "close", "close button"]]);

        removeTracking();
        button.remove();
    });
});
