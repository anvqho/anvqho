var animationInterval;

var openingAnimationInterval;
var closingAnimationInterval;
var pageAnimationInterval;
var flipAnimationInterval;

var pageOneStatic = false;
var pageTwoStatic = false;
var pageThreeStatic = false;

var pageAnimationPlaying = false;
var openingAnimationPlaying = false;

var openingButtonPresent = false;

var closing = false;

var currentPage = 0;
// previous unused math
// var sizeAdjustment = 4;
// var previousSizeToWindow = Math.floor(Math.floor(window.innerWidth / sizeAdjustment) / 32);

var adjustedSizeToWindow = Math.max(1, Math.min(2, Math.min(Math.floor(window.innerWidth / 320), Math.floor(window.innerHeight / 320))));

var adjustedSpriteHeight = 320 * adjustedSizeToWindow;
var adjustedSpriteWidth = 320 * adjustedSizeToWindow;

var defaultLeftMargin = Math.floor((window.innerWidth - adjustedSpriteWidth)/2);
console.log("window width is " + window.innerWidth + "and spriteWidth is " + adjustedSpriteWidth + "and default margin is" + defaultLeftMargin);

var buttonWrapperTopMargin = 14 * adjustedSizeToWindow;
var buttonWrapperLeftMargin = 65 * adjustedSizeToWindow + defaultLeftMargin;

var openingButtonTopMargin = 72 * adjustedSizeToWindow;
var openingButtonLeftMargin = 87 * adjustedSizeToWindow + defaultLeftMargin;

var presentButtonTopMargin = 116 * adjustedSizeToWindow;
var presentButtonLeftMargin = 45 * adjustedSizeToWindow + defaultLeftMargin;

var noCounter = 0;

var openingButton = document.getElementById("openingButton");
var presentButton = document.getElementById("presentButton");
var buttons = document.getElementById("buttons");

var currentAnimation = "intro";
var numPrint = 0;

window.ondragstart = function() { return false; } 

function setupFixedMargin() {

  var fixedClasses = document.querySelectorAll('.fixedClass');
  fixedClasses.forEach(element => {
    element.style.top = "0px";
    element.style.left = defaultLeftMargin + "px";
  });

  var buttonWrappers = document.querySelectorAll('.buttonWrapper');
  buttonWrappers.forEach(element => {
    element.style.top = buttonWrapperTopMargin + "px";
    // element.style.left = buttonWrapperLeftMargin + "px";
    element.style.width = adjustedSpriteWidth + "px";
  });

  var fastButtonWrapper = getSheet("fastButtonWrapper");
  fastButtonWrapper.style.top = buttonWrapperTopMargin + "px";
  fastButtonWrapper.style.width = adjustedSpriteWidth + "px";

    var fastButtonInnerWrapper = getSheet("fastButtonInnerWrapper");
  fastButtonInnerWrapper.style.width = adjustedSpriteWidth + "px";

  openingButton.style.top = openingButtonTopMargin + "px";
  openingButton.style.left = openingButtonLeftMargin + "px";

  presentButton.style.top = presentButtonTopMargin + "px";
  presentButton.style.left = presentButtonLeftMargin + "px";

  toggleOpeningButton();
}

function getSheet(type) {
  return document.getElementById(type);
}

function getFrames(type) {
  switch (type) {
    case "pageOneAnimation":
      return 83;
    case "pageTwoAnimation":
      return 69;
    case "pageThreeAnimation":
      return 49;
    case "openingAnimation":
      return 18;
    case "closingAnimation":
      return 18;
    case "flipNextAnimation":
      return 6;
    case "flipPreviousAnimation":
      return 6;
    default:
      return 1;
  }
}

