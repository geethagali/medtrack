import mysql.connector
from config import Config
from flask import g

def get_db():
    if 'mysql_db' not in g:
        g.mysql_db = mysql.connector.connect(
            host=Config.MYSQL_HOST,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DB
        )
    return g.mysql_db

def close_db(e=None):
    db = g.pop('mysql_db', None)
    if db is not None:
        db.close()

def init_app(app):
    # Automatically close the database connection when the app context ends
    app.teardown_appcontext(close_db)
