const showEmailResult = async (e) => {
    e.preventDefault();
    const result = document.getElementById("result");
    let response = await getEmailResult();
    if(response.status==200) {
        result.innerHTML="Email has been sent!";
    }else{
        result.innerHTML = "Sorry your email was not sent.";
    }
};

const getEmailResult = async (e)=> {
    const form = document.getElementById("contactForm");
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json=JSON.stringify(object);
    const result=document.getElementById("result");
    result.innerHTML = "Please wait";

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                Accept:"application/json"
            },
            body:json
        });

        return response;
    } catch(error){
        console.log(error);
        result.innerHTML = "Sorry, your email couldn't be sent";
    }
}

function contactPopup() {
    let contactClick = document.getElementsByClassName("contactLink");
    for (const element of contactClick) {
      element.addEventListener("click", e => {
        document.getElementById('id01').style.display = 'block'
        console.log("success");
      })
    }
  }

window.onload = () => {
    console.log("fffff");
    document.getElementById("surveyForm").onsubmit = addEditTrain;
    document.getElementById("contactForm").onsubmit=showEmailResult;
    contactPopup();
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