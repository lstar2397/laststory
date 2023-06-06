import bcrypt, smtplib, random
from flask import Flask, request, jsonify, session
from pymongo import MongoClient
from configparser import ConfigParser
from email.message import EmailMessage

# Config
config = ConfigParser()
config.read('config.ini')

# DB connection
client = MongoClient(config['DATABASE']['ADDRESS'])

db = client['test-db']

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
app.secret_key = config['JWT_SECRET_KEY']['KEY']

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
        return jsonify({'result': 'fail'}), 400
    else:
        return jsonify({'result': 'success'})
    

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


@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json(cache=False)

    if data['auth_num'] == session['auth_num']:
        session.pop('auth_num')
        return jsonify({'result': 'success'}), 200
    else:
        session.pop('auth_num')
        return jsonify({'result': 'fail'}), 400
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)