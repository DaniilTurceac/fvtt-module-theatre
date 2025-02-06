import Logger from "./lib/Logger.js";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { Theatre } from "./Theatre.js";
import CONSTANTS from "./constants/constants.js";

export function setupSpotlightSearch(INDEX) {
    Logger.debug("Spotlight | Setting up Spotlight Index");
    INDEX.filter((item) => item?.data?.uuid?.startsWith("Actor"))?.forEach((item) => {
        const showActorHandler = (event) => {
            const actor = fromUuidSync(item.data.uuid);
            const theaterActorId = CONSTANTS.PREFIX_ACTOR_ID + actor.id;
            const navItem = Theatre.instance.getNavItemById(theaterActorId);

            if (navItem) {
                Logger.debug("Spotlight | Action: Remove Actor from Stage", actor.name);
                Theatre.instance.removeInsertById(theaterActorId);
                Theatre.removeFromNavBar(actor);
            } else {
                Logger.debug("Spotlight | Action: Show Actor on Stage", actor.name);
                Theatre.instance.activateInsertById(theaterActorId);
            }

            ui.spotlightOmnisearch?.close();
        };

        const addActorToNavHandler = (event) => {
            const actor = fromUuidSync(item.data.uuid);

            if (Theatre.isActorStaged(actor)) {
                Logger.debug("Spotlight | Action: Remove Actor from Nav Bar", actor.name);
                Theatre.removeFromNavBar(actor);
            } else {
                Logger.debug("Spotlight | Action: Add Actor to Nav Bar", actor.name);
                Theatre.addToNavBar(actor);
            }

            ui.spotlightOmnisearch?.close();
        };

        item.actions.push(
            {
                name: "Add to Bar",
                icon: `<i class="fa-solid fa-plus"></i>`,
                callback: addActorToNavHandler,
            },
            {
                name: "Show on Stage",
                icon: `<i class="fa-solid fa-masks-theater"></i>`,
                callback: showActorHandler,
            },
        );
    });
}
