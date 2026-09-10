(() => {
    const endpoint = "https://news-api.wiimart.org/v1/news";
    const allowedElements = new Set(["A", "B", "BLOCKQUOTE", "BR", "CAPTION", "CODE", "DD", "DL", "DT", "EM", "H2", "H3", "HR", "I", "IMG", "LI", "OL", "P", "S", "SMALL", "SPAN", "STRONG", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "U", "UL"]);
    const allowedClasses = new Set(["btn", "pf", "wmw"]);
    const allowedStyles = new Set(["color:grey", "font-size:larger", "width:100%"]);

    function isSafeUrl(value, image) {
        const trimmed = value.trim();
        if (!trimmed) {
            return false;
        }
        try {
            const url = new URL(trimmed, window.location.origin);
            const webUrl = url.protocol === "https:" || (url.origin === window.location.origin && url.protocol === "http:");
            return webUrl || (!image && url.protocol === "mailto:");
        } catch {
            return false;
        }
    }

    function sanitizeBody(html) {
        const sourceTemplate = document.createElement("template");
        sourceTemplate.innerHTML = html;
        const blockedElements = new Set(["EMBED", "FORM", "IFRAME", "OBJECT", "SCRIPT", "STYLE", "SVG"]);

        function cloneNode(source) {
            if (source.nodeType === Node.TEXT_NODE) {
                return document.createTextNode(source.textContent);
            }
            if (source.nodeType !== Node.ELEMENT_NODE) {
                return document.createDocumentFragment();
            }
            if (blockedElements.has(source.tagName)) {
                return document.createDocumentFragment();
            }
            if (!allowedElements.has(source.tagName)) {
                const unwrapped = document.createDocumentFragment();
                source.childNodes.forEach(child => unwrapped.appendChild(cloneNode(child)));
                return unwrapped;
            }
            const element = document.createElement(source.tagName.toLowerCase());
            const classNames = String(source.getAttribute("class") || "").split(/\s+/).filter(name => allowedClasses.has(name));
            if (classNames.length > 0) {
                element.className = classNames.join(" ");
            }
            const style = String(source.getAttribute("style") || "").replace(/\s+/g, "").replace(/;+$/, "");
            if (allowedStyles.has(style)) {
                element.setAttribute("style", style);
            }
            if (element.tagName === "A") {
                const href = source.getAttribute("href");
                if (href && isSafeUrl(href, false)) {
                    element.setAttribute("href", href);
                }
            }
            if (element.tagName === "IMG") {
                const src = source.getAttribute("src");
                if (src && isSafeUrl(src, true)) {
                    element.setAttribute("src", src);
                    element.setAttribute("alt", source.getAttribute("alt") || "");
                    element.setAttribute("loading", "lazy");
                } else {
                    return document.createDocumentFragment();
                }
            }
            source.childNodes.forEach(child => element.appendChild(cloneNode(child)));
            return element;
        }

        const clean = document.createDocumentFragment();
        sourceTemplate.content.childNodes.forEach(child => clean.appendChild(cloneNode(child)));
        return clean;
    }

    function validItem(item) {
        return item && typeof item === "object"
            && typeof item.id === "string" && item.id.length > 0 && item.id.length <= 200
            && typeof item.title === "string" && item.title.length > 0 && item.title.length <= 256
            && typeof item.publishedAt === "string" && Number.isFinite(Date.parse(item.publishedAt))
            && typeof item.dateLabel === "string" && item.dateLabel.length > 0 && item.dateLabel.length <= 40
            && (item.dateTone === "default" || item.dateTone === "milestone")
            && typeof item.bodyHtml === "string" && item.bodyHtml.length > 0 && item.bodyHtml.length <= 200000;
    }

    function renderItem(item) {
        const details = document.createElement("details");
        details.className = "details-impt-info";
        details.dataset.newsId = item.id;
        const summary = document.createElement("summary");
        summary.appendChild(document.createTextNode(`${item.title} `));
        const date = document.createElement("span");
        date.className = "date";
        if (item.dateTone === "milestone") {
            date.style.color = "lightblue";
        }
        date.textContent = item.dateLabel;
        summary.appendChild(date);
        details.appendChild(summary);
        details.appendChild(sanitizeBody(item.bodyHtml));
        return details;
    }

    async function updateFeed(feed) {
        const parsedLimit = Number.parseInt(feed.dataset.newsLimit || "3", 10);
        const limit = Number.isInteger(parsedLimit) && parsedLimit >= 1 && parsedLimit <= 1000 ? parsedLimit : 3;
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8000);
        try {
            const items = [];
            const itemIds = new Set();
            const cursors = new Set();
            let cursor = null;
            while (items.length < limit) {
                const pageLimit = Math.min(100, limit - items.length);
                const url = new URL(endpoint);
                url.searchParams.set("limit", String(pageLimit));
                if (cursor) {
                    url.searchParams.set("cursor", cursor);
                }
                const response = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
                if (!response.ok) {
                    return;
                }
                const payload = await response.json();
                const validCursor = payload?.nextCursor === null || (typeof payload?.nextCursor === "string" && payload.nextCursor.length > 0 && payload.nextCursor.length <= 512);
                if (!payload || payload.version !== 1 || !Array.isArray(payload.items) || payload.items.length > pageLimit || !payload.items.every(validItem) || !validCursor) {
                    return;
                }
                for (const item of payload.items) {
                    if (itemIds.has(item.id)) {
                        return;
                    }
                    itemIds.add(item.id);
                    items.push(item);
                }
                if (!payload.nextCursor) {
                    break;
                }
                if (payload.items.length === 0 || cursors.has(payload.nextCursor)) {
                    return;
                }
                cursors.add(payload.nextCursor);
                cursor = payload.nextCursor;
            }
            if (items.length === 0) {
                return;
            }
            const fragment = document.createDocumentFragment();
            items.forEach(item => fragment.appendChild(renderItem(item)));
            feed.replaceChildren(fragment);
            if (typeof window.refreshImportantInfoDates === "function") {
                window.refreshImportantInfoDates();
            }
        } catch {
            return;
        } finally {
            window.clearTimeout(timeout);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("[data-news-feed]").forEach(feed => {
            void updateFeed(feed);
        });
    });
})();
