from flask import Flask
from models import db, Jugador

app = Flask(__name__)
port = 5000
app.config['SQLALCHEMY_DATABASE_URI']= 'postgresql+psycopg2://tp1:123@localhost:5432/tp1intro'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route('/estadisticas')
def mostrar_estadisticas():
    return 'Hello worlld'

if __name__ == '__main__':
    print('Starting server...')
    db.init_app(app)
    with app.app_context():
        db.create.all()
    print('Started...')
    app.run(host='0.0.0.0', debug=True, port=port)    