import { getData } from "./getData.js";

const root = document.querySelector("#root");

async function main() {
  const data = await getData();

  console.log(data);

  root.innerHTML = `
    <ul>
      ${data.map(item => `<li>${item.friendly}</li>`).join("")}
    </ul>
  `;
}

main();
