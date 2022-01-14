const url = "https://www.mocky.io/v2/5d6fb6b1310000f89166087b";
window.onload = main;

async function main() {
  try {
    let httpRequest = await returnHttpRequestAccordingToBrowser();
    let apiResult = await requestJobs(httpRequest);
    await appendJobs(apiResult);
  } catch (error) {
    console.error(error);
  }
}

async function returnHttpRequestAccordingToBrowser() {
  if (window.XMLHttpRequest) {
    // Mozilla, Safari, ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    // IE
    try {
      httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {}
    }
  }

  if (!httpRequest) {
    throw "Não foi possível instanciar biblioteca de requisição http";
  }
  return httpRequest;
}

function requestJobs(httpRequest) {
  return new Promise(function (resolve, reject) {
    httpRequest.onload = () => {
      resolve(httpRequest.responseText);
    };
    httpRequest.onerror = () => {
      reject(httpRequest.status + ": " + httpRequest.statusText);
    };
    httpRequest.open("GET", url, true);
    httpRequest.send();
  });
}

async function appendJobs(result) {
  let jsonResponse = JSON.parse(result);
  let jobsList = document.getElementById("Vagas");
  let jsonResponseFiltered = await cleanInactiveJobs(jsonResponse);
  jsonResponseFiltered.map((job) => {
    let constructedHTMLJob = constructHTMLJob(job);
    jobsList.appendChild(constructedHTMLJob);
  });
}

async function cleanInactiveJobs(jsonResponse) {
  if (!jsonResponse) throw "Json vazio";
  let jsonResponseFiltered = jsonResponse.vagas.filter((job) => job.ativa);
  return jsonResponseFiltered;
}

function constructHTMLJob(job) {
  let a = document.createElement("a");
  let span = document.createElement("span");
  let li = document.createElement("li");
  li.appendChild(a);
  li.appendChild(span);
  a.textContent = job.cargo;
  a.href = job.link;
  if (job.localizacao) {
    span.textContent =
      job.localizacao.bairro +
      " - " +
      job.localizacao.cidade +
      ", " +
      job.localizacao.pais;
  } else {
    span.textContent = "Remoto";
  }
  return li;
}
