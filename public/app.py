import datetime
from flask import Flask, request, jsonify
from models import db, Jugador

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
                'fecha_ultima_partida': jugador.fecha_ultima_partida
            }
            jugadores_data.append(jugador_data)
        return jsonify({'jugadores': jugadores_data})
    except Exception as error:
        print('Error', error)
        return jsonify({'message:', 'Internal error server'}), 500

@app.route('/jugadores', methods=['POST'])
def nuevo_jugador():
    try:
        data = request.json
        nuevo_nombre = data.get('nombre')
        nuevo_jugador = Jugador(nombre=nuevo_nombre, partidas_ganadas=0, partidas_perdidas=0,
                                fecha_creacion = datetime.datetime.now(), 
                                fecha_ultima_partida=None)
        db.session.add(nuevo_jugador)
        db.session.commit
        return jsonify({'jugador': {'id': nuevo_jugador.id, 'nombre': nuevo_jugador.nombre, 
                                    'partidas_ganadas': 0, 
                                    'partidas_perdidas': 0, 
                                    'fecha_creacion': datetime.datetime.now(),  
                                    'fecha_ultima_partida': None}}), 201 
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
            'fecha_ultima_partida': jugador.fecha_ultima_partida
        }
        return jsonify(jugador_data)
    except:
        return jsonify({'mensaje': 'El jugador no existe'})



if __name__ == '__main__':
    print('Starting server...')
    db.init_app(app)
    with app.app_context():
        db.create.all()
    print('Started...')
    app.run(host='0.0.0.0', debug=True, port=port)    