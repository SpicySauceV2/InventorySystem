attempts = 3// shows how many attempt to log in remain
function account_verification(){
    if (attempts == 0){
        // if there are no more attempts cant log in anymore
        document.getElementById("attempts_warning").innerHTML = "You have run out of attempts please call customer support." 
    }else{
        // checks if it matches the username and password if not reduces the attempts
        if (document.getElementsByName("Ename").value != "Admin" && document.getElementById("pwd").value != "Saidbury1965!"){
            document.getElementById("attempts_warning").innerHTML = "You have " + attempts.toString() + " attempts remaining.";
            attempts = attempts - 1;
        }else{
            // if everything matchs it will redirect to the main hub
            var win = window.location.href = "http://127.0.0.1:5500/index.html";
            win.focus();
            
        }
    }
};
