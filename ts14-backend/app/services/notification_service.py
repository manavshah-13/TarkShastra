class NotificationService:
    async def send_notification(self, user_id: int, message: str):
        # Placeholder for real notification logic (e.g., Email, SMS, Push, SSE)
        print(f"Notification to User {user_id}: {message}")

notification_service = NotificationService()
