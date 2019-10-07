/**
 * @var start used to determine the start position for a paginated result.
 */
let start = 0;

/**
 * @var rows determines the number of data returned from the api
 */
let rows = 5;

/**
 * @function previous decrements the current start value by 5(no of rows) and fetches the previous records with that start value 
 */
function previous () {
  start -= 5;
  findAdresses();
}

/**
 * @function next increments the current start value by 5(no of rows) and fetches the next records with that start value
 */
function next () {
  start += 5;
  findAdresses();

  /**
   * @description enable the previous button as long as next has been clicked.
   */
  document.getElementById("previous").disabled = false;
}

/**
 * @function findAdresses finds paginated addresses and builds the inner html for the table body.
 */
async function findAdresses () {
  let query = document.getElementById("query").value,
    url = `https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?fq=type:adres&q=${query}&start=${start}&rows=${rows}&fq=*:*`;

  try {
    let addresses = await fetch(url).then(res => res.json()).then(data => data.response);

    /**
     * @description show an alert if no address was found.
     */
    if (!addresses) {
      alert(`Could not find any address`);
      return;
    }

    /**
     * @description use the array reduce function to build up the table body
     */
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

    /**
     * @description make the table visible
     */
    document.getElementById("table").hidden = false;

    /**
     * @description set the body of the table to be the reduced string template
     */
    document.getElementById("addresses").innerHTML = template;
  } catch (error) {
    alert(`An error occurred. ${error}`);
  } finally {
    /**
     * if start is less or equals 0, disable the previous button.
     */
    if (start <= 0) {
      document.getElementById("previous").disabled = true;
    }
  }
}