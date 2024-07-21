import datetime
import os
from flask import Flask, request, jsonify, send_from_directory
from models import db, PartidasJuegosUsuario, JuegosDelUsuario, Usuario

# CONFIGURACION

# Crea una instancia de la aplicación Flask. El argumento __name__ permite a Flask ubicar la raíz del proyecto. 
app = Flask(__name__, static_folder='../public', static_url_path='')

# Define el puerto en el que la aplicación Flask escuchará las solicitudes.
port = 5000

# Configura la URI de la base de datos para SQLAlchemy usando una variable de entorno. 
# `os.getenv('DATABASE_URL')` busca el valor de la variable de entorno 'DATABASE_URL' que contiene la cadena de conexión a la base de datos.
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

#app.config['SQLALCHEMY_DATABASE_URI']= 'postgresql+psycopg2://tp1:123@localhost:5432/tp1intro'

# Desactiva la notificación de modificaciones en las bases de datos de SQLAlchemy. 
# Esto evita la generación de eventos de seguimiento que no son necesarios para la mayoría de las aplicaciones.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

print('Starting server...')
db.init_app(app)



# END-POINTS

'''
Pre:
    1. La aplicación Flask debe estar configurada correctamente y en ejecución.
    2. El directorio `static_folder` de Flask está correctamente configurado y contiene el archivo `index.html`.

Post:
    1. El servidor responderá con el archivo `index.html` cuando se acceda a la ruta `/`.
    2. El archivo `index.html` se sirve correctamente desde el directorio estático especificado.
'''

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


'''
Pre:
    1. `request.json` debe estar disponible para obtener datos JSON.
    2. La base de datos debe estar configurada y accesible.
    3. La tabla `Usuario` debe tener columnas `id`, `nombre_usuario`, `contraseña_usuario` y `fecha_creacion`.

Post
    1. Retorna mensaje de éxito y `idUsuario` con código 200 si credenciales son correctas.
    2. Retorna mensaje de error de credenciales incorrectas con código 401 si la contraseña es incorrecta.
    3. Retorna mensaje de usuario no encontrado con código 404 si el usuario no existe.

'''

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    nombre = data.get('nombre')
    contraseña = data.get('contraseña')

    usuario = Usuario.query.filter_by(nombre_usuario=nombre).first()

    if usuario:
        # Si el usuario existe, verifica la contraseña
        if usuario.contraseña_usuario == contraseña:
            return jsonify({'message': 'Login exitoso', 'idUsuario': usuario.id}), 200
        else:
            return jsonify({'message': 'Credenciales incorrectas'}), 401
    else:
        return jsonify({'message': 'Usuario no encontrado'}), 404
    


'''
Pre:
    1. `request.json` debe estar disponible para obtener datos JSON.
    2. La base de datos debe estar configurada y accesible.
    3. La tabla `Usuario` debe tener columnas `id`, `nombre_usuario`, `contraseña_usuario` y `fecha_creacion`.

Post:
    1. Retorna detalles del nuevo usuario con código 201 si se crea correctamente.
    2. Retorna mensaje de error con código 400 si ya existe un usuario con el mismo nombre.
    3. Retorna mensaje de error con código 500 si ocurre un error durante la creación.

'''

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
    

'''
Pre:
    1. `request.json` debe estar disponible para obtener datos JSON.
    2. La base de datos debe estar configurada y accesible.
    3. La tabla `Usuario` debe tener columnas necesarias.
    4. Debe existir un usuario con el `id` proporcionado.

Post:
    1. Retorna los detalles del usuario modificado con código 200 si se modifica correctamente.
    2. Retorna mensaje de error con código 400 si no se proporciona contraseña.
    3. Retorna mensaje de error con código 404 si no existe un usuario con el `id` proporcionado.
    4. Retorna mensaje de error con código 500 si ocurre un error durante la modificación.

'''

