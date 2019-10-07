async function findAdresses () {
  let query = document.getElementById("query").value,
    url = `https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?fq=type:adres&q=${query}&start=0&rows=20&fq=*:*`;

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

    document.getElementById("addresses").innerHTML = template;

  } catch (error) {
    alert(`An error occurred. ${error}`);
  }
}