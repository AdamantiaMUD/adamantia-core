import ArgParser from '../../../lib/commands/arg-parser';
import {hasValue} from '../../../lib/util/functions';
import {sayAt} from '../../../lib/communication/broadcast';

import type CharacterInterface from '../../../lib/characters/character-interface';
import type CommandDefinitionFactory from '../../../lib/commands/command-definition-factory';
import type Item from '../../../lib/equipment/item';
import type Player from '../../../lib/players/player';

const findTarget = (player: Player, thingName: string): Item | CharacterInterface | null => {
    const findableThings = new Set([
        ...player.room?.players ?? new Set(),
        ...player.equipment.values(),
        ...player.room?.npcs ?? new Set(),
        ...player.room?.items ?? new Set(),
    ]);

    return ArgParser.parseDot<Item | CharacterInterface>(thingName, Array.from(findableThings));
};

export const cmd: CommandDefinitionFactory = {
    name: 'emote',
    usage: 'emote <message>',
    aliases: [':', '/me'],
    command: () => (rawArgs: string, player: Player): void => {
        const args = rawArgs.trim();

        if (args.length === 0) {
            sayAt(player, 'Yes, but what do you want to emote?');

            return;
        }

        const FIND_TARGETS_REGEXP = /~(?<name>(?:\d+\.)?[^\s.,!?"']+)/giu;
        const REPLACE_TARGETS_REGEXP = /~(?:\d+\.)?[^\s.,!?"']+/u;

        // Build an array of items matching the emote targets (specified by ~<target> in the emote.
        const matchedTargets: Array<Item | CharacterInterface> = [];
        let execResult: ReturnType<RegExp['exec']> = FIND_TARGETS_REGEXP.exec(args);

        while (execResult !== null) {
            const targetNameFromInput = execResult[1];
            const target = findTarget(player, targetNameFromInput);

            if (!hasValue(target)) {
                sayAt(player, `I can not seem to find ${targetNameFromInput}`);

                return;
            }

            matchedTargets.push(target);

            execResult = FIND_TARGETS_REGEXP.exec(args);
        }

        // Replace the initial emote message with the found targets and broadcast to the room.
        const emoteMessage = matchedTargets
            .reduce(
                (acc: string, target: Item | CharacterInterface) => acc.replace(REPLACE_TARGETS_REGEXP, target.name),
                `${player.name} ${args}`
            )

            // Enforce punctuation
            .replace(/(?<lastCharacter>[^.?!])$/u, '$1.');

        player.room?.players.forEach((presentPlayer: Player) => {
            if (presentPlayer === player) {
                sayAt(player, `You emote "${emoteMessage}"`);
            }
            else {
                sayAt(presentPlayer, emoteMessage.replace(presentPlayer.name, 'you'));
            }
        });
    },
};

export default cmd;
