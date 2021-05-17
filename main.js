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

  HTMLSection.innerHTML = `
  <div class="shorted">
    <a href="${url.value}" class="original-link">${url.value}</a>
    <div class="shorted-link-copy">
    <a href="${link.result.full_short_link}" class="shorted-link">${link.result.full_short_link}</a>
    <a href="#" onclick="copyText()" id="copytext" class="btn">Copy</a>
    </div>
  </div>
  `;

  shortLinkSection.appendChild(HTMLSection);
}

const APIURL = 'https://api.shrtco.de/v2/shorten?url=';

async function getShorten(urll) {
  try {
    const {
      data
    } = await axios(APIURL + urll);

    createLinkSection(data);
  } catch (error) {
    console.log(error)
  }
  const url = document.querySelector("#url").value;
  const shortedLink = document.querySelector(".shorted-link").textContent;
  console.log(url);
  console.log(shortedLink);
  if (url && shortedLink) {
    localStorage.setItem(JSON.stringify(shortedLink), JSON.stringify(url));
  }
}

for (let i = 0; i < localStorage.length; i++) {
  const lsKey = localStorage.key(i);
  const getValue = JSON.parse(localStorage.getItem(lsKey));

  var HTMLSection = document.createElement('div');

  HTMLSection.innerHTML = `
  <div class="shorted">
    <a href="${getValue}" class="original-link">${getValue}</a>
    <div class="shorted-link-copy">
    <a href="${lsKey}" class="shorted-link">${lsKey}</a>
    <a href="#" onclick="copyText()" id="copytext" class="btn">Copy</a>
    </div>
  </div>
  `;

  shortLinkSection.appendChild(HTMLSection);
}