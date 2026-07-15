"""
app/core/events/bus.py

Defines the EventBus interface and an InMemoryEventBus implementation.
The event bus decoupled modules by allowing them to communicate via events.
"""

import asyncio
import logging
from typing import Callable, Awaitable, Dict, List, Type

from .base import DomainEvent

logger = logging.getLogger(__name__)

EventHandler = Callable[[DomainEvent], Awaitable[None]]

class EventBus:
    """Abstract Event Bus interface."""
    async def publish(self, event: DomainEvent) -> None:
        raise NotImplementedError()
        
    def subscribe(self, event_type: Type[DomainEvent], handler: EventHandler) -> None:
        raise NotImplementedError()

class InMemoryEventBus(EventBus):
    """
    In-memory event bus implementation for PetVerse.
    Events are published and handlers are executed asynchronously in background tasks.
    """
    def __init__(self):
        self._handlers: Dict[Type[DomainEvent], List[EventHandler]] = {}
        
    def subscribe(self, event_type: Type[DomainEvent], handler: EventHandler) -> None:
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
        logger.info(f"Subscribed {handler.__name__} to {event_type.__name__}")
        
    async def publish(self, event: DomainEvent) -> None:
        handlers = self._handlers.get(type(event), [])
        if not handlers:
            logger.debug(f"No handlers registered for event {event.event_type}")
            return
            
        for handler in handlers:
            try:
                # Use asyncio.create_task to run handlers concurrently without blocking the publisher
                asyncio.create_task(self._run_handler(handler, event))
            except Exception as e:
                logger.error(f"Failed to dispatch event {event.event_type}: {e}")
                
    async def _run_handler(self, handler: EventHandler, event: DomainEvent) -> None:
        try:
            await handler(event)
        except Exception as e:
            logger.error(f"Error handling event {event.event_type} by {handler.__name__}: {e}")

# Global instance of the event bus
# This can be imported by routers/services to publish events
bus = InMemoryEventBus()
