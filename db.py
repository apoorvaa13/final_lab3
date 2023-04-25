# Connect to the database
from typing import Optional

import pymysql

connection = pymysql.connect(host='localhost',
                             user='root',
                             password='IITk@1stkaam',
                             database='sysmalloc',
                             cursorclass=pymysql.cursors.DictCursor)

def setup():
  # with connection:
    with connection.cursor() as cursor:
      cursor.execute("""CREATE TABLE IF NOT EXISTS `users` (
        `userid` int NOT NULL AUTO_INCREMENT,
        `username` varchar(255) NOT NULL UNIQUE,
        `location` varchar(150) DEFAULT NULL,
        `userrating` int ,
        `password` varchar(150) NOT NULL UNIQUE,
        `followers` int DEFAULT 0,
        `following` int DEFAULT 0,
        PRIMARY KEY (`userid`))
        """)

      cursor.execute("""CREATE TABLE IF NOT EXISTS `votes` (
        `voteid` int NOT NULL AUTO_INCREMENT,
        `voterid` int NOT NULL,
        `voteeid` int NOT NULL,
        `form` char(1) NOT NULL,
        `questionid` int DEFAULT NULL,
        `answerid` int DEFAULT NULL,
        PRIMARY KEY (`voteid`)
      )""")

      cursor.execute("""CREATE TABLE IF NOT EXISTS `comments` (
        `commentid` int NOT NULL AUTO_INCREMENT,
        `body` varchar(1500),
        `authorid` int NOT NULL,
        `questionid` int DEFAULT NULL,
        `answerid` int DEFAULT NULL,
        PRIMARY KEY (`commentid`)
      )""")

      cursor.execute("""CREATE TABLE IF NOT EXISTS `answers` (
        `answerid` int NOT NULL AUTO_INCREMENT,
        `body` varchar(3000),
        `authorname` varchar(255) NOT NULL,
        `questionid` int DEFAULT NULL,
        `upvotes` int DEFAULT 0,
        `downvotes` int DEFAULT 0,
        PRIMARY KEY (`answerid`)
      )""")
      cursor.execute("""CREATE TABLE IF NOT EXISTS `questions` (
        `questionid` int NOT NULL AUTO_INCREMENT,
        `title` varchar(400),
        `body` varchar(3000),
        `authorname` varchar(255) NOT NULL,
        `upvotes` int DEFAULT 0,
        `downvotes` int DEFAULT 0,
        `answers` int DEFAULT 0,
        PRIMARY KEY (`questionid`)
        
      )""")
      cursor.execute("""CREATE TABLE IF NOT EXISTS `followers` (
        `followername` varchar(255) NOT NULL,
        `followeename` varchar(255) NOT NULL
      )""")
      cursor.execute("""CREATE TABLE IF NOT EXISTS `tags` (
        `tagname` int NOT NULL,
        `questionid` int NOT NULL
      )""")
  
"""

def get_category_from_id(id: int) -> Optional[Category]:
  with connection.cursor() as cursor:
    sql = ""SELECT * FROM `category` WHERE `id`=%d""
    cursor.execute(sql, (id))
    r = cursor.fetchone()
    if r is None:
      return None
    return Category.from_dict(r)


def get_category_from_name(name: str) -> Optional[Category]:
  with connection.cursor() as cursor:
    sql = ""SELECT * FROM `category` WHERE `name`=%s""
    cursor.execute(sql, (name))
    r = cursor.fetchone()
    if r is None:
      return None
    return Category.from_dict(r)

"""
def get_user_from_name(username):
  with connection.cursor() as cursor:
    sql = """SELECT * FROM `users` WHERE `username`=%s"""
    cursor.execute(sql, (username))
    r = cursor.fetchall()
    if r is None:
      return None
    return r

def get_question_from_id(id):
  with connection.cursor() as cursor:
    sql = """SELECT * FROM `questions` WHERE `questionid`=%s"""
    cursor.execute(sql, (id))
    r = cursor.fetchall()
    if r is None:
      return None
    return r


def get_all_users():
  with connection.cursor() as cursor:
    sql = """SELECT username,location,userrating FROM `users`"""
    cursor.execute(sql)
    r = cursor.fetchall()
    if r == ():
      return None
    return r


