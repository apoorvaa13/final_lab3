window.onload = function () {
  var username = document.querySelector(".nav-username");
  var displayname = document.querySelector(".display_name");
  var location = document.querySelector(".location");
  var reputation = document.querySelector(".reputation");
  var name = localStorage.getItem("username");
  var location = localStorage.getItem("location");
  var reputation = localStorage.getItem("userrating");
  username.innerHTML = name;
  displayname.innerHTML = name;
  // location.innerHTML = location;
  // reputation.innerHTML = reputation;
};

// Shifting encryption function
function shiftEncrypt(str, shift) {
  let chars = str.split("");
  for (let i = 0; i < chars.length; i++) {
    let charCode = chars[i].charCodeAt(0);
    charCode += shift;
    let shiftedChar = String.fromCharCode(charCode);
    chars[i] = shiftedChar;
  }
  let encryptedMsg = chars.join("");
  return encryptedMsg;
}

// Shifting decryption function
function shiftDecrypt(str, shift) {
  let chars = str.split("");
  for (let i = 0; i < chars.length; i++) {
    // Get the ASCII code of the character
    let charCode = chars[i].charCodeAt(0);
    charCode -= shift;
    // Convert the shifted code back to a character
    let shiftedChar = String.fromCharCode(charCode);
    // Replace the original character with the shifted character in the array
    chars[i] = shiftedChar;
  }
  // Join the array of shifted characters back into a string
  let decryptedMsg = chars.join("");
  // Return the decrypted message
  return decryptedMsg;
}

function login_func() {
  var popupBox = document.querySelector(".pop-outer1");
  popupBox.style.display = "block";
}
function signup_func() {
  var popupBox = document.querySelector(".pop-outer2");
  popupBox.style.display = "block";
}
function cancel() {
  window.location.href = "index.html";
}
function login(e) {
  e.preventDefault();
  var login_form = document.querySelector(".login_form");
  var name = login_form.name1.value;
  var pswrd = login_form.password1.value;
  var pswrd2 = shiftEncrypt(pswrd, 2);
  var body = { username: name, password: pswrd2 };
  fetch(
    `http://10.17.50.149:5000/user_login?name1=${name}&password1=${pswrd2}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      console.log(data);
      if (data.errorcode == "true") {
        localStorage.setItem("username", data.username);
        localStorage.setItem("location", data.location);
        localStorage.setItem("rating", data.userrating);
        alert("Login successful!");
        window.location.href = "all_questions_page.html";
      } else {
        alert("Username or password is incorrect!");
      }
    })
    .catch((error) => console.error(error));
}
function signup(e) {
  e.preventDefault();
  var signup_form = document.querySelector(".signup_form");
  var name = signup_form.name2.value;
  var email = signup_form.email2.value;
  var pswrd = signup_form.password2.value;
  var pswrd2 = shiftEncrypt(pswrd, 2);
  var body = { name2: name, password2: pswrd2 };
  fetch(`http://10.17.50.149:5000/user_signup`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) {
        alert("Sign up successful!");
        signup_form.reset();
        window.location.href = "index.html";
      }
      throw new Error("Network response was not ok.");
    })
    .catch((error) => console.error(error));
}
function ask_ques(e) {
  e.preventDefault();
  var ask_ques_form = document.querySelector(".ask_ques_form");
  var title = ask_ques_form.textbox1.value;
  var details = ask_ques_form.textbox2.value;
  var tags = ask_ques_form.textbox3.value;
  var username = localStorage.getItem("username");
  var body = {
    title: title,
    body: details,
    tagname: tags,
    authorname: username,
  };
  fetch(`http://10.17.50.149:5000/question`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) {
        alert("Question asked successfully!");
        // ask_ques_form.reset();
        window.location.href = "all_questions_page.html";
      }
      throw new Error("Network response was not ok.");
    })
    .catch((error) => console.log(error));
}
function get_particular_ques(id) {
  console.log(id);
  localStorage.setItem("ques_id", id);
  window.location.href = "particular_question_page.html";
}

function get_particular_user(user) {
  console.log(user);
  localStorage.setItem("get_user", user);
  window.location.href = "userpage_from_allusers.html";
}

