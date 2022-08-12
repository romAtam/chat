const message = document.getElementById("message");
const send = document.getElementById("send");
const posts = document.querySelector(".posts");
const lists = document.querySelector(".posts-list");
const users = document.querySelector(".users");
const room = document.querySelector(".room");

const autoScrall = () => {
  const postsTop = posts.scrollTop;
  const post = lists.lastElementChild;
  const listsHeight = lists.offsetHeight;
  const postHeight = posts.offsetHeight;
  console.log(postsTop + postHeight - 20, listsHeight);
  if (postsTop + postHeight < listsHeight - 100) {
    return;
  } else {
    post.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }
};

const sendLocation = document.querySelector(".location");
message.focus();
const searchParams1 = new URLSearchParams(location.search);
const params = {};
for (const [key, value] of searchParams1) {
  params[key] = value;
}
const socket = io();

socket.emit("join", params, (err) => {
  if (err) {
    alert(err);
    location.href = "/";
  }
});

sendLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    throw new Error("not supported");
  }
  navigator.geolocation.getCurrentPosition((data) => {
    const { latitude, longitude } = data.coords;
    socket.emit("location", { latitude, longitude }, (data) =>
      console.log(data)
    );
  });
});

send.addEventListener("click", () => {
  if (message.value) {
    socket.emit("message", message.value);
    message.value = "";
    message.focus();
  } else {
    alert("unable to send empty message");
    message.focus();
  }
});
socket.on("location", showData);
socket.on("message", showData);
socket.on("userData", (data) => {
  users.innerHTML = "";
  const room = document.createElement("h1");
  room.innerHTML = data.room;
  users.appendChild(room);
  data.usersList.forEach((user) => {
    const p = document.createElement("p");
    p.innerHTML = user.username;
    users.appendChild(p);
  });
});
function showData(data) {
  console.log(data);
  const list = document.createElement("li");
  const post = document.createElement("p");
  const time = moment(data.date).format("H:mm:ss a ");
  if (data.message.includes("http")) {
    post.innerHTML = `<span class="name">${data.name}</span> <span class="time">${time}</span><br/><a target = "_blank" href=${data.message}>location</a>`;
  } else {
    post.innerHTML = `<span class="name">${
      data.name || "admin"
    }</span> <span class="time">${time}</span>-${data.message}`;
  }

  list.appendChild(post);
  lists.appendChild(list);

  autoScrall();
}
