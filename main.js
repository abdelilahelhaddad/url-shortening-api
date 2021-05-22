const navbar = document.querySelector("#navbar");
const burgerMenu = document.querySelector(".burger-menu");

burgerMenu.addEventListener("click", () => {
  navbar.classList.toggle("active");
})

const URLbtn = document.querySelector(".URLbtn");
const url = document.querySelector("#url");
const SpanURL = document.querySelector(".error");
const shortLinkSection = document.querySelector("#short_Link_Section");

URLbtn.addEventListener("click", (e) => {
  e.preventDefault();
  let urlValue = url.value;
  /*https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url*/
  const pattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  /*https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string*/
  function extractHostname(url) {
    var hostname;
    if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
  }

  function extractRootDomain(url) {
    var domain = extractHostname(url),
      splitArr = domain.split('.'),
      arrLen = splitArr.length;
    if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
        domain = splitArr[arrLen - 3] + '.' + domain;
      }
    }
    return domain;
  }

  const FinalUrl = extractRootDomain(urlValue);

  if (pattern.test(urlValue)) {
    getShorten(FinalUrl);
    urlValue = "";
  } else {
    url.classList.add("error");
    SpanURL.style.display = "block";
  }

});

function createLinkSection(link) {
  var HTMLSection = document.createElement('div');
  HTMLSection.className = 'shorted';
  HTMLSection.innerHTML = `
    <a href="${url.value}" class="original-link">${url.value}</a>
    <div class="shorted-link-copy">
    <a href="${link.result.full_short_link}" class="shorted-link">${link.result.full_short_link}</a>
    <a href="#" id="copytext" dclass="btn btnCopy">Copy</a>
    </div>
  `;

  shortLinkSection.appendChild(HTMLSection);

  storeLink(url.value, link.result.full_short_link);
}

const APIURL = 'https://api.shrtco.de/v2/shorten?url=';

async function getShorten(OriginURL) {
  try {
    const {
      data
    } = await axios(APIURL + OriginURL);

    createLinkSection(data);
  } catch (error) {
    console.log(error)
  }
}

function storeLink(url, shortedLink) {
  let task = {
    url,
    shortedLink
  };
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.push(task);

  localStorage.setItem('tasks', JSON.stringify(tasks));
  location.reload();
}

function getTasks() {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.reverse().forEach((task) => {
    let HTMLSection = document.createElement('div');
    HTMLSection.className = 'shorted';
    HTMLSection.innerHTML = `
      <a href="${task.url}" class="original-link">${task.url}</a>
      <div class="shorted-link-copy">
      <a id="CopyLink" href="${task.shortedLink}" class="shorted-link">${task.shortedLink}</a>
      <a href="#" id="copytext" class="btn btnCopy">Copy</a>
      </div>`;

    shortLinkSection.appendChild(HTMLSection);
  });
}

getTasks();

shortLinkSection.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btnCopy")) return;

  const text = e.target.closest(".shorted-link-copy").querySelector(".shorted-link").innerText;

  const inputElement = document.createElement('input');
  inputElement.setAttribute("value", text);
  document.body.appendChild(inputElement);
  inputElement.select();
  document.execCommand("copy");
  inputElement.parentNode.removeChild(inputElement);

  e.target.textContent = "Copied!";
  e.target.style.background = "hsl(257, 27%, 26%)";
})