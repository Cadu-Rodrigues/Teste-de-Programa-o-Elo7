const url = "http://www.mocky.io/v2/5d6fb6b1310000f89166087b";
window.onload = main;

function main() {
  requestJobs()
    .then((result) => {
      appendJobs(result);
    })
    .catch((error) => console.error(error));
}

function requestJobs() {
  return new Promise(function (resolve, reject) {
    returnHttpRequestAccordingToBrowser()
      .then(
        (httpRequest) => {
          httpRequest.onload = () => {
            resolve(httpRequest.responseText);
          };
          httpRequest.onerror = () => {
            reject(httpRequest.status + ": " + httpRequest.statusText);
          };
          httpRequest.open("GET", url, true);
          httpRequest.send();
        },
        (error) => {
          throw error;
        }
      )
      .catch((error) => {
        throw error;
      });
  });
}

function returnHttpRequestAccordingToBrowser() {
  return new Promise(function (resolve, reject) {
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
      reject("Não foi possível instanciar biblioteca de requisição http");
    }
    resolve(httpRequest);
  });
}

function appendJobs(result) {
  let jsonResponse = JSON.parse(result);
  let jobsList = document.createElement("ul");
  cleanInactiveJobs(jsonResponse)
    .then(
      (jsonResponseFiltered) => {
        jsonResponseFiltered.map((job) => {
          let constructedHTMLJob = constructHTMLJob(job);
          jobsList.appendChild(constructedHTMLJob);
        });
        document.getElementById("Jobs").appendChild(jobsList);
      },
      (error) => {
        throw error;
      }
    )
    .catch((e) => console.error(e));
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

function cleanInactiveJobs(jsonResponse) {
  return new Promise(function (resolve, reject) {
    if (!jsonResponse) reject("Json vazio");
    let jsonResponseFiltered = jsonResponse.vagas.filter((job) => job.ativa);
    resolve(jsonResponseFiltered);
  });
}
