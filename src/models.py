import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'Usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nombre_usuario = db.Column(db.String(255), nullable=False)
    contraseña_usuario = db.Column(db.String(255), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.datetime.now())


class JuegosDelUsuario(db.Model):
    __tablename__ = 'Juegos_Del_Usuario'
    id = db.Column(db.Integer, primary_key=True)
    nombre_juego = db.Column(db.String(255), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('Usuarios.id'))
    partidas_ganadas = db.Column(db.Integer, nullable=False)
    partidas_perdidas = db.Column(db.Integer, nullable=False)
    partidas_empatadas = db.Column(db.Integer, nullable=False)


class PartidasJuegosUsuario(db.Model):
    __tablename__ = 'Partidas_Juegos_Usuario'
    id = db.Column(db.Integer, primary_key=True)
    id_juego = db.Column(db.Integer, db.ForeignKey('Juegos_Del_Usuario.id'))
    id_usuario = db.Column(db.Integer, db.ForeignKey('Usuarios.id'))
    nombre_juego = db.Column(db.String(255), nullable=False)
    estado_partida = db.Column(db.String(255), nullable=False)
    inicio_partida = db.Column(db.DateTime, default=datetime.datetime.now())
    final_partida = db.Column(db.DateTime, default=None)
    