def add_user(user):

  with connection.cursor() as cursor:
    sql = """SELECT * FROM `users` WHERE `username`=%s"""
    cursor.execute(sql, (user["username"]))
    r = cursor.fetchone()
    print(r)
    if r == None:
     sql = f"INSERT INTO users (username,password) VALUES (%s,%s)"
     cursor.execute(sql, (user["username"],user["password"]))
     connection.commit()
     return True
    else:
      print("dsfjhjl")
      return False
      
def add_question(question):

  with connection.cursor() as cursor:

     sql = f"""SELECT `questionid` FROM `questions` WHERE `title`=%s"""
     cursor.execute(sql, (question["title"]))
     r1 = cursor.fetchone()
     sql = f"""SELECT `userid` FROM `users` WHERE `username`=%s"""
     cursor.execute(sql, (question["username"]))
     r2 = cursor.fetchone()
     sql = f"INSERT INTO questions (authorid,body,questionid)VALUES (%s,%s,%s)"
     
     cursor.execute(sql, (r2["userid"],question["body"],r1["questionid"]))
     connection.commit()
     return True

def add_question(question):

  with connection.cursor() as cursor:

     sql = f"""SELECT `questionid` FROM `questions` WHERE `title`=%s"""
     cursor.execute(sql, (question["title"]))
     r1 = cursor.fetchone()
     sql = f"""SELECT `userid` FROM `users` WHERE `username`=%s"""
     cursor.execute(sql, (question["username"]))
     r2 = cursor.fetchone()
     sql = f"INSERT INTO questions (authorid,body,questionid)VALUES (%s,%s,%s)"
     
     cursor.execute(sql, (r2["userid"],question["body"],r1["questionid"]))
     connection.commit()
     return True
def get_ans_from_ques(quesid):
  with connection.cursor() as cursor:
    sql = """SELECT * FROM `answers` WHERE `questionid`=%s"""
    cursor.execute(sql, (quesid))
    r = cursor.fetchall()
    if r is None:
      return None
    return r
  
def get_ans_from_name(username):
  with connection.cursor() as cursor:
    sql = """SELECT * FROM `answers` WHERE `authorname`=%s"""
    cursor.execute(sql, (username))
    r = cursor.fetchall()
    if r is None:
      return None
    return r

def update_username(username,newusername):
    with connection.cursor() as cursor:
     sql = """UPDATE `users` SET `username`=%s WHERE `username`=%s"""
     cursor.execute(sql,(newusername,username))
     connection.commit()
    return

def update_password(username,newpassword):
    with connection.cursor() as cursor:
     sql = """UPDATE `users` SET `password`=%s WHERE `username`=%s"""
     cursor.execute(sql,(newpassword,username))
     connection.commit()
    return

def update_location(username,newlocation):
    with connection.cursor() as cursor:
     sql = """UPDATE `users` SET `location`=%s WHERE `username`=%s"""
     cursor.execute(sql,(newlocation,username))
     connection.commit()
    return

def update_userrating(username,newuserrating):
    with connection.cursor() as cursor:
     sql = """UPDATE `users` SET `userrating`=%s WHERE `username`=%s"""
     cursor.execute(sql,(newuserrating,username))
     connection.commit()
    return




def add_answer(question):

  with connection.cursor() as cursor:

     sql = f"INSERT INTO answers (authorname,body,questionid)VALUES (%s,%s,%s)"
     
     cursor.execute(sql, (question["username"],question["ans"],question["questionid"]))
     connection.commit()
     return True

def add_question(question):

  with connection.cursor() as cursor:
      
     sql = f"INSERT INTO questions (title,body,authorname)VALUES (%s,%s,%s)"
     cursor.execute(sql, (question["title"],question["body"],question["authorname"]))
     connection.commit()
     return True
def add_follow(follow):
    with connection.cursor() as cursor:
      
     sql = f"INSERT INTO followers (followername,followeename)VALUES (%s,%s)"
     cursor.execute(sql, (follow["followername"],follow["followeename"]))
     connection.commit()
     return True
def get_followers(followee):
  with connection.cursor() as cursor:
    sql = """SELECT `followername` FROM `followers` WHERE `followeename`=%s"""
    cursor.execute(sql,(followee))
    r = cursor.fetchall()
    return r

