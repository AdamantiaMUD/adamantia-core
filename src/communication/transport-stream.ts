import EventEmitter from 'events';
import {AddressInfo} from 'net';

/**
 * Base class for anything that should be sending or receiving data from the player
 */
export abstract class TransportStream<T extends EventEmitter> extends EventEmitter {
    /* eslint-disable lines-between-class-members */
    public socket: T;
    public _prompted: boolean = false;
    /* eslint-enable lines-between-class-members */

    public abstract address(): AddressInfo | string;

    public abstract end(): void;

    public abstract destroy(): void;

    public abstract pause(): this;

    public abstract resume(): this;

    public abstract setEncoding(): this;

    public abstract write(message: string, encoding?: string): boolean;

    public get readable(): boolean {
        return true;
    }

    public get writable(): boolean {
        return true;
    }

    /**
     * Attach a socket to this stream
     */
    public attach(socket: T): void {
        this.socket = socket;
        this.socket.on('close', () => this.emit('close'));
    }

    /**
     * A subtype-safe way to execute commands on a specific type of stream that
     * invalid types will ignore. For given input for command (example,
     * `"someCommand"` ill look for a method called `executeSomeCommand` on the
     * `TransportStream`
     */
    public command(command: string, ...args: any[]): any {
        if (!command || !command.length) {
            throw new RangeError('Must specify a command to the stream');
        }

        const cmd = `execute${command[0].toUpperCase()}${command.substr(1)}`;

        if (typeof this[cmd] === 'function') {
            return this[cmd](...args);
        }

        return null;
    }
}

export default TransportStream;
