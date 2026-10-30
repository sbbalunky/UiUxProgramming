let isSubcribed = false;
let submitCount = 0;

const subscribeForm = document.querySelector("#subscribe-form");
const subscribeMessage = document.querySelector("#subscribeMessage");
const subscribeSteps = document.querySelectorAll(".subscribe-step");
const gameNameInput = document.querySelector("#game-name");
const gameGenreInput = document.querySelector("#game-genre");
const gameDescriptionInput = document.querySelector("#game-description");
const emailInput = document.querySelector("#email");
const subscribeNext = document.querySelector("#subscribe-next");
const subscribePrev = document.querySelector("#subscribe-prev");
const descriptionCount = document.querySelector("#description-count");
const gameNameError = document.querySelector("#game-name-error");
const gameGenreError = document.querySelector("#game-genre-error");
const gameDescriptionError = document.querySelector("#game-description-error");
const emailError = document.querySelector("#email-error");
const subscribeReview = document.querySelector("#subscribe-review");
const subscribeReviewPrev = document.querySelector("#subscribe-review-prev");
const subscribeConfirm = document.querySelector("#subscribe-confirm");
const reviewGameName = document.querySelector("#review-game-name");
const reviewGameGenre = document.querySelector("#review-game-genre");
const reviewGameDescription = document.querySelector("#review-game-description");
const reviewEmail = document.querySelector("#review-email");
const subscribeCompleteDialog = document.querySelector("#subscribe-complete-dialog");
const viewMyRecommendation = document.querySelector("#view-my-recommendation");
const newRecommendation = document.querySelector("#new-recommendation");
const myRecommendationDialog = document.querySelector("#my-recommendation-dialog");
const closeMyRecommendation = document.querySelector("#close-my-recommendation");
const myGameName = document.querySelector("#my-game-name");
const myGameGenre = document.querySelector("#my-game-genre");
const myGameDescription = document.querySelector("#my-game-description");
const myEmail = document.querySelector("#my-email");
const completionActions = document.querySelector("#completion-actions");
const completionView = document.querySelector("#completion-view");
const completionNew = document.querySelector("#completion-new");


function updateFieldState(input, isValid) {
  input.classList.toggle("is-valid", isValid);
  input.classList.toggle("is-invalid", !isValid);
  input.setAttribute("aria-invalid", String(!isValid));
}

function validateGameName() {
  const gameName = gameNameInput.value.trim();
  const isValid = gameName.length >= 2;

  updateFieldState(gameNameInput, isValid);

  gameNameError.textContent = isValid
    ? ""
    : "게임 제목은 2자 이상 입력해주세요.";

  return isValid;
}

function validateGameGenre() {
  const gameGenre = gameGenreInput.value.trim();
  const isValid = gameGenre.length >= 2;

  updateFieldState(gameGenreInput, isValid);

  gameGenreError.textContent = isValid
    ? ""
    : "게임 장르는 2자 이상 입력해주세요.";

  return isValid;
}

function validateGameDescription() {
  const gameDescription = gameDescriptionInput.value.trim();
  const isValid = gameDescription.length >= 10;

  updateFieldState(gameDescriptionInput, isValid);

  gameDescriptionError.textContent = isValid
    ? ""
    : "게임 소개는 10자 이상 입력해주세요.";

  return isValid;
}

function validateEmail() {
  const subscriberEmail = emailInput.value.trim();
  const isValid =
    subscriberEmail !== "" && emailInput.validity.valid;

  updateFieldState(emailInput, isValid);

  emailError.textContent = isValid
    ? ""
    : "올바른 이메일 주소를 입력해주세요.";

  return isValid;
}

function handleSubscribeNext() {
  const isNameValid = validateGameName();
  const isGenreValid = validateGameGenre();

  if (!isNameValid) {
    gameNameInput.focus();
    return;
  }

  if (!isGenreValid) {
    gameGenreInput.focus();
    return;
  }

  subscribeMessage.textContent = "";

  subscribeSteps[0].hidden = true;
  subscribeSteps[1].hidden = false;
}

subscribeNext.addEventListener("click", handleSubscribeNext);

function handleSubscribePrev() {
  subscribeSteps[1].hidden = true;
  subscribeSteps[0].hidden = false;
}

subscribePrev.addEventListener("click", handleSubscribePrev);

function updateDescriptionCount() {
  const currentLength = gameDescriptionInput.value.length;

  descriptionCount.textContent = `${currentLength} / 500자`;
}

gameDescriptionInput.addEventListener("input", updateDescriptionCount);