def get_followees(follower):
  with connection.cursor() as cursor:
    sql = """SELECT `followeename` FROM `followers` WHERE `followername`=%s"""
    cursor.execute(sql,(follower))
    r = cursor.fetchall()
    return r


def get_questions_from_title(title,name):
  with connection.cursor() as cursor:
    sql = """SELECT * FROM `questions` WHERE `questionid`=%s"""
    cursor.execute(sql, (title))
    r = cursor.fetchone()
    print(r["authorname"])
    print(name)
    if r["authorname"] == name:
        r["status"] = True
        
    else:
        r["status"] = False
    sql = """SELECT * FROM `answers` WHERE `questionid`=%s"""
    cursor.execute(sql, (title))
    r1 = cursor.fetchall()
    r["answers"] = r1
    return r

def get_questions_from_name(username):
  with connection.cursor() as cursor:
    sql = """SELECT * FROM `questions` WHERE `authorname`=%s"""
    cursor.execute(sql, (username))
    r = cursor.fetchall()
    return r

def clear():
    with connection.cursor() as cursor:
     print("lskjdf")
     sql = """DELETE FROM `questions` WHERE `questionid`='' OR `questionid` IS NULL"""
     cursor.execute(sql)
    return 
def get_questions():
    with connection.cursor() as cursor:
     sql = """SELECT * FROM `questions` ORDER BY questionid DESC LIMIT 15"""
     cursor.execute(sql)
     r = cursor.fetchall()
    return r


def user_login(username):
  with connection.cursor() as cursor:
    sql = """SELECT * FROM `users` WHERE `username`=%s"""
    cursor.execute(sql, (username))
    r = cursor.fetchone()
    return r

def del_ques(title):
    with connection.cursor() as cursor:
     sql = """DELETE FROM `questions` WHERE `questionid`=%s"""
     cursor.execute(sql,(title))
     connection.commit()
     sql = """DELETE FROM `answers` WHERE `questionid`=%s"""
     cursor.execute(sql,(title))
     connection.commit()
    return 
 
def del_follow(followername,followeename):
    with connection.cursor() as cursor:
     print("lskjdf")
     sql = """DELETE FROM `followers` WHERE `followername`=%s and `followeename`=%s"""
     cursor.execute(sql,(followername,followeename))
     connection.commit()
    return 
"""
def get_tag_from_id(id: int) -> Optional[Tag]:
  with connection.cursor() as cursor:
    sql = ""SELECT * FROM `tag` WHERE `id`=%d""
    cursor.execute(sql, (id))
    r = cursor.fetchone()
    if r is None:
      return None
    return Tag.from_dict(r)


def get_tag_from_name(name: str) -> Optional[Tag]:
  with connection.cursor() as cursor:
    sql = ""SELECT * FROM `tag` WHERE `name`=%s""
    cursor.execute(sql, (name))
    r = cursor.fetchone()
    if r is None:
      return None
    return Tag.from_dict(r)


def add_tag(tag: Tag) -> None:
  assert tag.id is None
  t = get_tag_from_name(tag.name)
  if t is not None:
    tag.id = t.id
    return

  with connection.cursor() as cursor:
    sql = f"INSERT INTO tag (name) VALUES (%s)"
    cursor.execute(sql, (tag.name))
    connection.commit()
    tag.id = cursor.lastrowid


def add_pet(pet: Pet) -> None:
  assert pet.id is None
  if pet.category.id is None:
    add_category(pet.category)
  for tag in pet.tags:
    if tag.id is None:
      add_tag(tag)

  with connection.cursor() as cursor:
    sql = f"INSERT INTO pet (name, photo_urls, category_id, status) VALUES " \
          f"(%s, %s, %s, %s)"
    cursor.execute(sql, (pet.name, pet.photo_urls, pet.category.id, pet.status))
    connection.commit()
    pet.id = cursor.lastrowid

    sql = f"INSERT INTO pet_tag (pet_id, tag_id) VALUES (%s, %s)"
    for tag in pet.tags:
      cursor.execute(sql, (pet.id, tag.id))
    connection.commit()

"""
