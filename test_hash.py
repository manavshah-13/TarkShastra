from passlib.context import CryptContext
import traceback

try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    h = pwd_context.hash("admin123")
    print(f"Hash success: {h}")
except Exception as e:
    print(f"Hash failure: {e}")
    traceback.print_exc()
