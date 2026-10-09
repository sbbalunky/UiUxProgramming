const serviceName = "bestGame";
let isSubcribed = false;
let submitCount = 0;


function makeSubcribeMessage(email, subscribed) {
  if (subscribed == true) {
    return email + "로 신청이 완료되었습니다.";
  }
  
  return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
  event.preventDefault();

  const subscriberEmail = emailInput.value.trim();

  if (subscriberEmail === "") {
    subscribeMessage.textContent = "이메일을 입력한 뒤 신청해주세요.";
    emailInput.focus();
    return;
  }

  isSubcribed = true;
  submitCount += 1;

  subscribeMessage.textContent = makeSubcribeMessage(subscriberEmail, isSubcribed);

  subscribeMessage.classList.add("is-success");

  subscribeButton.textContent = "신청완료";
  subscribeButton.disabled = true;
}
subscribeForm.addEventListener("submit", handleSubscribe);

const thumbsUp = document.querySelector("#thumbsUp");
const commet = document.querySelector("#commet");
const commetCount = document.querySelector("#commetCount");
const agreeChecks = document.querySelectorAll(".agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const recordsButton = document.querySelector("#recordsButton");

function handleThumbsUp(event) {
  const isThumbsUp = document.body.classList.toggle("thumbs");

  thumbsUp.textContent = isThumbsUp ? "마음에 들어요" : "마음에 들지 않아요";
}

thumbsUp.addEventListener("click", handleThumbsUp);

function handlecommet() {
  const maxLength = commet.maxLength;
  const currenlength = Math.min(commet.value.length, maxLength);

  commetCount.textContent = currenlength + " / " + maxLength;
}

commet.addEventListener("input", handlecommet);

//여기 부분은 체크박스 부분을 잘 써보고 싶어서 인터넷 검색으로 따라 만들었습니다.
//주석 처리 부분은 제 스스로 이해하기 위해서 남겨놓았습니다.
function handleAgreeChange(event) {
  //체크박스가 중복 체크가 안되게 하기
  if (event.currentTarget.checked) {
    agreeChecks.forEach((checkbox) => {
      if (checkbox !== event.currentTarget) {
        checkbox.checked = false;
      }
    });
  }

  //체크된 항목이 있는지 확인하기 <some>
  const agreed = Array.from(agreeChecks).some(
    (checkbox) => checkbox.checked
  );

  recordsButton.disabled = !agreed;

  agreeMessage.textContent = agreed ? "의견 감사합니다." : "평가를 남겨주세요.";
  agreeMessage.classList.toggle("is-ready", agreed);
}

agreeChecks.forEach((checkbox) => {
  checkbox.addEventListener("change", handleAgreeChange);
});

const tabs = document.querySelectorAll(".tab");
const panel = document.querySelectorAll(".panel");

function resetTabsAndPanel() {
  tabs.forEach(function(tab){
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false")
  });
  panel.forEach(function(panel){
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");

  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanel();
  activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});