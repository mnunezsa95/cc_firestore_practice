// Reference to UI section
const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

// Function to create element and render cafe
function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "X";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  // Listener for deleting data from firestore
  try {
    cross.addEventListener("click", (evt) => {
      evt.stopPropagation();
      let id = evt.target.parentElement.getAttribute("data-id");
      db.collection("cafes").doc(id).delete();
      console.log(`Successfully deleted item with id: ${id}`);
    });
  } catch (e) {
    console.log(e);
  }
}

// Listener for saving data to firestore
try {
  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    db.collection("cafes").add({ name: form.name.value, city: form.city.value });
    form.name.value = "";
    form.city.value = "";
    console.log("Successfully added new item");
  });
} catch (e) {
  console.log(e);
}

// Retrieve all documents
db.collection("cafes")
  .orderBy("name")
  .get()
  .then((snapshot) =>
    snapshot.docs.forEach((doc) => {
      console.log(doc.data());
    })
  );

// Retrieve documents based on a specific value
db.collection("cafes")
  .where("city", "==", "Bronx, NY")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      console.log(doc.data());
    });
  });

// Retrieve and order documents based on a specific value
db.collection("cafes")
  .orderBy("city")
  .where("city", "==", "Essex, UK")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      console.log(doc.data());
    });
  });

db.collection("cafes")
  .orderBy("city")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        renderCafe(change.doc);
      } else if (change.type == "remove") {
        let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");
        cafeList.removeChild(li);
      }
    });
  });
