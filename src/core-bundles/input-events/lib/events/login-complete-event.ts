import StreamEvent from '../../../../lib/events/stream-event';

import type Player from '../../../../lib/players/player';

export interface LoginCompletePayload {
    player: Player;
}

export class LoginCompleteEvent extends StreamEvent<LoginCompletePayload> {
    /* eslint-disable @typescript-eslint/lines-between-class-members */
    public NAME: string = 'done';
    public player: Player;
    /* eslint-enable @typescript-eslint/lines-between-class-members */
}

export default LoginCompleteEvent;
