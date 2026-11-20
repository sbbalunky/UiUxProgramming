let isSubcribed = false;
let submitCount = 0;
let currentFilter = "all";

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
const savedRecommendations = localStorage.getItem("recommendations");
const descriptionChoices = document.querySelectorAll('input[name="descriptionChoice"]');
const gameDescriptionField = document.querySelector("#game-description-field");

let recommendations = savedRecommendations
  ? JSON.parse(savedRecommendations)
  : [];

const migrationId = Date.now();

recommendations = recommendations.map(function (recommendation, index) {
  return {
    ...recommendation,
    id: recommendation.id ?? migrationId + index
  };
});

localStorage.setItem(
  "recommendations",
  JSON.stringify(recommendations)
);

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

function updateDescriptionChoice() {
  const selectedChoice = Array.from(descriptionChoices).find(
    function (choice) {
      return choice.checked;
    }
  );

  const wantsDescription = selectedChoice && selectedChoice.value === "yes";

  gameDescriptionField.hidden = !wantsDescription;

  gameDescriptionInput.disabled = !wantsDescription;
  gameDescriptionInput.required = wantsDescription;

  if (!wantsDescription) {
    gameDescriptionInput.value = "";

    gameDescriptionInput.classList.remove(
      "is-valid",
      "is-invalid"
    );

    gameDescriptionInput.removeAttribute("aria-invalid");
    gameDescriptionError.textContent = "";
  }

  updateDescriptionCount();
}

descriptionChoices.forEach(function (choice) {
  choice.addEventListener("change", updateDescriptionChoice);
});

updateDescriptionChoice();

function validateGameDescription() {
  if (gameDescriptionInput.disabled) {
    return true;
  }

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

  subscribeSteps[1].querySelector("h3").focus();
}

subscribeNext.addEventListener("click", handleSubscribeNext);

function handleSubscribePrev() {
  subscribeSteps[1].hidden = true;
  subscribeSteps[0].hidden = false;
  subscribeSteps[0].querySelector("h3").focus();
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
  reviewGameDescription.textContent = gameDescriptionInput.disabled ? "추가 설명 없음" : gameDescriptionInput.value.trim();
  reviewEmail.textContent = emailInput.value.trim();

  subscribeSteps[1].hidden = true;
  subscribeSteps[2].hidden = false;

  subscribeSteps[2].querySelector("h3").focus();
}

subscribeReview.addEventListener("click", handleSubscribeReview);

function handleSubscribeReviewPrev() {
  subscribeSteps[2].hidden = true;
  subscribeSteps[1].hidden = false;

  subscribeSteps[1].querySelector("h3").focus();
}

subscribeReviewPrev.addEventListener(
  "click",
  handleSubscribeReviewPrev
);


