import { EventEmitter } from 'events';
import { logger } from '../logger';

class EventBus extends EventEmitter {
  public emitEvent(event: string, payload: any): boolean {
    logger.debug({ event, payload }, `Événement émis: ${event}`);
    return this.emit(event, payload);
  }
}

export const eventBus = new EventBus();