@app.route('/usuarios/<int:id>', methods=['PUT'])
def modificar_Usuario(id):
    try:
        data = request.json
        contraseña = data.get('contraseña')

        if not contraseña:
            return jsonify({'mensaje': 'No se proporcionó contraseña'}), 400
    
        # Verifica si ya existe un usuario con el mismo nombre
        usuario = Usuario.query.get(id)
        if usuario:
            # Modifica el usuario existente
            usuario.contraseña_usuario = contraseña
            db.session.commit()
            
            return jsonify({'usuario': {'id': usuario.id,
                                        'nombre_usuario': usuario.nombre_usuario,
                                        'contraseña_usuario': usuario.contraseña_usuario,
                                        'fecha_creacion': usuario.fecha_creacion}}), 200 
        else:
            return jsonify({'mensaje': 'No existe un usuario con ese nombre'}), 404
    except Exception as error:
        return jsonify({'mensaje': 'No se pudo modificar el usuario'}), 500
     
'''
Pre:
    1. `id_usuario` debe ser un identificador válido para un usuario.
    2. La base de datos debe estar configurada y accesible.
    3. La tabla `Usuario` debe tener las columnas `id`, `nombre_usuario`, `contraseña_usuario`, y `fecha_creacion`.

Post:
    1. Retorna los detalles del usuario con código 200 si el usuario existe.
    2. Retorna mensaje de error con código 404 si el usuario no existe.
    3. Retorna mensaje de error con código 500 si ocurre un error al obtener el usuario.
'''

@app.route('/usuarios/<id_usuario>', methods=['GET'])
def usuario(id_usuario):
    try:
        usuario = Usuario.query.get(id_usuario)
        if not usuario:
            return jsonify({'mensaje': 'El usuario no existe'}), 404

        return jsonify({'usuario_data' : {
            'id_usuario': usuario.id,
            'nombre_usuario': usuario.nombre_usuario,
            'contraseña_usuario': usuario.contraseña_usuario,
            'fecha_creacion': usuario.fecha_creacion
        }}), 200
    
    except Exception as error:
        return jsonify({'mensaje': 'Error al obtener el usuario'}), 500



'''
Pre:
    1. `id_usuario` debe ser un identificador válido para un usuario.
    2. Las tablas `PartidasJuegosUsuario` y `JuegosDelUsuario` deben tener una columna `id_usuario`.
    3. La base de datos debe estar configurada y accesible.

Post:
    1. El usuario y todos los registros relacionados se eliminan con código 201 si la operación es exitosa.
    2. Retorna mensaje de error con código 500 si ocurre un error al eliminar el usuario o registros relacionados.

'''

#Primero se debe borrar registros relacionados a la clave foranea
@app.route('/usuarios/<id_usuario>', methods=['DELETE'])
def eliminar_usuario(id_usuario):
    try:
        partidas = PartidasJuegosUsuario.query.filter_by(id_usuario=id_usuario).all()
        for partida in partidas:
            db.session.delete(partida)
        juegos = JuegosDelUsuario.query.filter_by(id_usuario=id_usuario).all()
        for juego in juegos:
            db.session.delete(juego)
        usuario = Usuario.query.get(id_usuario)
        if usuario:
            db.session.delete(usuario)
            db.session.commit()
        return {'mensaje': 'El usuario se ha eliminado'}, 201
    except Exception as error:
        return {'mensaje': 'No se pudo eliminar el usuario'}, 500


'''
Pre:
    1. `idUsuario` debe ser un identificador válido de un usuario.
    2. `nombreJuego` debe ser una cadena de texto representando el nombre del juego.
    3. La base de datos debe estar configurada y accesible.
    4. La tabla `JuegosDelUsuario` debe tener las columnas `id_usuario` y `nombre_juego`.

Post:
    1. Retorna un objeto JSON con los detalles del juego con código 200 si el juego existe.
    2. Retorna un mensaje de error con código 404 si el juego no se encuentra.
    3. Retorna un mensaje de error con código 500 si ocurre un error durante la consulta.

'''

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


'''
Pre:
    1. `id_usuario` debe ser un identificador válido de un usuario.
    2. La base de datos debe estar configurada y accesible.
    3. La tabla `JuegosDelUsuario` debe contener información sobre los juegos del usuario.
    4. La tabla `PartidasJuegosUsuario` debe contener información sobre las partidas del usuario.

Post:
    1. Retorna un objeto JSON con las estadísticas de juegos y partidas del usuario con código 201 si la consulta es exitosa.
    2. Retorna un mensaje de error con código 500 si ocurre un error durante la consulta.

'''

