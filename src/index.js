// Colton Williams
// 5/22/22

import "./styles.css";
require("dotenv").config();

// add event listeners for submit button and examples list
document.getElementById("submit-button").addEventListener("click", customQuery);
document
  .getElementById("examples-list")
  .addEventListener("change", exampleQuery);

// adds responce for selected example if not null
async function exampleQuery() {
  let example = document.getElementById("examples-list").value;
  if (example !== -1) {
    processQuery(example);
  }
}

// adds responce for inputted query
async function customQuery() {
  let query = document.getElementById("text-input").value;
  processQuery(query);
}

// adds a responce for a query to responces-list
// query - the query text
async function processQuery(query) {
  let json_results = await sendQuery(query);

  // get responce text from query
  let result_text = json_results["choices"][0]["text"];

  // make new li and article elements
  var responce_li = document.createElement("li");
  var responce = document.createElement("article");
  responce.classList.add("responce");

  // add prompt and responce to article
  responce.innerHTML = `<div class="response-container">
  <p class="responce-label">Prompt:</p>
  <p class="response-text">${query}</p></div>
  <div class="response-container">
  <p class="responce-label">Responce:</p><p class="response-text">${result_text}</p></div>`;
  responce_li.appendChild(responce);

  // add li to beginning of list
  document
    .getElementById("responces-list")
    .insertBefore(
      responce_li,
      document.getElementById("responces-list").firstChild
    );
}

// sends a query to openAI
// query - the query in text
// returns reponse in JSON
async function sendQuery(query) {
  let data = {
    prompt: query,
    temperature: 0.5,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  };
  try {
    let res = await fetch(
      "https://api.openai.com/v1/engines/text-curie-001/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          // get secret token from enviornment variable
          Authorization: `Bearer ${process.env.OPENAI_SECRET}`
        },
        body: JSON.stringify(data)
      }
    );
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
