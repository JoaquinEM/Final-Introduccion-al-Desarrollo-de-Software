import datetime
import os
from flask import Flask, request, jsonify, send_from_directory
from models import db, PartidasJuegosUsuario, JuegosDelUsuario, Usuario

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
        juegos = JuegosDelUsuario.query.all()
        juegos_data = []
        for juego in juegos:
            juego_data = {
                'id': juego.id,
                'nombre_juego': juego.nombre_juego,
                'id_usuario': juego.id_usuario,
                'partidas_ganadas': juego.partidas_ganadas, 
                'partidas_perdidas': juego.partidas_perdidas,
                'partidas_empatadas': juego.partidas_empatadas,
            }
            juegos_data.append(juego_data)

        
        partidas = PartidasJuegosUsuario.query.all()
        partidas_data = []
        for partida in partidas:
            partida_data = {
                'id': partida.id,
                'id_juego': partida.nombre_juego,
                'id_usuario': partida.id_usuario,
                'estado_partida': partida.partidas_ganadas, 
                'inicio_partida': partida.partidas_perdidas,
                'final_partida': partida.partidas_empatadas,
            }
            partidas_data.append(partida_data)

        return jsonify({'juegos': juegos_data, 'partidas': partidas_data}), 201
    except Exception as error:
        return jsonify({'message:', 'No se pueden recuperar las estadisticas de los usuarios'}), 500
      
        
@app.route('/jugar/<id_usuario>', methods=['POST'])
def nuevo_juego(id_usuario):
    try:
        data = request.json
        nombre_juego = data.get('nombre')
        nuevo_juego = JuegosDelUsuario(id_usuario=id_usuario , 
                                       nombre_juego=nombre_juego, 
                                       partidas_ganadas=0, 
                                       partidas_perdidas=0, 
                                       partidas_empatadas=0)
        db.session.add(nuevo_juego)
        db.session.commit

        nueva_partida = PartidasJuegosUsuario(id_usuario=id_usuario, id_juego=nuevo_juego.id,
                                              inicio_partida=datetime.datetime.now())
        
        return jsonify({'juego': 
                        {'id': nuevo_juego.id,
                        'nombre_juego': nuevo_juego.nombre_juego,
                        'id_usuario': nuevo_juego.id_usuario,
                        'partidas_ganadas': nuevo_juego.partidas_ganadas, 
                        'partidas_perdidas': nuevo_juego.partidas_perdidas,
                        'partidas_empatadas': nuevo_juego.partidas_empatadas}, 
                        'partida':
                        {'id': nueva_partida.id,
                         'id_juego': nueva_partida.id_juego,
                         'id_usuario': nueva_partida.id_usuario,
                         'inicio_partida': nueva_partida.inicio_partida,
                         'final_partida': nueva_partida.final_partida,
                         'estado_partida': 'En Juego'}}), 201 
    except Exception as error:
        return jsonify({'mensaje': 'no se pudo crear el juego'}), 500
    

@app.route('/jugadores/<id_jugador>/partidas_ganadas', methods=['POST'])
def actualizar_partidas_ganadas(id_jugador):
    try:
        juego = JuegosDelUsuario.query.get(id_jugador)

        juego.partidas_ganadas+=1
        
        db.session.add(juego)
        db.session.commit()

        partida = PartidasJuegosUsuario.query.get(id_jugador)
        partida.final_partida = datetime.datetime.now()

        db.session.add(partida)
        db.session.commit()

        return jsonify({'partidas_ganadas': juego.partidas_ganadas}), 201
    except Exception as error: 
        return jsonify({'mensaje': 'El juego no se pudo actualizar'}), 500


@app.route('/jugadores/<id_jugador>/partidas_perdidas', methods=['POST'])
def actualizar_partidas_perdidas(id_jugador):
    try:
        juego = JuegosDelUsuario.query.get(id_jugador)

        juego.partidas_perdidas+=1

        db.session.add(juego)
        db.session.commit()

        partida = PartidasJuegosUsuario.query.get(id_jugador)
        partida.final_partida = datetime.datetime.now()

        db.session.add(partida)
        db.session.commit()

        return jsonify({'partidas_perdidas': juego.partidas_perdidas}), 201
    except Exception as error: 
        return jsonify({'mensaje': 'El juego no se pudo actualizar'}), 500 


@app.route('/jugadores/<id_jugador>/partidas_empatadas', methods=['POST'])
def actualizar_partidas_perdidas(id_jugador):
    try:
        juego = JuegosDelUsuario.query.get(id_jugador)

        juego.partidas_empatadas+=1

        db.session.add(juego)
        db.session.commit()

        partida = PartidasJuegosUsuario.query.get(id_jugador)
        partida.final_partida = datetime.datetime.now()

        db.session.add(partida)
        db.session.commit()

        return jsonify({'partidas_empatadas': juego.partidas_empatadas}), 201
    except Exception as error: 
        return jsonify({'mensaje': 'El juego no se pudo actualizar'}), 500                 


if __name__ == '__main__':
    print('Starting server...')
    db.init_app(app)
    with app.app_context():
        db.create_all()
    print('Started...')
    app.run(host='0.0.0.0', debug=True, port=port)    