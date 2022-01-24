const url = "https://www.mocky.io/v2/5d6fb6b1310000f89166087b";

async function main() {
  const jobsList = document.getElementById("Vagas");
  const loader = document.getElementById("Loader");
  loader.className = "loader";
  loader.textContent = "";
  try {
    const jobs = await getJobs();
    const activeJobs = cleanInactiveJobs(jobs);
    loader.remove();
    renderJobs(activeJobs, jobsList, loader);
  } catch (error) {
    loader.remove();
    renderNetworkError(jobsList);
    console.error(error);
  }
}
function renderNetworkError(jobsList) {
  const p = document.createElement("span");
  p.textContent = "Vagas não encontradas";
  jobsList.appendChild(p);
}
async function getJobs() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data.vagas;
}

function renderJobs(jobs, jobsList) {
  jobs.map((job) => {
    const constructedHTMLJob = constructHTMLJob(job);
    jobsList.appendChild(constructedHTMLJob);
  });
}

function cleanInactiveJobs(jobs) {
  return jobs.filter((job) => job.ativa);
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
    const { bairro, cidade, pais } = job.localizacao;
    span.textContent = `${bairro} - ${cidade}, ${pais}`;
    return li;
  }
  span.textContent = "Remoto";
  return li;
}
main();