function printLog(text) {
  document.getElementById("testLog").innerHTML = text;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setupSheet(type, spriteWidth, spriteHeight) {
  var sheet = getSheet(type);
  var sheetWidth = spriteWidth * getFrames(type);

  sheet.style.height = spriteHeight + "px";
  sheet.style.width = spriteWidth + "px";
  sheet.style.backgroundSize = spriteWidth * getFrames(type) + "px";
}

function setupElement(type, spriteWidth, spriteHeight) {
  var sheet = getSheet(type);

  sheet.style.height = spriteHeight + "px";
  sheet.style.width = spriteWidth + "px";
  sheet.style.backgroundSize = spriteWidth + "px";
}

function setupButtons(type, spriteWidth, spriteHeight) {
  var openingButtonImg = getSheet("openingButtonImg");

  openingButtonImg.style.height = 223 * adjustedSizeToWindow + "px";
  openingButtonImg.style.width = 146 * adjustedSizeToWindow + "px";

  var buttonImages = document.querySelectorAll('.buttonImage');
  buttonImages.forEach(element => {
    element.style.height = 32 * adjustedSizeToWindow + "px";
    element.style.width = 60 * adjustedSizeToWindow + "px";
  });

  var fastButtonImage = getSheet("fastButtonImage");
  fastButtonImage.style.height = 32 * adjustedSizeToWindow + "px";
  fastButtonImage.style.width = 60 * adjustedSizeToWindow + "px";

  var presentButtonImg = getSheet("presentButtonImg");

  presentButtonImg.style.height = 102 * adjustedSizeToWindow + "px";
  presentButtonImg.style.width = 86 * adjustedSizeToWindow + "px";
}

function setupButtonEvents() {
  var presentButtonImg = getSheet("presentButtonImg");
  presentButton.addEventListener("mousedown", (event) => {
    presentButtonImg.src = "https://imgur.com/DuDFCcy.png";
  });

  var openingButtonImg = getSheet("openingButtonImg");
  openingButton.addEventListener("mousedown", (event) => {
    openingButtonImg.src = "https://imgur.com/Syo2vGP.png";
  });

  var fastButtonImage = getSheet("fastButtonImage");
  getSheet("fastButton").addEventListener("mousedown", (event) => {
    fastButtonImage.src = "https://imgur.com/oslynL3.png";
  });

  var closeButtons = document.querySelectorAll('.closeButton');
  closeButtons.forEach(element => {
      var childImg = element.children[0];
      element.addEventListener("mousedown", (event) => {
        childImg.src = "https://imgur.com/Pzatwzx.png";
    });
  });

  var previousButtons = document.querySelectorAll('.previousButton');
  previousButtons.forEach(element => {
      var childImg = element.children[0];
      element.addEventListener("mousedown", (event) => {
        childImg.src = "https://imgur.com/GSBQYXH.png";
    });
  });

  var nextButtons = document.querySelectorAll('.nextButton');
  nextButtons.forEach(element => {
      var childImg = element.children[0];
      element.addEventListener("mousedown", (event) => {
        childImg.src = "https://imgur.com/IgT04fq.png";
    });
  });

  window.addEventListener('mouseup', function(event) {
    resetButtonImgSources();
  })
}

function resetButtonImgSources() {
  var closeButtonImages = document.querySelectorAll('.closeButtonImage');
  closeButtonImages.forEach(element => {
    element.src = "https://imgur.com/8OWxGXZ.png";
  });

  var previousButtonImages = document.querySelectorAll('.previousButtonImage');
  previousButtonImages.forEach(element => {
    element.src = "https://imgur.com/fWYpT3W.png";
  });

  var nextButtonImages = document.querySelectorAll('.nextButtonImage');
  nextButtonImages.forEach(element => {
    element.src = "https://imgur.com/WS5iGvM.png";
  });

  getSheet("presentButtonImg").src = "https://imgur.com/WOX7cwC.png";
  getSheet("openingButtonImg").src = "https://imgur.com/zEkeHoX.png";
  getSheet("fastButtonImage").src = "https://imgur.com/IUrRxYJ.png";
}

function animationStop(interval) {
  clearInterval(interval);
}

function toggleOpeningButton() {
  if (openingButtonPresent) {
    openingButton.style.display = "none";
    openingButtonPresent = false;
  } else {
    openingButton.style.display = "inline-block";
    openingButtonPresent = true;
  }
}

function animateOpening() {
  var type = "openingAnimation";
  var sheet = getSheet(type);
  openingSheetWidth = adjustedSpriteWidth * getFrames(type);

  sheet.style.display = "inline-block";
  currentAnimation = type;

  var position = 0; // start position for the image
  const speed = 120; // in millisecond(ms)
  const diff = adjustedSpriteWidth; // difference between two sprite frames

  openingAnimationInterval = setInterval(() => {
    sheet.style.backgroundPosition = `-${position}px 0px`;

    if (position == 0 && closing) {
      toggleOpeningButton();
      closing = false;
    } else if (position < openingSheetWidth - diff && !closing) {
      if (!openingButtonPresent) {
        numPrint += 1;
        openingAnimationPlaying = true;
        // increment the position by the width of each sprite each time to move forward
        position = position + diff;
      } else {
        // stay in place in the first frame
        position = position;
      }
    } else {
      if (closing) {
        // decrements the position by the width of each sprite each time to move backward
        position = position - diff;
      } else {
        // stay in place in the last frame
        position = position;
        if (openingAnimationPlaying) {
          openingAnimationPlaying = false;
          animatePage(1);
        }
      }
    }
  }, speed);
}

function animatePage(pageNumber) {
  var type;
  var staticPageReached = false;
  if (pageNumber == 1) {
    type = "pageOneAnimation";
    staticPageReached = staticPageReached || pageOneStatic;
  } else if (pageNumber == 2) {
    type = "pageTwoAnimation";
    staticPageReached = staticPageReached || pageTwoStatic;
  } else {
    type = "pageThreeAnimation";
    staticPageReached = staticPageReached || pageThreeStatic;
  }

  currentPage = pageNumber;

  if (staticPageReached) {
    toggleStaticPage(pageNumber);
    return;
  }

  var sheet = getSheet(type);
  pageSheetWidth = adjustedSpriteWidth * getFrames(type);

  sheet.style.display = "inline-block";

  var position = 0; // start position for the image
  const speed = 160; // in millisecond(ms)
  const diff = adjustedSpriteWidth; // difference between two sprite frames

  pageAnimationPlaying = true;
  getSheet("fastButtonWrapper").style.display = "inline-block";

  var counter = 0;
  pageAnimationInterval = setInterval(() => {
    sheet.style.backgroundPosition = `-${position}px 0px`;

    if (position < pageSheetWidth - diff) {
      // increment the position by the width of each sprite each time to move forward
        position = position + diff;
    } else {
      if (pageAnimationPlaying) {
        pageAnimationPlaying = false;
        stopAnimatePage(type);
      }
    }
  }, speed);
}

function animateFlip(type, pageNumber) {
  var sheet = getSheet(type);
  flipSheetWidth = adjustedSpriteWidth * getFrames(type);

  sheet.style.display = "inline-block";
  currentAnimation = type;

  var position = 0; // start position for the image
  const speed = 120; // in millisecond(ms)
  const diff = adjustedSpriteWidth; // difference between two sprite frames

  flipAnimationInterval = setInterval(() => {
    sheet.style.backgroundPosition = `-${position}px 0px`;

    if (position < flipSheetWidth - diff) {
      // increment the position by the width of each sprite each time to move forward
        position = position + diff;
    } else {
      animatePage(pageNumber);
      clearInterval(flipAnimationInterval);
      sheet.style.display = "none";
    }
  }, speed);
}

function stopAnimateCurrentPage() {
  var type;
  if (currentPage == 1) {
    type = "pageOneAnimation";
  } else if (currentPage == 2) {
    type = "pageTwoAnimation";
  } else {
    type = "pageThreeAnimation";
  }

  stopAnimatePage(type);
}

async function stopAnimatePage(type) {
  console.log("it did get here");
  // Page animation only needs to be watched once, static pages will replace them indefinitely afterwards
  if (type == "pageOneAnimation") {
    pageOneStatic = true;
    toggleStaticPage(1);
  } else if (type == "pageTwoAnimation") {
    pageTwoStatic = true;
    toggleStaticPage(2);
  } else {
    pageThreeStatic = true;
    toggleStaticPage(3);
  }
  await sleep(100);
  getSheet("fastButtonWrapper").style.display = "none";
  clearInterval(pageAnimationInterval);
  pageAnimationPlaying = false;
  var sheet = getSheet(type);
  sheet.style.display = "none";
}

function flipPage(currentPageNumber, nextPageNumber) {
  var flipType;
  if (currentPageNumber < nextPageNumber) {
    flipType = "flipNextAnimation";
  } else {
    flipType = "flipPreviousAnimation";
  }
  toggleStaticPage(currentPageNumber);
  animateFlip(flipType, nextPageNumber);
}

function toggleStaticPage(pageNumber) {
  var pageId;
  if (pageNumber == 1) {
    pageId = "pageOneCombo";
  } else if (pageNumber == 2) {
    pageId = "pageTwoCombo";
  } else {
    pageId = "pageThreeCombo";
  }

  var staticPage = document.getElementById(pageId);
  if (staticPage.style.display == "none") {
    staticPage.style.display = "inline-block";
  } else {
    staticPage.style.display = "none"
  }
}

function closeCard() {
  toggleStaticPage(currentPage);
  closing = true;
}

function copy(text) {
    return new Promise((resolve, reject) => {
        if (typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && navigator.permissions !== "undefined") {
            const type = "text/plain";
            const blob = new Blob([text], { type });
            const data = [new ClipboardItem({ [type]: blob })];
            navigator.permissions.query({name: "clipboard-write"}).then((permission) => {
                if (permission.state === "granted" || permission.state === "prompt") {
                    navigator.clipboard.write(data).then(resolve, reject).catch(reject);
                }
                else {
                    reject(new Error("Permission not granted!"));
                }
            });
        }
        else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";
            textarea.style.width = '2em';
            textarea.style.height = '2em';
            textarea.style.padding = 0;
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand("copy");
                document.body.removeChild(textarea);
                resolve();
            }
            catch (e) {
                document.body.removeChild(textarea);
                reject(e);
            }
        }
        else {
            reject(new Error("None of copying methods are supported by this browser!"));
        }
    });
    
}

