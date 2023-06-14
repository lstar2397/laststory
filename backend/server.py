import bcrypt, smtplib, random, redis, base64, jwt
from datetime import datetime, timedelta
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

# 비밀 키 설정
app.secret_key = config['SECRET_KEY']['KEY']
redis_client = redis.Redis(host='localhost', port=6379)


@app.route('/sign_up', methods=['POST'])
def sign_up():
    data = request.get_json(cache=False)

    username = data['username']
    password = data['password']
    nickname = data['nickname']
    email = data['email']
    auth = data['auth']

    authentication_num = db.certification.find_one({'username': username})['authenticationNumber']

    if not auth == authentication_num:
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

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        exists = redis_client.exists('username')
        if not exists:
            return jsonify({'result': 'fail'}) 
        else:
            return jsonify({'result': 'success'}), 200
    else:
        data = request.get_json(cache=False)

        username = data['username']
        password = data['password']
        user_check = db.user.find_one({'username': username})
        if user_check is not None and bcrypt.checkpw(password.encode('utf-8'), user_check['password']):
            payload = {
                'username': username,
                'exp': datetime.utcnow() + timedelta(minutes=30)
            }
            token = jwt.encode(payload, app.secret_key, algorithm='HS256')
            return jsonify({'result': 'success', 'token': token}), 200
        else:
            # 로그인 실패
            return jsonify({'result': 'fail'}), 401


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

    authentication_info = {
        'createdAt': datetime.datetime.utcnow(),
        'username': data['username'],
        'authenticationNumber': random_number
    }
    db.certification.insert_one(authentication_info)
    return jsonify({'result': 'success'}), 200
    
@app.route('/logout', methods=['GET'])
def logout():
    return jsonify({'result': 'success'}), 200


@app.route('/tempSave', methods=['POST'])
def write():
    data = request.get_json(cache=False)
    title = data['title']
    encrypted = data['encrypted']
    username = redis_client.get('username')
    print(username)
    if username is None:
        return jsonify({'result': 'fail'}), 400
    else:
        tempPosts = {
            'username': username,
            'writing_time': datetime.datetime.utcnow(),
            'title': title,
            'encrypted' : encrypted
        }
        db.temp_post.insert_one(tempPosts)
        return jsonify({'result': 'success'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)