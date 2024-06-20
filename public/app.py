from flask import Flask, jsonify
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
                'descripcion': jugador.descripcion, 
                'fecha_partida': jugador.fecha_partida
            }
            jugadores_data.append(jugador_data)
        return jsonify({'jugadores': jugadores_data})
    except Exception as error:
        print('Error', error)
        return jsonify({'message:', 'Internal error server'}), 500


if __name__ == '__main__':
    print('Starting server...')
    db.init_app(app)
    with app.app_context():
        db.create.all()
    print('Started...')
    app.run(host='0.0.0.0', debug=True, port=port)    