if (
  window.location.href == "http://10.17.50.149:4242/userpage_from_allusers.html"
) {
  var user_req = localStorage.getItem("get_user");
  fetch(`http://10.17.50.149:5000/user?name1=${user_req}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      console.log(data);
      var display_user = document.querySelector(".display_user");
      var location = document.querySelector(".location");
      var reputation = document.querySelector(".reputation");
      display_user.innerHTML = user_req;
      // location.innerHTML = data.location;
      // reputation.innerHTML = data.reputation;
      document
        .querySelector(".follow")
        .setAttribute("onclick", `return follow('${user_req}')`);
    })
    .catch((error) => console.error(error));
}

if (
  window.location.href == "http://10.17.50.149:4242/particular_question_page.html"
) {
  var q_req = localStorage.getItem("ques_id");
  var user = localStorage.getItem("username");
  // console.log(user);
  fetch(
    `http://10.17.50.149:5000/question_title?title=${q_req}&username=${user}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      console.log(data);
      var delete_question = document.querySelector(".delete_ques");
      if (data.status == false) {
        delete_question.style.display = "none";
      } else {
        delete_question.style.display = "inline-block";
      }
      var q_title = document.querySelector(".questiontitle");
      q_title.innerHTML = data.title;
      var q_content = document.querySelector(".ques_content");
      q_content.innerHTML = data.body;
      var answers_list = data.answers;
      var answer_full = document.querySelector(".answer_full");
      answers_list.forEach((answer) => {
        var particular_answer = document.createElement("div");
        particular_answer.class = "particular_answer_posted";
        var answer1 = document.createElement("div");
        answer1.class = "answer1";
        var answer1_content = document.createElement("p");
        answer1_content.class = "answer1_content";
        answer1_content.innerHTML = answer.body;
        answer1.appendChild(answer1_content);
        // var left = document.createElement("div");
        // var upvote1 = document.createElement("div");
        // upvote1.class = "upvote1";
        // var img1 = document.createElement("img");
        // img1.src = "assets/upvote.png";
        // img1.id = "upvoteimgans";
        // img1.width = "20";
        // img1.height = "20";
        // img1.onclick = "changeImage2(1)";
        // upvote1.appendChild(img1);
        // var number1 = document.createElement("div");
        // number1.class = "number1";
        // var number_of_upvotes = document.createElement("p");
        // number_of_upvotes.innerHTML = 0;
        // number1.appendChild(number_of_upvotes);
        // var downvote1 = document.createElement("div");
        // downvote1.class = "downvote1";
        // var img2 = document.createElement("img");
        // img2.src = "assets/downvote.png";
        // img2.id = "downvoteimgans";
        // img2.width = "20";
        // img2.height = "20";
        // img2.onclick = "changeImage2(2)";
        // downvote1.appendChild(img2);
        // left.appendChild(upvote1);
        // left.appendChild(number1);
        // left.appendChild(downvote1);
        // particular_answer.appendChild(upvote1);
        // particular_answer.appendChild(number1);
        // particular_answer.appendChild(downvote1);

        // particular_answer.appendChild(left);
        particular_answer.appendChild(answer1);
        answer_full.appendChild(particular_answer);
      });
      // const original_div = document.querySelector(".particular_answer");
      // const parent_element = original_div.parentElement;
    })
    .catch((error) => console.error(error));
}

function gotopage() {
  window.location.href = "edit_profile_page.html";
}
function edit_profile(e) {
  e.preventDefault();
  console.log("function worked");
  var edit_profile_form = document.querySelector(".edit_profile_form");
  var new_username = edit_profile_form.edit_username.value;
  var new_password = edit_profile_form.edit_password.value;
  var new_email = edit_profile_form.edit_email.value;
  var new_location = edit_profile_form.edit_location.value;
  var username = localStorage.getItem("username");
  var body = {
    username: new_username,
    password: new_password,
    location: new_location,
    authorname: username,
  };
  fetch(`http://10.17.50.149:5000/user?name1=${username}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) {
        alert("Profile updated successfully!");
        edit_profile_form.reset();
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      localStorage.setItem("username", data.username);
      localStorage.setItem("location", data.location);
      window.location.href = "all_questions_page.html";
    })
    .catch((error) => console.error(error));
}
function delete_ques() {
  var questionid = localStorage.getItem("ques_id");
  fetch(`http://10.17.50.149:5000/question_title?quesid=${questionid}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Question was deleted successfully!");
        window.location.href = "all_questions_page.html";
      }
      throw new Error("Network response was not ok.");
    })
    .catch((error) => console.error(error));
}

