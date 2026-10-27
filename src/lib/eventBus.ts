import mitt from "mitt";

type Events = {
    switchTab: "comments" | "ratings";
}

export const eventBus = mitt<Events>();

;
