import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Jugador(db.model):
    __tablename__ = 'Jugadores'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    partidas_ganadas = db.Column(db.Integer, nullable=False)
    partidas_perdidas = db.Column(db.Integer, nullable=False) 
    fecha_creacion = db.Column(db.Datetime, default=datetime.datetime.now())
    fecha_ultima_partida = db.Column(db.Datetime, default=datetime.datetime.now())
    ultimo_contrincante = db.Column(db.String(255), nullable=True)


class Usuario(db.model):
    __tablename__ = 'Usuarios'
    nombre_usuario = db.Column(db.String(255), nullable=False)
    contraseña_usuario = db.Column(db.String(255), nullable=False)
    fecha_creacion = db.Column(db.Datetime, default=datetime.datetime.now())

