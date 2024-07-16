import datetime
import os
from flask import Flask, request, jsonify, send_from_directory
from models import db, PartidasJuegosUsuario, JuegosDelUsuario, Usuario

app = Flask(__name__, static_folder='../public', static_url_path='')
port = 5000
app.config['SQLALCHEMY_DATABASE_URI']= 'postgresql+psycopg2://tp1:123@localhost:5432/tp1intro'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

print('Starting server...')
db.init_app(app)

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
            return jsonify({'message': 'Login exitoso', 'idUsuario': usuario.id}), 200
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
    
"""
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
"""

@app.route('/usuarios/<id_usuario>', methods=['DELETE'])
def eliminar_usuario(id_usuario):
    try:
        Usuario.query.filter_by(id=id_usuario).delete()
        return {'mensaje': 'El usuario se ha eliminado'}, 201
    except Exception as error:
        return {'mensaje': 'No se pudo eliminar el usuario'}, 500


@app.route('/usuarios/<int:idUsuario>/juegos/<string:nombreJuego>', methods=['GET'])
def obtener_juego(idUsuario, nombreJuego):
    try:
        juego = JuegosDelUsuario.query.filter_by(id_usuario=idUsuario, nombre_juego=nombreJuego).first()
        if juego:
            
            return jsonify({
                'id': juego.id,
                'nombre_juego': juego.nombre_juego,
                'id_usuario': juego.id_usuario,
                'partidas_ganadas': juego.partidas_ganadas,
                'partidas_perdidas': juego.partidas_perdidas,
                'partidas_empatadas': juego.partidas_empatadas
            }), 200
        else:
            return jsonify({'message': 'Juego no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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


@app.route('/usuarios/<int:idUsuario>/juegos/<nombreJuego>', methods=['POST', 'GET'])
def juegos_usuario(idUsuario, nombreJuego):
    if request.method == 'POST':
        try:
            juego_existente = JuegosDelUsuario.query.filter_by(id_usuario=idUsuario, nombre_juego=nombreJuego).first()
            
            if juego_existente:
                return jsonify({
                    'mensaje': 'El juego ya existe para este usuario',
                    'idUsuario': juego_existente.id_usuario,
                    'nombreJuego': juego_existente.nombre_juego,
                    'partidasGanadas': juego_existente.partidas_ganadas,
                    'partidasPerdidas': juego_existente.partidas_perdidas,
                    'partidasEmpatadas': juego_existente.partidas_empatadas
                }), 200
            else:
                # Crear un nuevo juego para el usuario
                nuevo_juego = JuegosDelUsuario(
                    id_usuario=idUsuario,
                    nombre_juego=nombreJuego,
                    partidas_ganadas=0,
                    partidas_perdidas=0,
                    partidas_empatadas=0
                )
                db.session.add(nuevo_juego)
                db.session.commit()

                return jsonify({
                    'mensaje': 'Juego creado para el usuario',
                    'idUsuario': nuevo_juego.id_usuario,
                    'nombreJuego': nuevo_juego.nombre_juego,
                    'partidasGanadas': nuevo_juego.partidas_ganadas,
                    'partidasPerdidas': nuevo_juego.partidas_perdidas,
                    'partidasEmpatadas': nuevo_juego.partidas_empatadas
                }), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    elif request.method == 'GET':
        try:
            juego = JuegosDelUsuario.query.filter_by(id_usuario=idUsuario, nombre_juego=nombreJuego).first()
            if juego:
                return jsonify({
                    'idUsuario': juego.id_usuario,
                    'nombreJuego': juego.nombre_juego,
                    'partidasGanadas': juego.partidas_ganadas,
                    'partidasPerdidas': juego.partidas_perdidas,
                    'partidasEmpatadas': juego.partidas_empatadas
                }), 200
            else:
                return jsonify({}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500


@app.route('/jugar/<int:idUsuario>', methods=['POST'])
def jugar(idUsuario):
    data = request.get_json()
    nombreJuego = data.get('nombreJuego')

    # Busco el juego del usuario por nombre
    juego = JuegosDelUsuario.query.filter_by(id_usuario=idUsuario, nombre_juego=nombreJuego).first()

    if not juego:
        # Si el juego no existe para el usuario, lo creo
        juego = JuegosDelUsuario(nombre_juego=nombreJuego, id_usuario=idUsuario, partidas_ganadas=0, partidas_perdidas=0, partidas_empatadas=0)
        db.session.add(juego)
        db.session.commit()

    # Creo la nueva partida asociada al juego encontrado o creado
    partida = PartidasJuegosUsuario(id_juego=juego.id, id_usuario=idUsuario,nombre_juego = nombreJuego, estado_partida = 'pendiente')
    db.session.add(partida)
    db.session.commit()

    return jsonify({
        'id_partida': partida.id,
        'id_juego': juego.id,
        'id_usuario': idUsuario,
        'nombre_juego': nombreJuego,
        'estado_partida': partida.estado_partida,
        'inicio_partida': partida.inicio_partida,
        'final_partida': partida.final_partida
    })


@app.route('/finalizar_partida/<int:id_partida>', methods=['POST'])
def finalizar_partida(id_partida):
    data = request.get_json()
    estado = data.get('estado')
    id_usuario = data.get('id_usuario')
    nombre_juego = data.get('nombre_juego')

    partida = db.session.get(PartidasJuegosUsuario, id_partida)
    if not partida:
        return jsonify({'message': 'Partida no encontrada'}), 404
    
    partida.estado_partida = estado
    partida.final_partida = datetime.datetime.now()

    juego = JuegosDelUsuario.query.filter_by(id_usuario=id_usuario, nombre_juego=nombre_juego).first()
    if not juego:
        return jsonify({'message': 'Juego no encontrado'}), 404
    
    if estado == 'victoria':
        juego.partidas_ganadas += 1
    elif estado == 'derrota':
        juego.partidas_perdidas += 1
    elif estado == 'empate':
        juego.partidas_empatadas += 1

    db.session.commit()
    
    return jsonify({'message': 'Partida actualizada y estadísticas actualizadas'}), 200


@app.route('/obtener_id_partida/<int:id_usuario>/<string:nombre_juego>', methods=['GET'])
def obtener_id_partida(id_usuario, nombre_juego):
    # Consulta para obtener la última partida para el usuario y juego específico
    partida = PartidasJuegosUsuario.query.filter_by(id_usuario=id_usuario, nombre_juego=nombre_juego).order_by(PartidasJuegosUsuario.id.desc()).first()
    
    if partida:
        id_partida = partida.id
        return jsonify({'id_partida': id_partida}), 200
    else:
        return jsonify({'message': 'No se encontró ninguna partida para este usuario y juego'}), 404


if __name__ == '__main__':

    with app.app_context():
        db.create_all()
    print('Started...')
    app.run(host='0.0.0.0', debug=True, port=port)    