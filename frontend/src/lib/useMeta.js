import { useEffect } from "react";

export function useMeta(title, description) {
    useEffect(() => {
        if (title) document.title = title;
        if (description) {
            let tag = document.querySelector('meta[name="description"]');
            if (tag) tag.setAttribute("content", description);
        }
    }, [title, description]);
}
