
try {
    const form = document.querySelector("form");
    const message = document.querySelector(".message");
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/login");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = () => {
        if (xhr.status === 200) {
          const previousPage = document.referrer || "/";
          window.location.replace(previousPage);
        } else if (xhr.status === 401) {
          message.textContent = "Invalid credentials";
        } else {
          message.textContent = "An error occurred";
        }
      };
      xhr.onerror = () => {
        message.textContent = "An error occurred";
      };
  
      const email = form.querySelector('input[type="email"]').value;
      const password = form.querySelector('input[type="password"]').value;
      const data = { email, password };
      xhr.send(JSON.stringify(data));
    });
  } catch (err) {
    console.log(err);
  }
  