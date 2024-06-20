import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Jugador(db.model):
    __tablename__ = 'Jugadores'
    id = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String(255), nullable=False)
    fecha_partida = db.Column(db.Datetime, default=datetime.datetime.now())
