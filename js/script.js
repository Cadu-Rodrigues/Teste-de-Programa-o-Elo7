const url = "https://www.mocky.io/v2/5d6fb6b1310000f89166087b";
window.onload = main;

async function main() {
  try {
    const jobs = await getJobs();
    const activeJobs = await cleanInactiveJobs(jobs);
    await appendJobs(activeJobs);
  } catch (error) {
    console.error(error);
  }
}
async function getJobs() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(url, requestOptions);
  return response.json();
}

async function appendJobs(jobs) {
  const jobsList = document.getElementById("Vagas");
  const loader = document.getElementById("Loader");
  loader.remove();
  jobs.map((job) => {
    const constructedHTMLJob = constructHTMLJob(job);
    jobsList.appendChild(constructedHTMLJob);
  });
}

async function cleanInactiveJobs(jobs) {
  if (!jobs) throw "Json vazio";
  const jobsFiltered = jobs.vagas.filter((job) => job.ativa);
  return jobsFiltered;
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