if (window.location.href == "http://10.17.50.149:4242/all_users_page.html") {
  //how to write this for every user URL SPECIFICICATION
  const url = `http://10.17.50.149:5000/users_list`;
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const original_div = document.querySelector(".particular_user");
      const parent_element = original_div.parentElement;
      data.forEach((user) => {
        var clone_div = original_div.cloneNode(true);
        clone_div.class = "user";
        var username = clone_div.querySelector(".name_link");
        var rating = clone_div.querySelector(".particular_rating");
        var location = clone_div.querySelector(".particular_location");
        username.setAttribute(
          "onclick",
          `return get_particular_user('${user.username}')`
        );
        username.innerHTML = user.username;
        rating.innerHTML = user.userrating;
        location.innerHTML = user.location;
        parent_element.appendChild(clone_div);
      });
    })
    .catch((error) => console.error(error));
}

if (window.location.href == "http://10.17.50.149:4242/all_questions_page.html") {
  //how to write this for every user URL SPECIFICICATION
  const url = "http://10.17.50.149:5000/question"; // api url daalna hai
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const original_div = document.querySelector(".particular_ques");
      const parent_element = original_div.parentElement;
      data.forEach((question) => {
        var clone_div = original_div.cloneNode(true);
        var total_questions = clone_div.querySelector(".total_ques_output");
        var title = clone_div.querySelector(".q_link");
        var downvotes = clone_div.querySelector(".ques_downvotes_output");
        var upvotes = clone_div.querySelector(".ques_upvotes_output");
        var answers = clone_div.querySelector(".ques_answers_output");
        // var tags = clone_div.querySelector(".ques_tags_output");
        var askedby = clone_div.querySelector(".ques_askedby_output");
        var q_link = clone_div.querySelector(".q_link");
        title.innerHTML = question.title; // question ka link bhi change krna padega for a particular question
        upvotes.innerHTML = question.upvotes;
        downvotes.innerHTML = question.downvotes;
        answers.innerHTML = question.answers;
        // tags.innerHTML = question.tags;
        askedby.innerHTML = question.authorname;
        q_link.setAttribute(
          "onclick",
          `return get_particular_ques('${question.questionid}')`
        );
        // total_questions.innerHTML = data.length + 1;
        parent_element.appendChild(clone_div);
        console.log(question.title);
      });
    })
    .catch((error) => console.log(error));
}

// if (window.location.href == "http://127.0.0.1:5500/users_page.html") {
//   //how to write this for every user URL SPECIFICICATION
//   const url = "http://10.194.56.68:5000/question"; // api url daalna hai
//   fetch(url, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     method: "GET",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       const original_div = document.querySelector(".particular_ques");
//       const parent_element = original_div.parentElement;
//       data.forEach((question) => {
//         var clone_div = original_div.cloneNode(true);
//         var total_questions = clone_div.querySelector(".total_ques_output");
//         var title = clone_div.querySelector(".q_link");
//         var downvotes = clone_div.querySelector(".ques_downvotes_output");
//         var upvotes = clone_div.querySelector(".ques_upvotes_output");
//         var answers = clone_div.querySelector(".ques_answers_output");
//         // var tags = clone_div.querySelector(".ques_tags_output");
//         var askedby = clone_div.querySelector(".ques_askedby_output");
//         var q_link = clone_div.querySelector(".q_link");
//         title.innerHTML = question.title; // question ka link bhi change krna padega for a particular question
//         upvotes.innerHTML = question.upvotes;
//         downvotes.innerHTML = question.downvotes;
//         answers.innerHTML = question.answers;
//         // tags.innerHTML = question.tags;
//         askedby.innerHTML = question.authorname;
//         q_link.setAttribute(
//           "onclick",
//           `return get_particular_ques('${question.questionid}')`
//         );
//         // total_questions.innerHTML = data.length + 1;
//         parent_element.appendChild(clone_div);
//         console.log(question.title);
//       });
//     })
//     .catch((error) => console.log(error));
// }

