from flask import Flask, request
from pymongo import MongoClient
from configparser import ConfigParser

# from flask_jwt_extended import JWTManager

# Config
config = ConfigParser()
config.read('config.ini')

# DB connection
client = MongoClient(
    "mongodb+srv://User1:775vTkegfDCQYZ31@cluster0.ufel1ex.mongodb.net/")

db = client['test-db']

app = Flask(__name__)


# app.config.update(
#     DEBUG=True,
#     JWT_SECRET_KEY=config['JWT_SECRET_KEY']['KEY']
# )

# jwt = JWTManager(app)


@app.route('/signup', methods=['POST'])
def sing_up():
    data = request.get_json(cache=False)
    print(data)
    id = data['username']
    pw = data['password']

    # user = db.user.find_one({'userid': userid})

    print(id)


if __name__ == '__main__':
    app.run(host='localhost', port=5000)
