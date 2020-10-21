import {sprintf} from 'sprintf-js';

import {PlayerCommandQueuedEvent} from '../../../lib/players/events';
import {sayAt} from '../../../lib/communication/broadcast';

import type Player from '../../../lib/players/player';
import type PlayerEventListener from '../../../lib/events/player-event-listener';
import type PlayerEventListenerDefinition from '../../../lib/events/player-event-listener-definition';
import type {PlayerCommandQueuedPayload} from '../../../lib/players/events';

export const evt: PlayerEventListenerDefinition<PlayerCommandQueuedPayload> = {
    name: PlayerCommandQueuedEvent.getName(),
    listener: (): PlayerEventListener<PlayerCommandQueuedPayload> => (
        player: Player,
        {idx}: PlayerCommandQueuedPayload
    ): void => {
        const command = player.commandQueue.queue[idx];
        const ttr = sprintf('%.1f', player.commandQueue.getTimeTilRun(idx));

        sayAt(player, `{yellow.bold Executing} '{white ${command.label}}' {yellow in} {white ${ttr}} {yellow seconds.}`);
    },
};

export default evt;