@app.route('/estadisticas', methods=['GET'])
def get_estadisticas():
    id_usuario = request.args.get('id_usuario')
    try:
        juegos = JuegosDelUsuario.query.filter_by(id_usuario=id_usuario).all()
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

        
        partidas = PartidasJuegosUsuario.query.filter_by(id_usuario=id_usuario).all()  # Filtra por ID de usuario
        partidas_data = []  
        for partida in partidas:

            
            partida_data = {
                'id': partida.id,
                'id_juego': partida.id_juego,
                'id_usuario': partida.id_usuario,
                'estado_partida': partida.estado_partida, 
                'inicio_partida': partida.inicio_partida.isoformat(),
                'final_partida': partida.final_partida.isoformat(),
            }
            partidas_data.append(partida_data)

        return jsonify({'juegos': juegos_data, 'partidas': partidas_data}), 201
    except Exception as error:
        return jsonify({'message:': 'No se pueden recuperar las estadisticas de los usuarios'}), 500


'''
Pre:
    1. `idUsuario` debe ser un identificador válido de un usuario.
    2. `nombreJuego` debe ser el nombre del juego a consultar o crear.
    3. La base de datos debe estar configurada y accesible.
    4. La tabla `JuegosDelUsuario` debe existir y estar correctamente configurada.

Post:
    1. POST: 
        - Si el juego ya existe, retorna un mensaje con los detalles del juego y código 200.
        - Si el juego no existe, crea el juego para el usuario, retorna los detalles del nuevo juego y código 201.
        - Retorna un mensaje de error con código 500 si ocurre un error durante el proceso.

    2. GET:
        - Si el juego existe, retorna los detalles del juego y código 200.
        - Si el juego no existe, retorna un objeto vacío y código 404.
        - Retorna un mensaje de error con código 500 si ocurre un error durante el proceso.

'''

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


'''
Pre:
    1. `idUsuario` debe ser un identificador válido de un usuario.
    2. `nombreJuego` debe ser el nombre del juego que se está iniciando.
    3. La base de datos debe estar configurada y accesible.
    4. Las tablas `JuegosDelUsuario` y `PartidasJuegosUsuario` deben existir y estar correctamente configuradas.

Post:
    1. Si el juego no existe para el usuario, se crea un nuevo juego y se asocia con el usuario.
    2. Se crea una nueva partida asociada al juego (existente o recién creado).
    3. Retorna los detalles de la partida creada, incluyendo `id_partida`, `id_juego`, `id_usuario`, `nombre_juego`, `estado_partida`, `inicio_partida`, y `final_partida`.
    4. Retorna un mensaje de error con código 500 si ocurre un error durante el proceso.

'''

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
    inicio_partida = datetime.datetime.now()
    partida = PartidasJuegosUsuario(id_juego=juego.id, id_usuario=idUsuario,nombre_juego = nombreJuego, estado_partida = 'pendiente', inicio_partida = inicio_partida)
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



'''
Pre:
    1. `id_partida` debe ser un identificador válido de una partida existente.
    2. `estado` debe ser uno de los valores válidos ('victoria', 'derrota', 'empate').
    3. `id_usuario` debe ser un identificador válido de un usuario.
    4. `nombre_juego` debe ser el nombre del juego asociado a la partida.
    5. La base de datos debe estar configurada y accesible.
    6. Las tablas `PartidasJuegosUsuario` y `JuegosDelUsuario` deben existir y estar correctamente configuradas.

Post:
    1. La partida con `id_partida` se actualiza con el nuevo estado y la fecha de finalización.
    2. Las estadísticas del juego asociado se actualizan según el estado de la partida.
    3. Retorna un mensaje de éxito si la operación es exitosa.
    4. Retorna un mensaje de error con código 404 si la partida o el juego no se encuentran.
    5. Retorna un mensaje de error con código 500 si ocurre un error durante el proceso.

'''

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


'''
Pre:
    1. `id_usuario` debe ser un identificador válido de un usuario existente.
    2. `nombre_juego` debe ser el nombre del juego para el cual se desea obtener la partida.
    3. La base de datos debe estar configurada y accesible.
    4. La tabla `PartidasJuegosUsuario` debe existir y estar correctamente configurada.

Post:
    1. Retorna el `id_partida` de la última partida asociada al usuario y al juego especificado si existe.
    2. Retorna un mensaje de error con código 404 si no se encuentra ninguna partida para el usuario y el juego especificado.
    3. Retorna un mensaje de error con código 500 si ocurre un error durante la consulta.

'''

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