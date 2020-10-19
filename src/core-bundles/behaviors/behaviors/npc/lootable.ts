import Item from '../../../../lib/equipment/item';
import Logger from '../../../../lib/common/logger';
import LootTable from '../../../../lib/combat/loot-table';
import Player from '../../../../lib/players/player';
import {NpcKilledEvent} from '../../../../lib/mobs/events';
import {PlayerCurrencyGainedEvent} from '../../../../lib/players/events';
import {hasValue} from '../../../../lib/util/functions';
import {makeCorpse} from '../../../../lib/util/combat';

import type BehaviorDefinition from '../../../../lib/behaviors/behavior-definition';
import type GameStateData from '../../../../lib/game-state-data';
import type ItemDefinition from '../../../../lib/equipment/item-definition';
import type MudEventListener from '../../../../lib/events/mud-event-listener';
import type Npc from '../../../../lib/mobs/npc';
import type SimpleMap from '../../../../lib/util/simple-map';
import type {NpcKilledPayload} from '../../../../lib/mobs/events';

export const lootable: BehaviorDefinition = {
    listeners: {
        [NpcKilledEvent.getName()]: (state: GameStateData): MudEventListener<[
            Npc,
            NpcKilledPayload,
            SimpleMap,
        ]> => async (
            npc: Npc,
            payload: NpcKilledPayload,
            config: SimpleMap
        ): Promise<void> => {
            const killer = payload.killer ?? null;

            const {room, area} = npc;

            if (!hasValue(room)) {
                // @TODO: throw?
                return;
            }

            const lootTable = new LootTable(state, config);
            const currencies = lootTable.currencies();
            const roll = await lootTable.roll();
            const items: Item[] = roll
                .map((item: string): Item | null => state.itemFactory.create(item, area))
                .filter(hasValue);

            const corpseDef: ItemDefinition = makeCorpse(npc);

            corpseDef.maxItems = items.length;

            const corpse = new Item(corpseDef, area);

            corpse.hydrate(state);

            Logger.log(`Generated corpse: ${corpse.uuid}`);

            items.forEach((item: Item): void => {
                item.hydrate(state);
                corpse.addItem(item);
            });

            room.addItem(corpse);

            state.itemManager.add(corpse);

            if (hasValue(killer) && killer instanceof Player) {
                if (hasValue(currencies)) {
                    currencies.forEach((currency: {amount: number; name: string}) => {
                        // distribute currency among group members in the same room
                        const recipients = (hasValue(killer.party) ? [...killer.party] : [killer])
                            .filter((recipient: Player) => recipient.room === killer.room);

                        let remaining = currency.amount;

                        for (const recipient of recipients) {
                            /*
                             * Split currently evenly amount recipients. The way
                             * the math works out the leader  of the party will
                             * get any remainder if the currency isn't divisible
                             * evenly
                             */
                            const amount = Math.floor(remaining / recipients.length)
                                + (remaining % recipients.length);

                            remaining -= amount;

                            recipient.dispatch(new PlayerCurrencyGainedEvent({
                                amount: amount,
                                denomination: currency.name,
                            }));

                            state.commandManager.get('look')?.execute(corpse.uuid, recipient);
                        }
                    });
                }
            }
        },
    },
};

export default lootable;
