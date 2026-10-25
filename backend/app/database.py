from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

db_url = settings.DATABASE_URL
# Handle postgres:// vs postgresql:// for SQLAlchemy
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

from sqlalchemy.pool import StaticPool

connect_args = {}
create_engine_kwargs = {}

if "sqlite" in db_url:
    connect_args["check_same_thread"] = False
    if ":memory:" in db_url:
        create_engine_kwargs["poolclass"] = StaticPool
        connect_args["timeout"] = 30.0
    else:
        connect_args["timeout"] = 30.0
        create_engine_kwargs["pool_pre_ping"] = True
else:
    create_engine_kwargs["pool_pre_ping"] = True

engine = create_engine(db_url, connect_args=connect_args, **create_engine_kwargs)

if "sqlite" in db_url and ":memory:" not in db_url:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA busy_timeout=30000")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
