import Logger from '../../../lib/util/logger';
import Player from '../../../lib/players/player';
import Quest, {QuestProgress} from '../../../lib/quests/quest';
import QuestGoal from '../../../lib/quests/quest-goal';
import SimpleMap from '../../../lib/util/simple-map';
import {
    PlayerEnterRoomEvent,
    PlayerEnterRoomPayload
} from '../../../lib/players/player-events';
import {QuestProgressEvent} from '../../../lib/quests/quest-events';

export class BountyGoal extends QuestGoal {
    public constructor(quest: Quest, cfg: SimpleMap, player: Player) {
        const config = {
            title: 'Locate NPC',

            // NPC ID to capture
            npc: null,

            // Area ID to return to
            home: null,
            ...cfg,
        };

        super(quest, config, player);

        this.state = {
            found: false,
            delivered: false,
        };

        this.listen(new PlayerEnterRoomEvent().getName(), this.enterRoom.bind(this));
    }

    private enterRoom(player: Player, payload: PlayerEnterRoomPayload): void {
        const {room} = payload;

        if (this.state.found) {
            if (room.entityReference === this.config.home) {
                // Check if we have taken the NPC home
                this.state.delivered = true;
            }
            this.dispatch(new QuestProgressEvent({progress: this.getProgress()}));
        }
        else {
            let located = false;
            const goalNpcId = this.config.npc;

            if (goalNpcId === null) {
                /* eslint-disable-next-line max-len */
                Logger.error(`Quest: BountyGoal [${this.config.title}] does not have target npc defined.`);
            }
            else {
                room.npcs.forEach(npc => {
                    if (npc.entityReference === goalNpcId) {
                        located = true;
                        npc.follow(this.player);
                    }
                });
            }

            if (located) {
                this.state.found = true;
            }

            this.dispatch(new QuestProgressEvent({progress: this.getProgress()}));
        }
    }

    public getProgress(): QuestProgress {
        // Has target been located?
        let percent = this.state.found ? 50 : 0;

        if (this.config.home) {
            // Has target been returned home?
            percent += this.state.delivered ? 50 : 0;
        }
        else {
            // No return location necessary.
            percent += 50;
        }

        const display = this.state.found ? 'Complete' : 'Not Complete';

        return {percent, display};
    }
}

export default BountyGoal;