function sort_newest() {
  const url = "http://10.17.50.149:5000/question"; // api url daalna hai
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const original_div = document.querySelector(".particular_ques");
      const parent_element = original_div.parentElement;
      data.forEach((question) => {
        var clone_div = original_div.cloneNode(true);
        var total_questions = clone_div.querySelector(".total_ques_output");
        var title = clone_div.querySelector(".q_link");
        var downvotes = clone_div.querySelector(".ques_downvotes_output");
        var upvotes = clone_div.querySelector(".ques_upvotes_output");
        var answers = clone_div.querySelector(".ques_answers_output");
        // var tags = clone_div.querySelector(".ques_tags_output");
        var askedby = clone_div.querySelector(".ques_askedby_output");
        title.innerHTML = question.title; // question ka link bhi change krna padega for a particular question
        upvotes.innerHTML = question.upvotes;
        downvotes.innerHTML = question.downvotes;
        answers.innerHTML = question.answers;
        // tags.innerHTML = question.tags;
        askedby.innerHTML = question.authorname;
        // total_questions.innerHTML = data.length;
        parent_element.appendChild(clone_div);
      });
    })
    .catch((error) => console.log(error));
}
function sort_unanswered() {
  const url = "";
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const original_div = document.querySelector(".particular_ques");
      const parent_element = original_div.parentElement;
      data.forEach((question) => {
        var clone_div = original_div.cloneNode(true);
        clone_div.class = "ques";
        var total_questions = clone_div.querySelector(".total_ques_output");
        var title = clone_div.querySelector(".q_link");
        var downvotes = clone_div.querySelector(".ques_downvotes_output");
        var upvotes = clone_div.querySelector(".ques_upvotes_output");
        var answers = clone_div.querySelector(".ques_answers_output");
        var tags = clone_div.querySelector(".ques_tags_output");
        var askedby = clone_div.querySelector(".ques_askedby_output");
        title.innerHTML = question.title; // question ka link bhi change krna padega for a particular question
        upvotes.innerHTML = question.upvotes;
        downvotes.innerHTML = question.downvotes;
        answers.innerHTML = question.answers;
        tags.innerHTML = question.tags;
        askedby.innerHTML = question.askedby;
        total_questions.innerHTML = parent_element.appendChild(clone_div);
      });
    })
    .catch((error) => console.error(error));
}
function sort_score() {
  const url = ""; // api url daalna hai
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const original_div = document.querySelector(".particular_ques");
      const parent_element = original_div.parentElement;
      data.forEach((question) => {
        var clone_div = original_div.cloneNode(true);
        clone_div.class = "ques";
        var total_questions = clone_div.querySelector(".total_ques_output");
        var title = clone_div.querySelector(".q_link");
        var downvotes = clone_div.querySelector(".ques_downvotes_output");
        var upvotes = clone_div.querySelector(".ques_upvotes_output");
        var answers = clone_div.querySelector(".ques_answers_output");
        var tags = clone_div.querySelector(".ques_tags_output");
        var askedby = clone_div.querySelector(".ques_askedby_output");
        title.innerHTML = question.title; // question ka link bhi change krna padega for a particular question
        upvotes.innerHTML = question.upvotes;
        downvotes.innerHTML = question.downvotes;
        answers.innerHTML = question.answers;
        tags.innerHTML = question.tags;
        askedby.innerHTML = question.askedby;
        total_questions.innerHTML = parent_element.appendChild(clone_div);
      });
    })
    .catch((error) => console.error(error));
}

function follow(user) {
  var x = document.querySelector(".follow");
  var name = localStorage.getItem("username");
  if (x.innerHTML == "Follow") {
    x.innerHTML = "Unfollow";
    body = { followeename: user, followername: name };
    fetch("http://10.17.50.149:5000/follow", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.ok) {
        }
      })
      .catch((error) => console.error(error));
  } else {
    x.innerHTML = "Follow";
    body = { followeename: user, followername: name };
    fetch("http://10.17.50.149:5000/follow", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.ok) {
        }
      })
      .catch((error) => console.error(error));
  }
}

function post_ans_func(e) {
  e.preventDefault();
  console.log("lskfdjlkjlklkjl");
  var post_ans_form = document.querySelector(".post_ans_form");
  var questionid = localStorage.getItem("ques_id");
  var ans = post_ans_form.post_ans.value;
  var username = localStorage.getItem("username");
  var body = { username: username, questionid: questionid, ans: ans };
  console.log(body);
  fetch("http://10.17.50.149:5000/answers", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) {
        alert("Your answer was posted successfully!");
        post_ans_form.reset();
        window.location.href = "particular_question_page.html";
      }
      throw new Error("Network response was not ok.");
    })
    .catch((error) => console.error(error));
}

