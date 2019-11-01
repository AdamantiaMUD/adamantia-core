import Item from '../equipment/item';
import Quest, {QuestProgress} from '../quests/quest';
import Room from '../locations/room';
import {MudEvent, MudEventConstructor} from '../events/mud-event';

export interface PlayerCommandQueuedPayload {
    idx: number;
}

export const PlayerCommandQueuedEvent: MudEventConstructor<PlayerCommandQueuedPayload> = class extends MudEvent<PlayerCommandQueuedPayload> {
    public static NAME: string = 'command-queued';
    public idx: number;
};

export interface PlayerDropItemPayload {
    item: Item;
}

export const PlayerDropItemEvent: MudEventConstructor<PlayerDropItemPayload> = class extends MudEvent<PlayerDropItemPayload> {
    public static NAME: string = 'drop';
    public item: Item;
};

export interface PlayerEnterRoomPayload {
    room: Room;
}

export const PlayerEnterRoomEvent: MudEventConstructor<PlayerEnterRoomPayload> = class extends MudEvent<PlayerEnterRoomPayload> {
    public static NAME: string = 'enter-room';
    public room: Room;
};

export interface PlayerExperiencePayload {
    amount: number;
}

export const PlayerExperienceEvent: MudEventConstructor<PlayerExperiencePayload> = class extends MudEvent<PlayerExperiencePayload> {
    public NAME: string = 'experience';
    public amount: number;
};

export interface PlayerGetItemPayload {
    item: Item;
}

export const PlayerGetItemEvent: MudEventConstructor<PlayerGetItemPayload> = class extends MudEvent<PlayerGetItemPayload> {
    public static NAME: string = 'get';
    public item: Item;
};

export interface PlayerQuestCompletedPayload {
    quest: Quest;
}

export const PlayerQuestCompletedEvent: MudEventConstructor<PlayerQuestCompletedPayload> = class extends MudEvent<PlayerQuestCompletedPayload> {
    public static NAME: string = 'quest-complete';
    public quest: Quest;
};

export interface PlayerQuestProgressPayload {
    progress: QuestProgress;
    quest: Quest;
}

export const PlayerQuestProgressEvent: MudEventConstructor<PlayerQuestProgressPayload> = class extends MudEvent<PlayerQuestProgressPayload> {
    public static NAME: string = 'quest-progress';
    public progress: QuestProgress;
    public quest: Quest;
};

export interface PlayerQuestStartedPayload {
    quest: Quest;
}

export const PlayerQuestStartedEvent: MudEventConstructor<PlayerQuestStartedPayload> = class extends MudEvent<PlayerQuestStartedPayload> {
    public static NAME: string = 'quest-start';
    public quest: Quest;
};

export interface PlayerQuestTurnInReadyPayload {
    quest: Quest;
}

export const PlayerQuestTurnInReadyEvent: MudEventConstructor<PlayerQuestTurnInReadyPayload> = class extends MudEvent<PlayerQuestTurnInReadyPayload> {
    public static NAME: string = 'quest-turn-in-ready';
    public quest: Quest;
};

export interface PlayerSavePayload {
    callback?: Function;
}

export const PlayerSaveEvent: MudEventConstructor<PlayerSavePayload> = class extends MudEvent<PlayerSavePayload> {
    public static NAME: string = 'save';
    public callback?: Function;
};

export const PlayerSavedEvent: MudEventConstructor<never> = class extends MudEvent<never> {
    public static NAME: string = 'saved';
};
