import http from "http";

const port = 3000;

let users = [
  { id: 1, name: "Abc", email: "abs@123" },
  { id: 2, name: "Abes", email: "abes@1234" }
];

const server = http.createServer((req, res) => {

  const url = req.url;
  const method = req.method;

  res.setHeader("Content-Type", "application/json");

  if (url === "/users" && method === "GET") {
    return res.end(JSON.stringify(users));
  }

  if (url.startsWith("/users/") && method === "GET") {
    const id = parseInt(url.split("/")[2]);
    const user = users.find(u => u.id === id);

    if (!user) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    return res.end(JSON.stringify(user));
  }

  if (url === "/users" && method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedData = JSON.parse(body);

      const newUser = {
        id: users.length + 1,
        name: parsedData.name,
        email: parsedData.email
      };

      users.push(newUser);

      res.statusCode = 201;
      res.end(JSON.stringify(newUser));
    });

    return;
  }

  if (url.startsWith("/users/") && method === "PUT") {
    const id = parseInt(url.split("/")[2]);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedData = JSON.parse(body);
      users[userIndex] = { ...users[userIndex], ...parsedData };
      res.end(JSON.stringify(users[userIndex]));
    });

    return;
  }

  if (url.startsWith("/users/") && method === "DELETE") {
    const id = parseInt(url.split("/")[2]);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    const deletedUser = users.splice(userIndex, 1);
    return res.end(JSON.stringify(deletedUser[0]));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: "Route Not Found" }));

});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});