import EventEmitter from 'events';

const _emitter = new EventEmitter();
_emitter.setMaxListeners(0); // set unlimit listener

export const emitter = _emitter;