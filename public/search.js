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
    let newJSON = makeShowJSON(json);
    convert(newJSON);
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
  
  function convert(jsonData) {
  
    // Get the container element where the table will be inserted
    let container = document.getElementById("tableDiv");
  
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
        } else {
          td.innerText = vals[i]; // Set the value as the text of the table cell
        }
        tr.appendChild(td); // Append the table cell to the table row
      }
      table.appendChild(tr); // Append the table row to the table
    });
    if (container != null)
      container.appendChild(table) // Append the table to the container element
  }
  
  const searchFunction = async () => {
    let searchVal=document.getElementById("searchValue").value;

    document.getElementById("tableDiv").innerHTML = "";
    let initjson = await getTrains();
    let json1 = JSON.parse(JSON.stringify(initjson));
    let newJSON = [];

    for(let i = 0; i <json1.length; i++) {

        if(json1[i].company.toLowerCase().includes(searchVal.toLowerCase()) || 
        json1[i].train_name.toLowerCase().includes(searchVal.toLowerCase()) || 
        json1[i].notes.toLowerCase().includes(searchVal.toLowerCase()) || 
        json1[i].service_locations.toString().toLowerCase().includes(searchVal.toLowerCase())) {

            let x = json1[i].stringify;
            newJSON.push(json1[i]);

        } 
    }
    convert(makeShowJSON(newJSON));

  }
  
  
  window.onload = () => {
    showTrains();
    document.getElementById("searchButton").onclick = searchFunction;
  }