if (
  window.location.href ==
  "http://10.17.50.149:4242/users_profile_page_followers.html"
) {
  var user = localStorage.getItem("username");
  const url = `http://10.17.50.149:5000/followers?name1=${user}`;
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const parent_element = document.querySelector(".parent");
      data.forEach((user) => {
        var particular_user = document.createElement("div");
        var particular_user_image = document.createElement("div");
        var user_image = document.createElement("img");
        user_image.src = "assets/default.png";
        var particular_user_details = document.createElement("div");
        var particular_username = document.createElement("div");
        // var newelement5 = document.createElement("div");
        // var newelement6 = document.createElement("div");
        particular_user.class = "particular_user";
        particular_user_image.class = "particular_user_image";
        particular_user_details.class = "particular_user_details";
        particular_username.class = "particular_username";
        // newelement5.class = "particular_rating";
        // newelement6.class = "particular_location";
        particular_username.innerHTML = user.followername;
        // newelement5.innerHTML = user.rating;
        // newelement6.innerHTML = user.location;
        particular_user_image.appendChild(user_image);
        particular_user.appendChild(particular_user_image);
        particular_user_details.appendChild(particular_username);
        particular_user.appendChild(particular_user_details);
        // newelement3.appendChild(newelement4);
        // newelement3.appendChild(newelement5);
        // newelement3.appendChild(newelement6);
        parent_element.appendChild(particular_user);
      });
    })
    .catch((error) => console.log(error));
}

function usersfollow() {
  window.location.href = "users_profile_page_followers.html";
}

function usersfollowing() {
  window.location.href = "users_profile_page_following.html";
}

if (
  window.location.href ==
  "http://10.17.50.149:4242/users_profile_page_following.html"
) {
  var username = localStorage.getItem("username");
  const url = `http://10.17.50.149:5000/followees?name1=${username}`;
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const parent_element = document.querySelector(".parent_following");
      data.forEach((user) => {
        var particular_user = document.createElement("div");
        var particular_user_image = document.createElement("div");
        var user_image = document.createElement("img");
        user_image.src = "assets/default.png";
        var particular_user_details = document.createElement("div");
        var particular_username = document.createElement("div");
        // var newelement5 = document.createElement("div");
        // var newelement6 = document.createElement("div");
        particular_user.class = "particular_user_following";
        particular_user_image.class = "particular_user_image";
        particular_user_details.class = "particular_user_details";
        particular_username.class = "particular_username";
        // newelement5.class = "particular_rating";
        // newelement6.class = "particular_location";
        particular_username.innerHTML = user.followeename;
        // newelement5.innerHTML = user.rating;
        // newelement6.innerHTML = user.location;
        particular_user_image.appendChild(user_image);
        particular_user.appendChild(particular_user_image);
        particular_user_details.appendChild(particular_username);
        particular_user.appendChild(particular_user_details);
        // newelement3.appendChild(newelement4);
        // newelement3.appendChild(newelement5);
        // newelement3.appendChild(newelement6);
        parent_element.appendChild(particular_user);
      });
    })
    .catch((error) => console.log(error));
}

if (
  window.location.href == "http://10.17.50.149:4242/users_profile_page_feed.html"
) {
  const url = "";
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const parent_element = document.querySelector(".parent_ques");
      data.forEach((ques) => {
        var newelement1 = original_div.createElement("div");
        var newelement2 = original_div.createElement("div");
        var newelement3 = original_div.createElement("div");
        var newelement4 = original_div.createElement("div");
        var newelement5 = original_div.createElement("div");
        var newelement6 = original_div.createElement("div");
        newelement1.class = "particular_ques";
        newelement2.class = "ques_left";
        newelement3.class = "ques_upvotes";
        newelement4.class = "ques_upvotes_output";
        newelement5.class = "ques_downvotes";
        newelement6.class = "ques_downvotes_output";
        newelement7.class = "ques_answers";
        newelement8.class = "ques_answers_output";
        newelement9.class = "ques_right";
        newelement10.class = "ques_title";
        newelement11.class = "ques_tags";
        newelement12.class = "ques_askedby";
        newelement13.class = "ques_asked by_output";

        newelement4.innerHTML = ques.upvotes;
        newelement6.innerHTML = ques.downvotes;
        newelement8.innerHTML = ques.answers;
        parent_element.appendChild(newelement2);
        parent_element.appendChild(newelement9);
        newelement2.appendChild(newelement3);
        newelement2.appendChild(newelement5);
        newelement2.appendChild(newelement7);
        newelement9.appendChild(newelement10);
        newelement9.appendChild(newelement11);
        newelement9.appendChild(newelement12);
        newelement3.appendChild(newelement4);
        newelement5.appendChild(newelement6);
        newelement7.appendChild(newelement8);
        newelement12.appendChild(newelement13);
      });
    })
    .catch((error) => console.error(error));
}