gameNameInput.addEventListener("input", validateGameName);
gameGenreInput.addEventListener("input", validateGameGenre);
gameDescriptionInput.addEventListener("input", validateGameDescription);
emailInput.addEventListener("input", validateEmail);

function handleSubscribeReview() {
  const isDescriptionValid = validateGameDescription();
  const isEmailValid = validateEmail();

  if (!isDescriptionValid) {
    gameDescriptionInput.focus();
    return;
  }

  if (!isEmailValid) {
    emailInput.focus();
    return;
  }

  reviewGameName.textContent = gameNameInput.value.trim();
  reviewGameGenre.textContent = gameGenreInput.value.trim();
  reviewGameDescription.textContent = gameDescriptionInput.value.trim();
  reviewEmail.textContent = emailInput.value.trim();

  subscribeSteps[1].hidden = true;
  subscribeSteps[2].hidden = false;
}

subscribeReview.addEventListener("click", handleSubscribeReview);

function handleSubscribeReviewPrev() {
  subscribeSteps[2].hidden = true;
  subscribeSteps[1].hidden = false;
}

subscribeReviewPrev.addEventListener(
  "click",
  handleSubscribeReviewPrev
);

function handleSubscribeConfirm(event) {
  event.preventDefault();

  if (isSubcribed) {
    return;
  }

  subscribeSteps[2].hidden = true;

  isSubcribed = true;
  submitCount += 1;

  subscribeMessage.textContent = "추천이 완료되었습니다.";
  subscribeMessage.classList.add("is-success");

  completionActions.hidden = false;
}

subscribeForm.addEventListener("submit", handleSubscribeConfirm);
completionView.addEventListener("click", handleViewMyRecommendation);
completionNew.addEventListener("click", handleNewRecommendation);

function handleViewMyRecommendation() {
  subscribeCompleteDialog.close();

  myGameName.textContent = gameNameInput.value.trim();
  myGameGenre.textContent = gameGenreInput.value.trim();
  myGameDescription.textContent =
    gameDescriptionInput.value.trim();
  myEmail.textContent = emailInput.value.trim();

  myRecommendationDialog.showModal();
}

viewMyRecommendation.addEventListener(
  "click",
  handleViewMyRecommendation
);

function handleCloseMyRecommendation() {
  myRecommendationDialog.close();
}

closeMyRecommendation.addEventListener(
  "click",
  handleCloseMyRecommendation
);

function handleNewRecommendation() {
  subscribeCompleteDialog.close();
  subscribeForm.reset();
  subscribeSteps.forEach(function (step) {
    step.hidden = true;
  });

  subscribeSteps[0].hidden = false;

  const inputs = subscribeForm.querySelectorAll("input, textarea");

  inputs.forEach(function (input) {
    input.classList.remove("is-valid", "is-invalid");
    input.removeAttribute("aria-invalid");
  });

  const errorMessages =
    subscribeForm.querySelectorAll(".error-message");

  errorMessages.forEach(function (message) {
    message.textContent = "";
  });

  updateDescriptionCount();

  isSubcribed = false;

  subscribeMessage.textContent =
    "게임 정보를 입력한 뒤 신청해주세요.";

  subscribeMessage.classList.remove("is-success");
}

newRecommendation.addEventListener("click", handleNewRecommendation);

subscribeForm.addEventListener("submit", function (event) {
  event.preventDefault();
});

updateDescriptionCount();

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
}

agreeChecks.forEach((checkbox) => {
  checkbox.addEventListener("change", handleAgreeChange);
});

function handleRecordsClick() {
  const agreed = Array.from(agreeChecks).some(
    (checkbox) => checkbox.checked
  );

  if (!agreed) {
    agreeMessage.textContent = "평가를 남겨주세요.";
    return;
  }

  agreeMessage.textContent = "의견 감사합니다.";
  agreeMessage.classList.add("is-ready");

  recordsButton.textContent = "기록 완료";
  recordsButton.classList.add("is-recorded");
  recordsButton.disabled = true;

  agreeChecks.forEach((checkbox) => {
    checkbox.disabled = true;
  });
}

recordsButton.addEventListener("click", handleRecordsClick);


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

