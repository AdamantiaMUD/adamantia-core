import StreamEvent from '../../../../lib/events/stream-event';

import type Account from '../../../../lib/players/account';

export interface CreateCharacterPayload {
    account: Account;
}

export class CreateCharacterEvent extends StreamEvent<CreateCharacterPayload> {
    /* eslint-disable @typescript-eslint/lines-between-class-members */
    public NAME: string = 'create-character';
    public account: Account;
    /* eslint-enable @typescript-eslint/lines-between-class-members */
}

export default CreateCharacterEvent;
