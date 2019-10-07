let start = 0,
  rows = 5;

function previous () {
  start -= 5;
  findAdresses();
}

function next () {
  start += 5;
  findAdresses();
  document.getElementById("previous").disabled = false;
}

async function findAdresses () {
  let query = document.getElementById("query").value,
    url = `https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?fq=type:adres&q=${query}&start=${start}&rows=${rows}&fq=*:*`;

  try {
    let addresses = await fetch(url).then(res => res.json()).then(data => data.response);

    if (!addresses) {
      alert(`Could not find any address`);
      return;
    }

    let template = addresses.docs.reduce((acc, doc) => {
      return `
          ${acc}
          <tr>
            <td>${doc.id}</td>
            <td>${doc.weergavenaam}</td>
            <td>${doc.type}</td>
            <td>${doc.score}</td>
          </tr>
        `;
    }, "");

    document.getElementById("table").hidden = false;
    document.getElementById("addresses").innerHTML = template;
  } catch (error) {
    alert(`An error occurred. ${error}`);
  } finally {
    if (start <= 0) {
      document.getElementById("previous").disabled = true;
    }
  }
}