from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
#from flask_restful import Resource,Api
import db

db.setup()
app = Flask(__name__)
CORS(app)
# api=Api(app)
users = {"1234":"user1","5678":"user2"}
questions = {"1":"ques1","2":"ques2"}

# class userlist(Resource):
#     def get(self):
#         return jsonify(users)

# class indivuser(Resource):
#     def get(self, user_id):
#         return jsonify(users[user_id])



# api.add_resource(userlist, "/user")
# api.add_resource(indivuser, "/user/<string:user_id>")


@app.route




@app.route("/user",methods = ['POST','GET','PUT','DELETE'])
def user():
   
   if request.method ==  'POST':                                #request format should include all fields required to store the data of the user
        if request.is_json:
            content = request.get_json()
            return jsonify({users["1234"]:"user1"})
   elif request.method == 'GET':                                #request body is empty, only username is required in the url
        name = request.args.get("name1")
        content=db.get_user_from_name(name)
        return jsonify(content)
   elif request.method == "PUT":                                #request body should contain some, if not all fields of the user datatype, username required in url
        if request.is_json:
            curr_name = request.args.get("name1")
            content = request.get_json()
            if "location" in content.keys():
                db.update_location(curr_name,content["location"])
            if "userrating" in content.keys():
                db.update_userrating(curr_name,content["userrating"])
            if "password" in content.keys():
                db.update_password(curr_name,content["password"])
            if "username" in content.keys():
                db.update_username(curr_name,content["username"])
        return jsonify(content)
   else:                                                        #empty request body, username required in url
        name = request.args.get("name1")
        return jsonify({name: "success"})

@app.route("/answers_quesid",methods = ['GET'])
def answers_quesid():
    quesid = request.args.get("quesid")
    answers = db.get_ans_from_ques(quesid)
    return jsonify(answers)

@app.route("/answers_authid",methods = ['GET'])
def answers_authid():
    authid = request.args.get("name")
    answers = db.get_ans_from_name(authid)
    return jsonify(answers)


@app.route("/users_list",methods = ["GET"])
def userslist():

    if request.method == "GET":
        users = db.get_all_users()
        if users is None:
           return jsonify({"name": "success"})
        return jsonify(users)


@app.route("/question",methods = ['POST','GET'])
def question():

    if request.method == "POST":
        if request.is_json:
            content = request.get_json()
            data= db.add_question(content)
            db.clear()   # removes redundant entries
            return jsonify(content)
    else:
        questions = db.get_questions()
        return jsonify(questions)

@app.route("/answers",methods = ['POST','GET'])
def answer():
    if request.method == "POST":
        if request.is_json:
            content = request.get_json()
            db.add_answer(content)
         # removes redundant entries
            print(content)
            return jsonify( content)
    else:
        questions = db.get_answers()
        return jsonify(questions)






@app.route("/question_quesid",methods = ['GET','PUT','DELETE'])

def question_quesid():
    if request.method == "GET":
        quesid = request.args.get("questionid")
        return jsonify({quesid: questions[quesid]})
    elif request.method == "PUT":
        quesid = request.args.get("quesid")
        content =  request.get_json()
        return jsonify({quesid: content})
    else:
        quesid = request.args.get("quesid")
        return jsonify({quesid: questions[quesid]})

"""@app.route("/question_upvote",methods = ['GET','PUT'])

def question_title():
   if request.method == "PUT":
     content=  request.get_json()
     db.up_question(content[""])
     return jsonify(content)

"""
      
    

@app.route("/question_title",methods = ['GET','DELETE'])

def question_title():
   if request.method == "GET":
     title = request.args.get("title")
     name = request.args.get("username")
     print(type(name))
     content = db.get_questions_from_title(title,name)
     return jsonify(content)
   elif request.method == "DELETE":
     title = request.args.get("quesid")
     content = db.del_ques(title)
     return jsonify({})

      
      

@app.route("/question_authid",methods = ['GET'])

def question_authid():
    authid = request.args.get("authid")
    return jsonify({"1": authid})



@app.route("/user_login",methods = ["GET"])

def user_login():
    username = request.args.get("name1")
    pw = request.args.get("password1")
    content = db.user_login(username)
    if content == None:
        return jsonify({"errorcode":"false"})
    elif not(content["password"] == pw):
        return jsonify({"errorcode":"false"})
    else:
        content["errorcode"] = "true"
        return jsonify(content)
    



@app.route("/user_signup",methods = ["GET","POST"])

def user_signup():
    if request.method == "POST":
     content = request.get_json()
     dict1 = {"username" : content["name2"], "password": content["password2"]}
     val1 = db.add_user(dict1)                                    #khud ka function daaldiyo
     if val1 == True:
        return jsonify(content)
     else:
        return jsonify({"stat":"false"})
    


@app.route("/follow",methods = ["GET","POST","DELETE"])

def follow():
    if request.method == "POST":
     content = request.get_json()
     dict1 = {"followername" : content["followername"], "followeename": content["followeename"]}
     val1 = db.add_follow(dict1)                                    #khud ka function daaldiyo
     return jsonify(content)
    elif request.method == "DELETE":
     content = request.get_json()
     dict1 = {"followername" : content["followername"], "followeename": content["followeename"]}
     db.del_follow(dict1["followername"],dict1["followeename"])                                    #khud ka function daaldiyo
     return jsonify(content)


@app.route("/followers",methods = ["GET"])

def followers():
    if request.method == "GET":
     content = request.args.get("name1")
     val1 = db.get_followers(content)                                    #khud ka function daaldiyo
     return jsonify(val1)
  
@app.route("/followees",methods = ["GET"])

def followees():
    if request.method == "GET":
     content = request.args.get("name1")
     val1 = db.get_followees(content)                                    #khud ka function daaldiyo
     return jsonify(val1)
     

if __name__ == "__main__":
    app.run(host='0.0.0.0')
