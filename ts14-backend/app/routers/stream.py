from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
import asyncio
import json

router = APIRouter(prefix="/stream", tags=["real-time"])

@router.get("/dashboard")
async def stream_dashboard(request: Request):
    async def event_generator():
        while True:
            if await request.is_disconnected():
                break
            
            # Mock live data
            data = {
                "active_users": 5,
                "new_complaints_last_hour": 12,
                "timestamp": str(asyncio.get_event_loop().time())
            }
            yield {
                "event": "update",
                "id": "message_id",
                "retry": 15000,
                "data": json.dumps(data)
            }
            await asyncio.sleep(5) # Push every 5 seconds

    return EventSourceResponse(event_generator())
