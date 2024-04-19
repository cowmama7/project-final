window.onload = () => {
  console.log("fffff");
  document.getElementById("surveyForm").onsubmit = addEditTrain;
}

const resetForm = () => {
  const form = document.getElementById("surveyForm");
  form.reset();
}; 

const addEditTrain = async (e) => {
  e.preventDefault();
  const form = document.getElementById("surveyForm");
  const formData = new FormData(form);
  console.log(formData);
  let response;

  console.log("in post");
  response = await fetch("/api/trains", {
    method: "POST",
    body: formData,
  });


  console.log(response);
  //successfully got data from server
  if (response.status != 200) {
    console.log("Error posting data");
  }

  await response.json();
  alert("Successfully added item");
  resetForm();
};