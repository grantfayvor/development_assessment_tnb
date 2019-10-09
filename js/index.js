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
            <td><button type="button" onclick="getAddressInfo('${doc.id}')" class="btn btn-default">View</button></td>
          </tr>
        `;
    }, "");

    document.getElementById("table").hidden = false;
    document.getElementById("addresses").innerHTML = template;

    if (addresses.docs.length < 5) {
      document.getElementById("next").disabled = true;
    } else {
      document.getElementById("next").disabled = false;
    }
  } catch (error) {
    alert(`An error occurred. ${error}`);
  } finally {
    if (start <= 0) {
      document.getElementById("previous").disabled = true;
    }
  }
}

async function getAddressInfo (id) {
  let url = `https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup?id=${id}`;

  try {
    let details = await fetch(url).then(res => res.json()).then(data => data.response),
      template = Object.keys(details.docs[0]).reduce((acc, key) => {
        return `
        ${acc}
        <div class="row col-sm-12 col-xs-12">
          <div class="col-sm-5 col-xs-5">
            ${key.toUpperCase()} :
          </div>
          <div class="col-sm-7 col-xs-7" style="overflow-wrap:break-word;">
            ${details.docs[0][key]}
          </div>
        </div>
      `;
      }, "");

    document.getElementById("modalBody").innerHTML = template;
  } catch (error) {
    alert(`An error occurred. ${error}`);
  } finally {
    $("#addressModal").modal("show");
  }
}