const xhr = new XMLHttpRequest();

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g,""); }

function add() {
    if(document.querySelector('#userID') == undefined) {
        alert("로그인 해주세요")
    }
    else {
        xhr.onreadystatechange = alertContents;
        const username = document.querySelector('#username').innerHTML.trim();
        const id = document.querySelector('#id').innerHTML;
        const userID = document.querySelector('#userID').value.trim();
        const 평점 = document.querySelector('#score').innerHTML.trim();
        const 평론 = document.querySelector('#comment').value;
        const data = { id:id ,username:username ,userID:userID , star:평점 , comment:평론}
        console.log(data);
        xhr.open('POST','http://localhost:3000/comment/register');
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify(data));
    }
    
}

function alertContents() 
{
    if (xhr.readyState === xhr.DONE) 
    {
      if (xhr.status === 200) 
      {
          console.log(xhr.responseText);
          if(xhr.responseText != "false") {
            const data = JSON.parse(xhr.responseText);
        console.log("aaaa");
        console.log(data);
        document.querySelectorAll('#comment_block').forEach(e => e.parentNode.removeChild(e));
        for(let a = 0;a<data.length;a++) {
            console.log(data[a]['평점']);
            var div = document.createElement("div");
            div.id = "comment_block           ";
            div.className = "flex-1 ";
            div.className += "h-48 ";
            div.className += "w-full";
            var span = document.createElement("span");
            var nickname = document.createTextNode(data[a]['등록자닉네임']);
            span.appendChild(nickname);
            for(let b = 0;b<data[a]['평점'];b++) 
            {
                var star_checked = document.createElement("span");
                star_checked.className = "fa ";
                star_checked.className += "fa-star ";
                star_checked.className += "checked";
                span.appendChild(star_checked)
            }
            for(let b = 0;b<5-data[a]['평점'];b++) {
                var star = document.createElement("span");
                star.className = "fa ";
                star.className += "fa-star";
                span.appendChild(star);
            }
            var content = document.createElement('div');
            content.className="h-auto";
            var comment = document.createTextNode(data[a]['평론']);
            content.appendChild(comment);
            div.appendChild(span);
            div.appendChild(content);
            var element = document.getElementById("comment_list");
            element.appendChild(div);
        }
          } else {
              alert('이미 등록하셧습니다.');
          }
        
      } 
      else {
        alert('request에 뭔가 문제가 있어요.');
      }
    }
  }