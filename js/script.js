const url = "https://www.mocky.io/v2/5d6fb6b1310000f89166087b";
window.onload = main;

async function main() {
  try {
    const httpRequest = await returnHttpRequestAccordingToBrowser();
    const apiResult = await requestJobs(httpRequest);
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
      resolve(JSON.parse(httpRequest.responseText));
    };
    httpRequest.onerror = () => {
      reject(httpRequest.status + ": " + httpRequest.statusText);
    };
    httpRequest.open("GET", url, true);
    httpRequest.send();
  });
}

async function appendJobs(result) {
  const jobsList = document.getElementById("Vagas");
  const loader = document.getElementById("Loader");
  const jsonResponseFiltered = await cleanInactiveJobs(result);
  loader.remove();
  jsonResponseFiltered.map((job) => {
    const constructedHTMLJob = constructHTMLJob(job);
    jobsList.appendChild(constructedHTMLJob);
  });
}

async function cleanInactiveJobs(jsonResponse) {
  if (!jsonResponse) throw "Json vazio";
  const jsonResponseFiltered = jsonResponse.vagas.filter((job) => job.ativa);
  return jsonResponseFiltered;
}

function constructHTMLJob(job) {
  const a = document.createElement("a");
  const span = document.createElement("span");
  const li = document.createElement("li");
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
    return li;
  }
  span.textContent = "Remoto";
  return li;
}
