import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Jugador(db.model):
    __tablename__ = 'Jugadores'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    partidas_ganadas = db.Column(db.Integer, primary_key=False)
    partidas_perdidas = db.Column(db.Integer, primary_key=False) 
    fecha_creacion = db.Column(db.Datetime, default=datetime.datetime.now())
    fecha_ultima_partida = db.Column(db.Datetime, default=datetime.datetime.now())