if (
  window.location.href == "http://localhost:5500/users_profile_page_feed.html"
) {
  //how to write this for every user URL SPECIFICICATION
  const url = ""; //http://10.194.59.8:5000/users_list
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const parent_element = document.querySelector(".parent_ques");
      data.forEach((ques) => {
        var newelement1 = original_div.createElement("div");
        var newelement2 = original_div.createElement("div");
        var newelement3 = original_div.createElement("div");
        var newelement4 = original_div.createElement("div");
        var newelement5 = original_div.createElement("div");
        var newelement6 = original_div.createElement("div");
        newelement1.class = "particular_ques";
        newelement2.class = "ques_left";
        newelement3.class = "ques_upvotes";
        newelement4.class = "ques_upvotes_output";
        newelement5.class = "ques_downvotes";
        newelement6.class = "ques_downvotes_output";
        newelement7.class = "ques_answers";
        newelement8.class = "ques_answers_output";
        newelement9.class = "ques_right";
        newelement10.class = "ques_title";
        newelement11.class = "ques_tags";
        newelement12.class = "ques_askedby";
        newelement13.class = "ques_asked by_output";
        newelement4.innerHTML = ques.upvotes;
        newelement6.innerHTML = ques.downvotes;
        newelement8.innerHTML = ques.answers;
        parent_element.appendChild(newelement2);
        parent_element.appendChild(newelement9);
        newelement2.appendChild(newelement3);
        newelement2.appendChild(newelement5);
        newelement2.appendChild(newelement7);
        newelement9.appendChild(newelement10);
        newelement9.appendChild(newelement11);
        newelement9.appendChild(newelement12);
        newelement3.appendChild(newelement4);
        newelement5.appendChild(newelement6);
        newelement7.appendChild(newelement8);
        newelement12.appendChild(newelement13);
      });
    })
    .catch((error) => console.error(error));
}

function translate_text() {
  var ques_title = document.querySelector(".questiontitle");
  var ques_body = document.querySelector(".ques_content");
  const textToTranslate1 = ques_title.innerHTML;
  const textToTranslate2 = ques_body.innerHTML;
  const targetLanguage = "en"; // French
  // Define the URL for the Google Cloud Translation API endpoint
  const apiUrl = "https://translation.googleapis.com/language/translate/v2";

  // Define the API key and create the request URL
  const apiKey = "AIzaSyAC2YhcZlj1dkJomIBqyCyU7TcXuB0GrHE";
  const requestUrl1 = `${apiUrl}?q=${textToTranslate1}&target=${targetLanguage}&key=${apiKey}`;
  const requestUrl2 = `${apiUrl}?q=${textToTranslate2}&target=${targetLanguage}&key=${apiKey}`;

  // Send a GET request to the API endpoint
  fetch(requestUrl1)
    .then((response) => response.json())
    .then((data) => {
      const translation1 = data.data.translations[0].translatedText;
      ques_title.innerHTML = translation1;
      console.log(`Original text: ${textToTranslate1}`);
      console.log(`Translation: ${translation1}`);
    })
    .catch((err) => {
      console.error("Error:", err);
    });

  fetch(requestUrl2)
    .then((response) => response.json())
    .then((data) => {
      const translation2 = data.data.translations[0].translatedText;
      ques_body.innerHTML = translation2;
      console.log(`Original text: ${textToTranslate2}`);
      console.log(`Translation: ${translation2}`);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}
