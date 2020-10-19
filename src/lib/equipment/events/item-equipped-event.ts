import MudEvent from '../../events/mud-event';

import type Character from '../../characters/character';

export interface ItemEquippedPayload {
    wearer: Character;
}

export class ItemEquippedEvent extends MudEvent<ItemEquippedPayload> {
    /* eslint-disable @typescript-eslint/lines-between-class-members */
    public NAME: string = 'equip';
    public wearer: Character;
    /* eslint-enable @typescript-eslint/lines-between-class-members */
}

export default ItemEquippedEvent;
