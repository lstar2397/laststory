import bcrypt, smtplib, random, jwt, json
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
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


def is_token_exist():
    token = request.headers.get('Authorization')
    if token:
        # Bearer 접두사 제거
        token = token.replace('Bearer ', '')
        print(token)
        try:
            # 토큰 디코딩
            data = jwt.decode(token, app.secret_key, algorithms=['HS256'])
            print(data['username'])
            return data
        except jwt.ExpiredSignatureError:    # 토큰 만료 시 예외 처리
            return None
        except jwt.InvalidTokenError:    # 잘못된 토큰 예외 처리
            return None
    else:
        return None


def get_next_sequence_value(sequence_name):
    result = db.counters.find_one_and_update(
        {'_id': sequence_name},
        {'$inc': {'seq': 1}},
        return_document=True
    )
    return result['seq']


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

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(cache=False)
    username = data['username']
    password = data['password']
    user_check = db.user.find_one({'username': username})
    if user_check is not None and bcrypt.checkpw(password.encode('utf-8'), user_check['password']):
        payload = {
            'username': username,
            'exp': datetime.utcnow() + timedelta(hours=1)
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
        'createdAt': datetime.utcnow(),
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
    token = is_token_exist()
    if token is None:
        return jsonify({'result': 'fail', 'message': '로그인이 필요합니다.'}), 400
    else:
        username = token['username']
        postid = get_next_sequence_value('postid')
        tempPosts = {
            'postid': postid,
            'username': username,
            'writing_time': datetime.utcnow(),
            'title': title,
            'encrypted' : encrypted
        }
        db.temp_post.insert_one(tempPosts)
        return jsonify({'result': 'success', 'postid':postid, 'message': 'Post has been temporarily saved'}), 200

@app.route('/tempUpdate', methods=['POST'])
def update():
    data = request.get_json(cache=False)
    title = data['title']
    encrypted = data['encrypted']
    postid = data['postid']
    print(postid)
    token = is_token_exist()
    if token is None:
        return jsonify({'result': 'fail', 'message': '로그인이 필요합니다.'}), 400
    else:
        filter = {'postid': postid }
        print(filter)
        result = {
            "$set": {
                'writing_time': datetime.utcnow(),
                'title': title,
                'encrypted' : encrypted
            }
        }
        db.temp_post.update_one(filter, result)
        return jsonify({'result': 'success', 'postid':postid, 'message': 'Post has been modified'}), 200


@app.route('/myPost', methods=['POST'])
def myPost():
    token = is_token_exist()
    if token is None:
        return jsonify({'result': 'fail', 'message': '로그인이 필요합니다.'}), 400
    else:
        username = token['username']
        myPost = list(db.temp_post.find({'username': username}, {'_id': False}))
        return jsonify({'result': 'success', 'myPost': myPost}), 200


@app.route('/myPost/<int:postid>', methods=['POST'])
def get_post(postid):
    token = is_token_exist()
    if token is None:
        return jsonify({'result': 'fail', 'message': '로그인이 필요합니다.'}), 400
    else:
        myPost = db.temp_post.find_one({'postid': postid}, {'_id': False})
        return jsonify({'result': 'success', 'myPost': myPost}), 200


@app.route('/myPost/<int:postid>', methods=['DELETE'])
def delete_post(postid):
    token = is_token_exist()
    if token is None:
        return jsonify({'result': 'fail', 'message': '로그인이 필요합니다.'}), 400
    else:
        db.temp_post.delete_one({'postid': postid})
        return jsonify({'result': 'success', 'message': 'Post has been deleted'}), 200
    
    
@app.route('/myPost/<int:postid>', methods=['PUT'])
def update_post(postid):
    data = request.get_json(cache=False)
    title = data['title']
    encrypted = data['encrypted']
    token = is_token_exist()
    if token is None:
        return jsonify({'result': 'fail', 'message': '로그인이 필요합니다.'}), 400
    else:
        db.temp_post.update_one({'postid': postid}, {'$set': {'title': title, 'encrypted': encrypted}})
        return jsonify({'result': 'success', 'message': 'Post has been updated'}), 200


if __name__ == '__main__':
    app.run(host=config['SERVER']['HOST'], port=config['SERVER']['PORT'])