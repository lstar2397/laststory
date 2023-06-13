import bcrypt, smtplib, random, datetime, jwt
from flask import Flask, request, jsonify, session
from pymongo import MongoClient
from configparser import ConfigParser
from email.message import EmailMessage
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

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

def is_token_expired(token):
    try:
        payload = jwt.decode(token, verify=False)
        exp = payload['exp']
        current_time = datetime.utcnow().timestamp()
        return current_time > exp
    except jwt.ExpiredSignatureError:
        return True
    except (jwt.DecodeError, jwt.InvalidTokenError):
        return True

@jwt_required(optional=True)
def check_user():
    access_token = request.headers.get('Authorization')
    if access_token:
        access_token = access_token.split(' ')[1]  # Remove "Bearer" prefix
        if is_token_expired(access_token):
            return {'result': 'fail'}

    current_user = get_jwt_identity()
    check_user_db = db.user.find_one({'username': current_user})
    
    if current_user and check_user_db:
        return {'result': 'success'}
    
    refresh_token = request.cookies.get('refresh_token')
    if refresh_token:
        new_access_token = create_access_token(identity=current_user)
        return {'result': 'success', 'access_token': new_access_token}
    
    return {'result': 'fail'}

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

@app.route('/login', methods=['GET'])
@jwt_required(optional=True)
def login_check():
    return check_user()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(cache=False)

    username = data['username']
    password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    user_check = db.user.find_one({'username': username}, {'password': password})

    if user_check is None:
        return jsonify({'result': 'fail'}), 401
    else:
        access_token = create_access_token(identity=username, expires_delta=datetime.timedelta(seconds=30))
        refresh_token = create_access_token(identity=username, expires_delta=datetime.timedelta(days=1))
    return jsonify({'result': 'success', 'access_token': access_token, 'refresh_token': refresh_token}), 200


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
    
    return jsonify({'logout': 'success'}), 200


@app.route('/tempSave', methods=['POST'])
def write():
    data = request.get_json(cache=False)
    print(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)