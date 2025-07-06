import logging
import os

_QUERY_FILE = os.path.join(os.getcwd(), "etc", "query", "recommendation.sql")
_SQL_QUERY_CACHE = {}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_query(query_name: str) -> str:
    if query_name in _SQL_QUERY_CACHE:
        return _SQL_QUERY_CACHE[query_name]
    with open(_QUERY_FILE, "r") as f:
        content = f.read()
    start = content.find(f"-- Query: {query_name}")
    if start == -1:
        raise ValueError(f"Query section [{query_name}] not found in SQL file.")
    start = content.find("\n", start) + 1
    end = content.find(";", start)
    if end == -1:
        end = len(content)
    query = content[start:end].strip()
    _SQL_QUERY_CACHE[query_name] = query
    return query