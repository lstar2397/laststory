from flask import Flask, request, jsonify
from pymongo import MongoClient
from configparser import ConfigParser

# Config
config = ConfigParser()
config.read('config.ini')

# DB connection
client = MongoClient(config['DATABASE']['ADDRESS'])

db = client['test-db']

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False


@app.route('/sign_up', methods=['POST'])
def sign_up():
    data = request.get_json(cache=False)

    print(data)

    username = data['username']
    password = data['password']
    nickname = data['nickname']
    email = data['email']

    user = db.user.find_one({'username': username})

    if user is not None:
        return jsonify({'result': 'fail'}), 409
    else:
        user_info = {
            'username': username,
            'password': password,
            'nickname': nickname,
            'email': email
        }
        db.user.insert_one(user_info)
        return jsonify({'result': 'success'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