async function handleSubscribeConfirm(event) {
  event.preventDefault();

  if (isSubcribed) {
    return;
  }

  if (subscribeConfirm.disabled) {
    return;
  }

  subscribeConfirm.disabled = true;
  subscribeConfirm.textContent = "추천 중...";

  subscribeMessage.textContent = "게임 추천을 요청하고 있습니다.";
  subscribeMessage.classList.remove("is-success");

  try {
    subscribeMessage.classList.remove("is-error");

    await new Promise(function (resolve) {
      setTimeout(resolve, 1000);
    });

    const recommendation = {
      id: Date.now(),
      name: gameNameInput.value.trim(),
      genre: gameGenreInput.value.trim(),
      description: gameDescriptionInput.disabled
        ? ""
        : gameDescriptionInput.value.trim(),
      email: emailInput.value.trim(),
      status: "pending"
    };

    recommendations.push(recommendation);

    localStorage.setItem(
      "recommendations",
      JSON.stringify(recommendations)
    );

    renderRecommendations(recommendations);

    isSubcribed = true;
    submitCount += 1;

    subscribeSteps[2].hidden = true;

    subscribeMessage.textContent = "추천이 완료되었습니다.";
    subscribeMessage.classList.add("is-success");

    completionActions.hidden = false;

    subscribeCompleteDialog.showModal();

  } catch (error) {
    subscribeMessage.textContent =
      "추천 요청에 실패했습니다. 다시 시도해주세요.";

    subscribeMessage.classList.remove("is-success");

    subscribeSteps[2].hidden = false;

    subscribeMessage.classList.add("is-error");

  } finally {
    if (!isSubcribed) {
      subscribeConfirm.disabled = false;
      subscribeConfirm.textContent = "추천하기";
    }
  }
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
  subscribeConfirm.disabled = false;
  subscribeConfirm.textContent = "추천하기";

  updateDescriptionChoice();

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

updateDescriptionCount();

const recommendationList = document.querySelector("#recommendation-list");
const recommendationCount = document.querySelector("#recommendation-count");
const recommendationEmpty = document.querySelector("#recommendation-empty");
const filterButtons = document.querySelectorAll(".filter-button");

function createRecommendationCard(recommendation) {
  const card = document.createElement("div");
  card.classList.add("recommendation-card");

  // 카드 상단 영역
  const header = document.createElement("div");
  header.classList.add("recommendation-card-header");

  // 게임 이름
  const title = document.createElement("h3");
  title.classList.add("recommendation-card-title");
  title.textContent = recommendation.name;

  // 신청 상태
  const status = document.createElement("span");
  status.classList.add("recommendation-status");

  if (recommendation.status === "completed") {
    status.textContent = "작성 완료";
    status.classList.add("is-completed");
  } else {
    status.textContent = "검토 중";
    status.classList.add("is-pending");
  }

  header.appendChild(title);
  header.appendChild(status);

  // 게임 장르
  const genre = document.createElement("p");
  genre.classList.add("recommendation-genre");
  genre.textContent = `장르: ${recommendation.genre}`;

  // 게임 소개
  const description = document.createElement("p");
  description.classList.add("recommendation-description");
  description.textContent = recommendation.description;

  // 삭제 버튼
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("recommendation-delete");
  deleteButton.textContent = "삭제";

  deleteButton.addEventListener("click", function () {
    handleDeleteRecommendation(recommendation.id);
  });

  card.appendChild(header);
  card.appendChild(genre);
  card.appendChild(description);
  card.appendChild(deleteButton);

  return card;
}


const deleteRecommendationDialog = document.querySelector(
  "#delete-recommendation-dialog"
);

const deleteCancel = document.querySelector("#delete-cancel");
const deleteConfirm = document.querySelector("#delete-confirm");

let selectedRecommendationId = null;

function handleDeleteRecommendation(id) {
  selectedRecommendationId = id;

  deleteRecommendationDialog.showModal();
}

deleteCancel.addEventListener("click", function () {
  deleteRecommendationDialog.returnValue = "cancel";
  deleteRecommendationDialog.close();
});

deleteConfirm.addEventListener("click", function () {
  deleteRecommendationDialog.returnValue = "confirm";
  deleteRecommendationDialog.close();
});

deleteRecommendationDialog.addEventListener("close", function () {
  if (deleteRecommendationDialog.returnValue === "confirm") {
    recommendations = recommendations.filter(function (recommendation) {
      return recommendation.id !== selectedRecommendationId;
    });

    localStorage.setItem(
      "recommendations",
      JSON.stringify(recommendations)
    );

    renderRecommendations(recommendations);
  }

  selectedRecommendationId = null;
});

function renderRecommendations(list) {
  recommendationList.innerHTML = "";

  recommendationCount.textContent =
    `총 ${list.length}개의 추천 게임`;

  if (list.length === 0) {
    recommendationEmpty.hidden = false;
    recommendationList.appendChild(recommendationEmpty);
    return;
  }

  recommendationEmpty.hidden = true;

  list.forEach(function (recommendation) {
    const card = createRecommendationCard(recommendation);
    recommendationList.appendChild(card);
  });
}

function filterRecommendations() {
  let filteredRecommendations = recommendations;

  if (currentFilter === "completed") {
    filteredRecommendations = recommendations.filter(function (recommendation) {
      return recommendation.status === "completed";
    });
  }

  if (currentFilter === "pending") {
    filteredRecommendations = recommendations.filter(function (recommendation) {
      return recommendation.status === "pending";
    });
  }

  renderRecommendations(filteredRecommendations);
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (filterButton) {
      filterButton.classList.remove("is-active");
    });

    button.classList.add("is-active");

    filterRecommendations();
  });
});

