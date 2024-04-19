
function myFunction() {
  let x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
const getTrains = async () => {
  try {
    return (await fetch("api/trains/")).json();
  } catch (error) {
    console.log("error retrieving JSON");
    return null;
  }
}
const showTrains = async () => {
  let json = await getTrains();
  //console.log(json);
  let newJSON = makeShowJSON(json);
  convert(newJSON, json);
};

function makeShowJSON(json) {
  let newJSON = JSON.parse(JSON.stringify(json));
  for(let i = 0; i < newJSON.length; i++) {
    delete newJSON[i]._id;
    delete newJSON[i].__v;
    delete newJSON[i].user_name;
    delete newJSON[i].user_email;
  }
  return newJSON;
}

function convert(jsonData, oldJSON) {

  // Get the container element where the table will be inserted
  let container = document.getElementById("container");

  if (jsonData.length == 0) {
    let p = document.createElement("p");
    p.textContent = "No Trains Right Now, Check Back Later :("
    container.appendChild(p);
    return;
  } else {
    container.innerHTML = "";
  }
  // Create the table element
  let table = document.createElement("table");

  // Get the keys (column names) of the first object in the JSON data
  let cols = Object.keys(jsonData[0]);

  // Create the header element
  let thead = document.createElement("thead");
  let tr = document.createElement("tr");

  // Loop through the column names and create header cells
  cols.forEach((item) => {
    let x;
    if(item=="train_name") x= "Train Name";
    if(item=="company") x="Manufacturer";
    if(item=="build_date") x="Date(s) Built";
    if(item=="upload_date") x="Date Uploaded";
    if(item=="notes") x="Notes";
    if(item=="service_locations") x="Service\u00A0Locations";
    if(item=="img") x="Image";
    let th = document.createElement("th");
    th.innerText = x; // Set the column name as the text of the header cell
    tr.appendChild(th); // Append the header cell to the header row
});
  thead.appendChild(tr); // Append the header row to the header
  table.append(tr) // Append the header to the table

  // Loop through the JSON data and create table rows
  jsonData.forEach((item) => {
    let tr = document.createElement("tr");

    // Get the values of the current object in the JSON data
    let vals = Object.values(item);

    // Loop through the values and create table cells
    for (let i = 0; i < vals.length; i++) {
      let td = document.createElement("td");
      if (i == 6) {
        let img = document.createElement('img');
        img.src = "./images/" + vals[i];
        img.width = 200;
        td.appendChild(img);
      } else if (i == 5) {
        td.className = "wraplessRow";
        for (let j = 0; j < vals[i].length; j++) {
          let listItem = document.createElement('li');
          listItem.textContent = vals[i][j];
          td.appendChild(listItem);
        } 
      }else if(i==0) {
        td.innerText += vals[i] + "\n"; // Set the value as the text of the table cell
        
        let editLink= document.createElement("a");
        editLink.href="#";
        editLink.textContent="✎ ";
        editLink.className="editLink";
        editLink.id=vals[i];
        td.appendChild(editLink);
        let delLink= document.createElement("a");
        delLink.href="#";
        delLink.textContent="␡ ";
        delLink.className="delLink";
        delLink.id=vals[i];
        td.appendChild(delLink);
        
      } else {
        td.innerText = vals[i]; // Set the value as the text of the table cell
      }
      tr.appendChild(td); // Append the table cell to the table row
    }
    table.appendChild(tr); // Append the table row to the table
  });
  if (container != null)
    container.appendChild(table) // Append the table to the container element


let json = oldJSON;
let deletedElement;
    let delClick = document.getElementsByClassName("delLink");
    for (const element of delClick) {
      element.addEventListener("click", e => {
        for(let i = 0; i < json.length;i++) {
          if(json[i].train_name ==element.id) {
            console.log(true);
            deletedElement=json[i];
          }
        }
        deleteElement(deletedElement);
        deletedElement=null;
      });
    }
let edited;
    let editClick = document.getElementsByClassName("editLink");
    for (const element of editClick) {
      element.addEventListener("click", e => {
        console.log(element);
        for(let i = 0; i < json.length;i++) {
          if(json[i].train_name ==element.id) {
            console.log(true);
            edited=json[i];
            break;
          }
        }
        editElement(edited);
        edited=null;
      });
    }
}

const deleteElement = async (element) => {
  let response = await fetch(`/api/trains/${element._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (response.status != 200) {
    console.log("Error deleting");
    return;
  }

  let result = await response.json();
  showTrains();

}

const editElement = async (element) => {
  openDialog("editForm");
  document.getElementById("editForm").reset();
  document.getElementById("dialog").style.display="block";
  populateEditForm(element);
}

const openDialog = (id) => {
  document.getElementById("dialog").style.display = "block";
  document.querySelectorAll("#dialog-details > *").forEach((item) => {
    item.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
};

const populateEditForm = (train) => {
  const form = document.getElementById("editForm");
  form._id.value = train._id;
  form.user_name.value = train.user_name;
  form.user_email.value = train.user_email;
  form.train_name.value = train.train_name;
  form.company.value = train.company;
  form.build_date.value = train.build_date;
  form.service_locations.value=train.service_locations.toString();
  form.notes.value=train.notes;
  document.getElementById("img-prev").src = "./images/"+train.img;
};

const editSubmit = async (e) => {
  e.preventDefault();
  
  const form=document.getElementById("editForm");
  const formData = new FormData(form);
  let response;
  console.log("in put");
    response = await fetch(`/api/trains/${form._id.value}`, {
      method: "PUT",
      body: formData
    });
    document.getElementById("dialog").style.display = "none";
    document.getElementById("editForm").reset();
    showTrains();
}

window.onload = () => {
  showTrains();
  document.getElementById("editForm").onsubmit = editSubmit;

}