const titleNext = document.querySelector("#title-next");
const reviewTitle= document.querySelector("#review-title");
const scoreLabel = document.querySelector("#score-label");
const finishButton = document.querySelector("#finish-button");
const titleError = document.querySelector("#title-error");
const steps = document.querySelectorAll(".step");
const recordingFlow = document.querySelector("#recording-flow");
const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");
const openRecording = document.querySelector("#open-recording");
const scoreboard = document.querySelectorAll('[name="scoreboard"]');
const scoreMessage = document.querySelector("#score-message");
const scoreNext = document.querySelector("#score-next");
const summaryScoreboard = document.querySelector("#summary-scoreboard");
const recommendDisagree = document.querySelector("#recommend-disagree");
const recommendAgree = document.querySelector("#recommend-agree");
const summaryReview = document.querySelector("#summary-review");
const summaryRecommend = document.querySelector("#summary-recommend");
const summaryPrev = document.querySelector("#summary-prev");

openRecording.addEventListener("click", function () {
  recordingDialog.showModal();
});

function handleConfirmClick() {
  recordingDialog.close();

  recordingFlow.hidden = false;
  steps[0].hidden = false;
}

recordingCancel.addEventListener("click", function () {
  recordingDialog.close();
});

recordingConfirm.addEventListener("click", handleConfirmClick);

function handleTitleClick() {
  const reviewText = reviewTitle.value.trim();

  if (reviewText === "") {
    titleError.textContent = "후기를 입력해주세요.";
    return;
  }

  titleError.textContent = "";

  steps[0].hidden = true;
  steps[1].hidden = false;
}

titleNext.addEventListener("click", handleTitleClick);

scoreboard.forEach((star)=> {
  star.addEventListener("change", handleScoreChange);
})

function handleScoreChange(event) {
  const star = event.currentTarget;

  const summaryScoreboard =
  document.querySelector("#summary-scoreboard");

  const selectedScore = Array.from(scoreboard)
  .find((star) => star.checked);

  summaryScoreboard.________ =
  selectedScore.value + "점";

  if (star.checked) {
    scoreMessage.textContent = star.value + "점을 선택하셨습니다!";
  }
}

function handleScoreNext() {
  const hasScore = Array.from(scoreboard).some((star)=>star.checked);
  
  if (!hasScore) {
    scoreMessage.textContent = "별점을 선택해주세요.";
    return;
  }

  steps[1].hidden = true;
  steps[2].hidden = false;
}

scoreNext.addEventListener("click", handleScoreNext);

function handleRecommendClick(event) {
  let recommendText = "";

  const clickedButton = event.currentTarget;

  if (clickedButton.id === "recommend-agree") {
    recommendText = "추천할래요";
  } else {
    recommendText = "비추천해요";
  }

  const selectedScore = Array.from(scoreboard).find((star) => star.checked);

  summaryReview.textContent = reviewTitle.value;
  summaryScoreboard.textContent = selectedScore.value + "점";
  summaryRecommend.textContent = recommendText;

  steps[2].hidden = true;
  steps[3].hidden = false;
}

recommendAgree.addEventListener("click", handleRecommendClick);
recommendDisagree.addEventListener("click", handleRecommendClick);

function handleSummaryPrev() {
  steps[3].hidden = true;
  steps[0].hidden = false;
}

function handleFinishClick() {
  alert("게임 평가 기록이 완료되었습니다!");
}

summaryPrev.addEventListener("click", handleSummaryPrev);
finishButton.addEventListener("click", handleFinishClick);

const favoriteButton = document.querySelector("#favorite-button");
const favoriteList = document.querySelector("#favorite-list");

let isFavorite = localStorage.getItem("favorite-sanabi") === "true";

function updateFavoriteButton() {
  if (isFavorite) {
    favoriteButton.setAttribute("aria-pressed", "true");
    favoriteButton.textContent = "♥ 즐겨찾기 완료"
  } else {
    favoriteButton.setAttribute("aria-pressed", "false");
    favoriteButton.textContent = "♡ 즐겨찾기 추가"
  }
  //목록의 기존 내용 비우기
  favoriteList.innerHTML = "";

  if (isFavorite) {
    //새로운 목록 항목을 만들기
    const gameItem = document.createElement("li");

    gameItem.textContent = "산나비";
    
    //만든 항목을 목록에 추가
    favoriteList.appendChild(gameItem);

  } else {
    const emptyMessage = document.createElement("li");

    emptyMessage.textContent = "즐겨찾기한 게임이 없습니다.";
    favoriteList.appendChild(emptyMessage);
  }
}

function handleFavoriteClick() {
  isFavorite = !isFavorite;

  localStorage.setItem("favorite-sanabi", isFavorite);

  updateFavoriteButton();
}

updateFavoriteButton();

favoriteButton.addEventListener("click", handleFavoriteClick);