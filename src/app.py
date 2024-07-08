import datetime
import os
from flask import Flask, request, jsonify, send_from_directory
from models import db, Jugador, Usuario

app = Flask(__name__, static_folder='../public', static_url_path='')
port = 5000
app.config['SQLALCHEMY_DATABASE_URI']= 'postgresql+psycopg2://tp1:123@localhost:5432/tp1intro'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    nombre = data.get('nombre')
    contraseña = data.get('contraseña')

    usuario = Usuario.query.filter_by(nombre_usuario=nombre).first()

    # Lógica de autenticación (simplificada)
    if usuario:
        # Si el usuario existe, verifica la contraseña
        if usuario.contraseña_usuario == contraseña:
            return jsonify({'message': 'Login exitoso'}), 200
        else:
            return jsonify({'message': 'Credenciales incorrectas'}), 401
    else:
        return jsonify({'message': 'Usuario no encontrado'}), 404
    


@app.route('/usuarios', methods=['POST'])
def nuevo_Usuario():
    try:
        data = request.json
        nombre = data.get('nombre')
        contraseña = data.get('contraseña')

         # Verifica si ya existe un usuario con el mismo nombre
        if Usuario.query.filter_by(nombre_usuario=nombre).first():
            return jsonify({'message': 'Ya existe un usuario con ese nombre'}), 400

        nuevo_usuario = Usuario(nombre_usuario=nombre, 
                                contraseña_usuario=contraseña,
                                fecha_creacion = datetime.datetime.now())
        db.session.add(nuevo_usuario)
        db.session.commit()
        
        return jsonify({'usuario': {'id': nuevo_usuario.id,
                                    'nombre_usuario': nuevo_usuario.nombre_usuario,
                                    'contraseña_usuario': nuevo_usuario.contraseña_usuario,
                                    'fecha_creacion': nuevo_usuario.fecha_creacion}}), 201 
    except Exception as error:
        return jsonify({'mensaje': 'no se pudo crear el usuario'}), 500
    

@app.route('/usuarios/<nombre_usuario>', methods=['GET'])
def usuario(nombre_usuario):
    try:
        usuario = Usuario.query.get(nombre_usuario)

        usuario_data = {
            'id_usuario': usuario.id,
            'nombre_usuario': usuario.nombre_usuario,
            'contraseña_usuario': usuario.contraseña_usuario,
            'fecha_creacion': usuario.fecha_creacion
        }
        return jsonify(usuario_data), 201
    except Exception as error:
        return jsonify({'mensaje': 'El usuario no existe'}), 500


@app.route('/usuarios/<id_usuario>', methods=['DELETE'])
def eliminar_usuario(id_usuario):
    try:
        Usuario.query.filter_by(id=id_usuario).delete()
        return {'mensaje': 'El usuario se ha eliminado'}, 201
    except Exception as error:
        return {'mensaje': 'No se pudo eliminar el usuario'}, 500


@app.route('/estadisticas', methods=['GET'])
def get_estadisticas():
    try:
        jugadores = Jugador.query.all()
        jugadores_data = []
        for jugador in jugadores:
            jugador_data = {
                'id': jugador.id,
                'nombre': jugador.nombre,
                'partidas_ganadas': jugador.partidas_ganadas,
                'partidas_perdidas': jugador.partidas_perdidas, 
                'fecha_creacion': jugador.fecha_creacion,
                'fecha_ultima_partida': jugador.fecha_ultima_partida,
                'ultimo_contrincante': jugador.ultimo_contrincante
            }
            jugadores_data.append(jugador_data)
        return jsonify({'jugadores': jugadores_data}), 201
    except Exception as error:
        return jsonify({'message:', 'Internal error server'}), 500


@app.route('/usuarios/<id_usuario>', methods=['POST'])
def nuevo_jugador(id_usuario):
    try:
        data = request.json
        nuevo_nombre = data.get('nombre')
        nuevo_jugador = Jugador(id_usuario=id_usuario , nombre=nuevo_nombre, partidas_ganadas=0, partidas_perdidas=0,
                                fecha_creacion = datetime.datetime.now(), 
                                fecha_ultima_partida=None, ultimo_contrincante=None)
        db.session.add(nuevo_jugador)
        db.session.commit
        return jsonify({'jugador': {'id': nuevo_jugador.id,
                                    'id_usuario': nuevo_jugador.id_usuario, 
                                    'nombre': nuevo_jugador.nombre, 
                                    'partidas_ganadas': 0, 
                                    'partidas_perdidas': 0, 
                                    'fecha_creacion': nuevo_jugador.fecha_creacion,  
                                    'fecha_ultima_partida': None,
                                    'ultimo_contrincante:': None}}), 201 
    except Exception as error:
        return jsonify({'mensaje': 'no se pudo crear el jugador'}), 500
    

@app.route('/jugadores/<id_jugador>', methods=['GET'])
def jugador(id_jugador):
    try:
        jugador = Jugador.query.get(id_jugador)

        jugador_data = {
            'id': jugador.id,
            'id_usuario': jugador.id_usuario,
            'nombre': jugador.nombre,
            'partidas_ganadas': jugador.partidas_ganadas,
            'partidas_perdidas': jugador.partidas_perdidas, 
            'fecha_creacion': jugador.fecha_creacion,
            'fecha_ultima_partida': jugador.fecha_ultima_partida,
            'ultimo_contrincante': jugador.ultimo_contrincante
        }
        return jsonify(jugador_data), 201
    except Exception as error:
        return jsonify({'mensaje': 'El jugador no existe'}), 500
    

@app.route('/jugadores/<id_jugador>/partidas_ganadas/<nombre_contrincante>', methods=['POST'])
def actualizar_partidas_ganadas(id_jugador, nombre_contrincante):
    try:
        jugador = Jugador.query.get(id_jugador)

        jugador.partidas_ganadas+=1
        jugador.fecha_ultima_partida = datetime.datetime.now()
        jugador.ultimo_contrincante = nombre_contrincante

        db.session.add(jugador)
        db.session.commit()

        return jsonify({'partidas_ganadas': jugador.partidas_ganadas}), 201
    except Exception as error: 
        return jsonify({'mensaje': 'El jugador no se pudo actualizar'}), 500


@app.route('/jugadores/<id_jugador>/partidas_perdidas/<nombre_contrincante>', methods=['POST'])
def actualizar_partidas_perdidas(id_jugador, nombre_contrincante):
    try:
        jugador = Jugador.query.get(id_jugador)

        jugador.partidas_perdidas+=1
        jugador.fecha_ultima_partida = datetime.datetime.now()
        jugador.ultimo_contrincante = nombre_contrincante

        db.session.add(jugador)
        db.session.commit()

        return jsonify({'partidas_perdidas': jugador.partidas_perdidas}), 201
    except Exception as error: 
        return jsonify({'mensaje': 'El jugador no se pudo actualizar'}), 500          


if __name__ == '__main__':
    print('Starting server...')
    db.init_app(app)
    with app.app_context():
        db.create_all()
    print('Started...')
    app.run(host='0.0.0.0', debug=True, port=port)    