filterRecommendations();

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

function activateTab(selectedTab) {
  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;

    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", isSelected);
    tab.tabIndex = isSelected ? 0 : -1;

    const panelId = tab.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);

    if (panel) {
      panel.hidden = !isSelected;
    }
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("keydown", (event) => {
    const currentIndex = Array.from(tabs).indexOf(tab);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    const nextTab = tabs[nextIndex];

    activateTab(nextTab);
    nextTab.focus();
  });
});

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
const recordingComplete = document.querySelector("#recording-complete");
const restartButton = document.querySelector("#restart-button");

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

  summaryScoreboard.textContent =
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
  steps[3].hidden = true;
  recordingComplete.hidden = false;
}

summaryPrev.addEventListener("click", handleSummaryPrev);
finishButton.addEventListener("click", handleFinishClick);

function handleRestartClick() {

  reviewTitle.value = "";

  scoreboard.forEach((star) => {
    star.checked = false;
  });

  titleError.textContent = "";
  scoreMessage.textContent = "별점을 선택해주세요.";

  summaryReview.textContent = "";
  summaryScoreboard.textContent = "";
  summaryRecommend.textContent = "";

  steps.forEach((step) => {
    step.hidden = true;
  });

  steps[0].hidden = false;

  recordingFlow.hidden = false;
}

restartButton.addEventListener("click", handleRestartClick);

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

  favoriteList.innerHTML = "";

  if (isFavorite) {

    const gameItem = document.createElement("li");

    gameItem.textContent = "산나비";
    
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

const headerBar = document.querySelector(".header-bar");
const navLinks = document.querySelectorAll(".nav-link");

const sections = [
  document.querySelector("#about"),
  document.querySelector("#features"),
  document.querySelector("#subscribe")
];

function setActiveMenu(sectionId) {
  navLinks.forEach(function (link) {
    const isActive = link.getAttribute("href") === `#${sectionId}`;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    const sectionId = link.getAttribute("href").substring(1);
    setActiveMenu(sectionId);
  });
});

const headerHeight = headerBar.offsetHeight;

sections.forEach(function (section) {
  section.style.scrollMarginTop = `${headerHeight + 16}px`;
});

const observer = new IntersectionObserver(
  function (entries) {
    const visibleSections = entries
      .filter(function (entry) {
        return entry.isIntersecting;
      })
      .sort(function (a, b) {
        return a.boundingClientRect.top - b.boundingClientRect.top;
      });

    if (visibleSections.length > 0) {
      setActiveMenu(visibleSections[0].target.id);
    }
  },
  {
    rootMargin: `-${headerHeight}px 0px -60% 0px`,
    threshold: 0
  }
);

sections.forEach(function (section) {
  if (section) {
    observer.observe(section);
  }
});

const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

menuToggle.addEventListener("click", function () {
  const isOpen = mainNav.classList.toggle("is-open");

  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "메뉴 닫기" : "메뉴 열기"
  );
});

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    mainNav.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "메뉴 열기");
  });
});

const accordionQuestions = document.querySelectorAll(".accordion-question");

const accordionAnswers = document.querySelectorAll(".accordion-answer");

accordionQuestions.forEach(function(question) {
  question.addEventListener("click", function() {

    const accordionAnswer = question.nextElementSibling;

    const isOpen = accordionAnswer.classList.contains("is-open");

    accordionAnswers.forEach(function(answer) {
      answer.classList.remove("is-open");
    });

    accordionQuestions.forEach(function(button) {
      button.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      accordionAnswer.classList.add("is-open");
      question.setAttribute("aria-expanded", "true");
    }

  });
});