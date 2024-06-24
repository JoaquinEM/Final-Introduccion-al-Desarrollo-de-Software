import datetime
from flask import Flask, request, jsonify
from models import db, Jugador, Usuario

app = Flask(__name__)
port = 5000
app.config['SQLALCHEMY_DATABASE_URI']= 'postgresql+psycopg2://tp1:123@localhost:5432/tp1intro'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

@app.route('/')
def hello_world():
    return 'Hello World'


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


@app.route('/usuarios', methods=['POST'])
def nuevo_Usuario():
    try:
        data = request.json
        nombre_usuario = data.get('nombre')
        contraseña_usuario = data.get('contraseña')
        nuevo_usuario = Usuario(nombre_usuario=nombre_usuario, 
                                contraseña_usuario=contraseña_usuario,
                                fecha_creacion = datetime.datetime.now())
        db.session.add(nuevo_usuario)
        db.session.commit
        return jsonify({'usuario': {'nombre_usuario': nuevo_usuario.nombre_usuario,
                                    'contraseña_usuario': nuevo_usuario.contraseña_usuario,
                                    'fecha_creacion': datetime.datetime.now()}}), 201 
    except Exception as error:
        return jsonify({'mensaje': 'no se pudo crear el usuario'}), 500
    

@app.route('/usuarios/<nombre_usuario>', methods=['GET'])
def usuario(nombre_usuario):
    try:
        usuario = Usuario.query.get(nombre_usuario)

        usuario_data = {
            'nombre_usuario': usuario.nombre_usuario,
            'contraseña_usuario': usuario.contraseña_usuario
        }
        return jsonify(usuario_data), 201
    except Exception as error:
        return jsonify({'mensaje': 'El usuario no existe'}), 500


@app.route('/jugadores', methods=['POST'])
def nuevo_jugador():
    try:
        data = request.json
        nuevo_nombre = data.get('nombre')
        nuevo_jugador = Jugador(nombre=nuevo_nombre, partidas_ganadas=0, partidas_perdidas=0,
                                fecha_creacion = datetime.datetime.now(), 
                                fecha_ultima_partida=None, ultimo_contrincante=None)
        db.session.add(nuevo_jugador)
        db.session.commit
        return jsonify({'jugador': {'id': nuevo_jugador.id, 'nombre': nuevo_jugador.nombre, 
                                    'partidas_ganadas': 0, 
                                    'partidas_perdidas': 0, 
                                    'fecha_creacion': datetime.datetime.now(),  
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
    

@app.route('/jugadores/<id_jugador>/partidas_ganadas', methods=['POST'])
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


@app.route('/jugadores/<id_jugador>/partidas_perdidas', methods=['POST'])
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
        db.create.all()
    print('Started...')
    app.run(host='0.0.0.0', debug=True, port=port)    