async function openPresent() {
  try {
    await copy("https://www.humblebundle.com/?gift=bF3HAeV4e7mHVVe2");
    await sleep(100);
    alert("Link copied to clipboard, paste in your browser and enjoy ;)");
  }
  catch(e) {
    await sleep(100);
    alert("Paste this into your browser and enjoy ;) - https://www.humblebundle.com/?gift=bF3HAeV4e7mHVVe2");
  }
}

function validatePassword() {

  const username = getSheet('username').value.toLowerCase();
  const password = getSheet('password').value.toLowerCase();

  if (!(username === "christopherjames" || username === "christopher-james" || username === "cj")) {
    alert("Nuh uh, fake news, call mah boy over for the correct login and try again");
    return;
  }

  if (!(password.includes("christopherjames") || password.includes("christopher-james") || password.includes("cj"))) {
    alert("Nuh uh, fake news, call mah boy over for the correct login and try again");
    return;
  }

  if (!(password.includes("an"))) {
    alert("Nuh uh, fake news, call mah boy over for the correct login and try again");
    return;
  }

  if (!(password.includes("02142025") || password.includes("2142025") || password.includes("02/14/2025") 
    || password.includes("2/14/2025") || password.includes("02-14-2025") || password.includes("2-14-2025")
    || password.includes("021425") || password.includes("21425") || password.includes("02/14/25") 
    || password.includes("2/14/25") || password.includes("02-14-25") || password.includes("2-14-25"))) {
    alert("Nuh uh, fake news, call mah boy over for the correct login and try again");
    return;
  }

  document.querySelectorAll('.passwordContainer')[0].style.display = "none";
  document.querySelectorAll('.container')[0].style.display = "inline-block";
}

