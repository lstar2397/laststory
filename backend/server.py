import bcrypt, smtplib, random
from flask import Flask, request, jsonify, session
from pymongo import MongoClient
from configparser import ConfigParser
from email.message import EmailMessage
from flask_jwt_extended import JWTManager, create_access_token

# Config
config = ConfigParser()
config.read('config.ini')

# DB connection
client = MongoClient(config['DATABASE']['ADDRESS'])
db = client['test-db']

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
app.config['JWT_SECRET_KEY'] = config['SECRET_KEY']['KEY']
jwt = JWTManager(app)



@app.route('/sign_up', methods=['POST'])
def sign_up():
    data = request.get_json(cache=False)

    username = data['username']
    password = data['password']
    nickname = data['nickname']
    email = data['email']
    auth = data['auth']


    if not auth == session.get('auth_num'):
        return jsonify({'result': 'fail'}), 400
    else:
        user = db.user.find_one({'username': username})

        if user is not None:
            return jsonify({'result': 'fail'}), 409
        else:
            user_info = {
                'username': username,
                'password': bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()),
                'nickname': nickname,
                'email': email
            }
            db.user.insert_one(user_info)
            return jsonify({'result': 'success'}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(cache=False)

    username = data['username']
    password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    user_check = db.user.find_one({'username': username}, {'password': password})

    if user_check is None:
        return jsonify({'result': 'fail'}), 401
    else:
        access_token = create_access_token(identity=username)
    return jsonify({'result': 'success', 'token': access_token}), 200


@app.route('/authentication', methods=['POST'])
def email_send():
    data = request.get_json(cache=False)

    email_server = config['EMAIL_SENDER']['EMAIL_SERVER']
    email_port = config['EMAIL_SENDER']['EMAIL_PORT']
    random_number = str(random.randint(0, 999999)).zfill(6)

    msg = EmailMessage()
    msg['Subject'] = 'Last Story 이메일 인증'
    msg['From'] = config['EMAIL_SENDER']['EMAIL_ADDRESS']
    msg['To'] = data['email']
    msg.set_content('인증번호 : ' + random_number)

    smtp = smtplib.SMTP(email_server, email_port)
    smtp.ehlo()
    smtp.starttls()
    smtp.login(config['EMAIL_SENDER']['EMAIL_ADDRESS'], config['EMAIL_SENDER']['EMAIL_PASSWORD'])
    smtp.send_message(msg)

    smtp.close()
    session['auth_num'] = random_number
    return jsonify({'result': 'success'}), 200
    
@app.route('/logout', methods=['GET'])
def logout():
    return jsonify({'logout': 'success'}), 200


@app.route('/tempWrite', methods=['POST'])
def write():
    data = request.get_json(cache=False)
    print(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)