 let username = "";
    while (!username || username.trim() === "") {
      username = prompt("Enter your name:");
      if (username === null) {
        alert("You are not allowed to enter this CHAT ROOM. Please refresh the page.");
        throw new Error("User cancelled name entry");
      } else if (!username || username.trim() === "") {
        alert("You must enter a name to join the chat.");
      }
    }
    // Set  default background       
    function setDefaultBackground() {
  document.body.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
}
// Set  default background   

// Create a function to plase 1st letter of a name inside profile image

 function setDefaultAvatar(name) {
  const firstLetter = name.charAt(0).toUpperCase();
  const profileImg = document.getElementById("profile-img");

  // Render as text avatar
  profileImg.style.display = "flex";
  profileImg.className = "avatar";
  profileImg.src = ""; // clear src so <img> doesn’t show broken image
  profileImg.alt = firstLetter;
  profileImg.innerText = firstLetter; // works if you use <div>, but for <img> we’ll swap
}

// Create a function to plase 1st letter of a name inside profile image

// for name changes using button
    window.onload = () => {
  const changeNameBtn = document.getElementById("change-name");
  const editNameInput = document.getElementById("edit-name");
  const userInfo = document.getElementById("user-info");

  changeNameBtn.addEventListener("click", () => {
    const newName = editNameInput.value.trim();
    if (newName) {
      username = newName; // update global username
      userInfo.innerText = `User Name: ${username}`;

      // Show in chat area
      chat.innerHTML += `<p><em>You changed your name to ${username}</em></p>`;

      // Notify server
      ws.send(JSON.stringify({ type: "name_change", user: username }));
      editNameInput.value = "";
    } else {
      alert("Please enter a valid name before changing.");
    }
  });
};
    
// for name changes using button

    const ws = new WebSocket("ws://localhost:8080");
    const chat = document.getElementById("chat");
    const messageInput = document.getElementById("message");
    const sendButton = document.getElementById("send");
    document.getElementById("user-info").innerText = `User Name: ${username}`;
    const profileUpload = document.getElementById("profile-upload");
    const profileImg = document.getElementById("profile-img");
    const removeProfileBtn = document.getElementById("remove-profile");
    
    let isModerator = false;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join_request", user: username }));
    };

    // Profile image upload and removed

    profileUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profileImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
        removeProfileBtn.style.display = "inline-block";
      }
    });
    // Remove profile image → reset to default avatar
removeProfileBtn.addEventListener("click", () => {
 profileImg.src = "";
  removeProfileBtn.style.display = "none"; // hide button again
  profileUpload.value = ""; // clear file input
});

 // Profile image upload and removed


    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "approved") {
        chat.innerHTML += `<p><em>${username} joined the chat</em></p>`;
      } else if (data.type === "rejected") {
        alert("Your request was rejected by the moderator.");
        throw new Error("Access denied");
      } else if (data.type === "message") {
        chat.innerHTML += `<p><strong>${data.user}</strong> [${data.time}]: ${data.text}</p>`;
      } else if (data.type === "join") {
        chat.innerHTML += `<p><em>${data.user} joined the chat</em></p>`;
      } else if (data.type === "join_request") {
        if (isModerator) {
          const approve = confirm(`${data.user} wants to join. Approve?`);
          if (approve) {
            ws.send(JSON.stringify({ type: "approve", user: data.user }));
          } else {
            ws.send(JSON.stringify({ type: "reject", user: data.user }));
          }
        }
      } else if (data.type === "typing") {
        document.getElementById("typing").innerHTML = `
          <img src="default-avatar.png" style="width:30px;height:30px;border-radius:50%;vertical-align:middle;">
          <span>${data.user} is typing...</span>
        `;
        setTimeout(() => { document.getElementById("typing").innerHTML = ""; }, 2000);
      } else if (data.type === "moderator") {
        isModerator = true;
        chat.innerHTML += `<p><em>You are the moderator</em></p>`;
      }

      chat.scrollTop = chat.scrollHeight;
    };

    sendButton.onclick = () => {
      const message = messageInput.value;
      if (message) {
        ws.send(JSON.stringify({ type: "message", user: username, text: message }));
        messageInput.value = "";
      }
    };

    messageInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendButton.click();
      }
    });

    messageInput.addEventListener("input", () => {
      ws.send(JSON.stringify({ type: "typing", user: username }));
    });

    // Background upload
    const bgUpload = document.getElementById("bg-upload");
    const removeBgBtn = document.getElementById("remove-bg");

    bgUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          document.body.style.backgroundImage = `url('${e.target.result}')`;
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
          document.body.style.backgroundAttachment = "fixed";
          removeBgBtn.style.display = "inline-block";
        };
        reader.readAsDataURL(file);
      }
    });

    removeBgBtn.addEventListener("click", () => {
   setDefaultBackground();
  removeBgBtn.style.display = "none"; // ✅ hide button again
  bgUpload.value = ""; // clear file input
});


setDefaultBackground();