const passwordField = document.getElementById("password");
const togglePassword = document.querySelector(".password-toggle-icon i");

togglePassword.addEventListener("click", function () {
  if (passwordField.type === "password") {
    passwordField.type = "text";
    togglePassword.classList.remove("fa-eye");
    togglePassword.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    togglePassword.classList.remove("fa-eye-slash");
    togglePassword.classList.add("fa-eye");
  }
});

//Set up animation sheet dimensions
setupSheet("pageOneAnimation", adjustedSpriteWidth, adjustedSpriteHeight);
setupSheet("pageThreeAnimation", adjustedSpriteWidth, adjustedSpriteHeight);
setupSheet("pageTwoAnimation", adjustedSpriteWidth, adjustedSpriteHeight);
setupSheet("flipNextAnimation", adjustedSpriteWidth, adjustedSpriteHeight);
setupSheet("flipPreviousAnimation", adjustedSpriteWidth, adjustedSpriteHeight);
setupSheet("openingAnimation", adjustedSpriteWidth, adjustedSpriteHeight);
setupElement("pageOneStatic", adjustedSpriteWidth, adjustedSpriteHeight);
setupElement("pageTwoStatic", adjustedSpriteWidth, adjustedSpriteHeight);
setupElement("pageThreeStatic", adjustedSpriteWidth, adjustedSpriteHeight);
setupElement("pageOneCombo", adjustedSpriteWidth, adjustedSpriteHeight);
setupElement("pageTwoCombo", adjustedSpriteWidth, adjustedSpriteHeight);
setupElement("pageThreeCombo", adjustedSpriteWidth, adjustedSpriteHeight);

setupButtons();
setupButtonEvents();

setupFixedMargin();
// Start first animation
animateOpening();
