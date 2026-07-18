document.addEventListener('DOMContentLoaded', function () {
    var stage = document.querySelector('.stage');
    var typewriterEl = document.getElementById('typewriter');
    var heroSub = document.getElementById('hero-sub');
    var startBtn = document.getElementById('start-btn');
    var categories = document.getElementById('categories');
    var replayBtn = document.getElementById('replay-intro-btn');

    if (!stage || !typewriterEl || !heroSub || !startBtn || !categories) {
        return;
    }

    var title = 'SKALA';
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function playTypewriter() {
        var index = 0;
        function typeNextLetter() {
            if (index <= title.length) {
                typewriterEl.textContent = title.slice(0, index);
                index++;
                setTimeout(typeNextLetter, 150);
            } else {
                heroSub.classList.add('visible');
                startBtn.classList.add('visible');
            }
        }

        if (reduceMotion) {
            typewriterEl.textContent = title;
            heroSub.classList.add('visible');
            startBtn.classList.add('visible');
        } else {
            setTimeout(typeNextLetter, 400);
        }
    }

    // 인트로를 다시 보여줄 때는 이전 재생 흔적(타이핑된 글자, 노출 상태)을 지우고 처음부터 다시 재생
    function showIntro() {
        typewriterEl.textContent = '';
        heroSub.classList.remove('visible');
        startBtn.classList.remove('visible');
        stage.classList.add('intro-active');
        playTypewriter();
    }

    // 히어로를 걷어내고 카테고리 화면을 확정 노출. 같은 세션에서는 재방문 시 인트로를 다시 틀지 않기 위해 기록해 둠
    function enterCategories() {
        stage.classList.remove('intro-active');
        categories.classList.add('revealed');
        sessionStorage.setItem('skalaIntroSeen', '1');
    }

    if (sessionStorage.getItem('skalaIntroSeen') === '1') {
        categories.classList.add('revealed');
    } else {
        showIntro();
    }

    startBtn.addEventListener('click', enterCategories);

    if (replayBtn) {
        replayBtn.addEventListener('click', showIntro);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var courses = document.querySelectorAll('.schedule-table .course');
    var headerCells = document.querySelectorAll('.schedule-table thead th[data-day]');

    if (!courses.length) {
        return;
    }

    var dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    function updateActiveClass() {
        var now = new Date();
        var todayKey = dayKeys[now.getDay()];
        var hour = now.getHours();

        courses.forEach(function (course) {
            var isToday = course.dataset.day === todayKey;
            var start = parseInt(course.dataset.start, 10);
            var end = parseInt(course.dataset.end, 10);
            var isNow = isToday && hour >= start && hour < end;
            course.classList.toggle('active-class', isNow);
        });

        headerCells.forEach(function (th) {
            th.classList.toggle('today-header', th.dataset.day === todayKey);
        });
    }

    updateActiveClass();
    setInterval(updateActiveClass, 60000);
});

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('signup-form');

    if (!form) {
        return;
    }

    var googleBtn = document.getElementById('google-btn');
    var googleNote = document.getElementById('google-note');

    if (googleBtn && googleNote) {
        googleBtn.addEventListener('click', function () {
            googleNote.textContent = 'Google 로그인은 준비 중입니다. 아래 양식으로 직접 가입해주세요.';
            googleNote.classList.add('form-note--active');
        });
    }

    var password = document.getElementById('password');
    var passwordConfirm = document.getElementById('password-confirm');
    var passwordConfirmError = document.getElementById('password-confirm-error');

    function checkPasswordMatch() {
        if (!password || !passwordConfirm || !passwordConfirmError) {
            return true;
        }

        var matches = password.value === passwordConfirm.value;
        passwordConfirmError.hidden = matches;
        passwordConfirm.setCustomValidity(matches ? '' : '비밀번호가 일치하지 않습니다.');
        return matches;
    }

    if (password && passwordConfirm) {
        password.addEventListener('input', checkPasswordMatch);
        passwordConfirm.addEventListener('input', checkPasswordMatch);
    }

    form.querySelectorAll('.password-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var target = document.getElementById(btn.dataset.target);
            if (!target) {
                return;
            }
            var willShow = target.type === 'password';
            target.type = willShow ? 'text' : 'password';
            btn.textContent = willShow ? '숨기기' : '표시';
            btn.setAttribute('aria-label', willShow ? '비밀번호 숨기기' : '비밀번호 표시');
        });
    });

    var resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function (event) {
            if (!window.confirm('입력한 내용이 모두 지워집니다. 계속할까요?')) {
                event.preventDefault();
            }
        });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!checkPasswordMatch()) {
            passwordConfirm.reportValidity();
            return;
        }

        var formData = new FormData(form);
        var interests = formData.getAll('interest');
        var data = {
            userid: formData.get('userid') || '',
            email: (formData.get('email-id') || '') + '@' + (formData.get('email-domain') || ''),
            phone: formData.get('phone') || '',
            name: formData.get('name') || '',
            birthdate: formData.get('birthdate') || '',
            gender: formData.get('gender') || '',
            interests: interests,
            referral: formData.get('referral') || '',
            intro: formData.get('intro') || ''
        };

        sessionStorage.setItem('skalaSignUpData', JSON.stringify(data));
        window.location.href = 'signUpResult.html';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var resultContent = document.getElementById('result-content');

    if (!resultContent) {
        return;
    }

    var resultEmpty = document.getElementById('result-empty');
    var raw = sessionStorage.getItem('skalaSignUpData');
    var data = null;

    try {
        data = raw ? JSON.parse(raw) : null;
    } catch (e) {
        data = null;
    }

    if (!data) {
        resultContent.hidden = true;
        resultEmpty.hidden = false;
        return;
    }

    var genderLabels = { male: '남성', female: '여성', none: '선택안함' };
    var interestLabels = {
        frontend: '웹 프론트엔드 (Vue.js/HTML)',
        uiux: 'UI/UX 디자인 표준',
        backend: '백엔드 & 데이터베이스',
        cloud: '클라우드 & 인프라'
    };
    var referralLabels = { search: '검색', friend: '지인 추천', sns: 'SNS', etc: '기타' };

    function fill(id, value) {
        var el = document.getElementById(id);
        if (!el) {
            return;
        }
        var row = el.closest('.result-row');
        var hasValue = value && String(value).trim();
        if (hasValue) {
            el.textContent = value;
            if (row) {
                row.hidden = false;
            }
        } else if (row) {
            row.hidden = true;
        }
    }

    fill('r-userid', data.userid);
    fill('r-email', data.email && data.email !== '@' ? data.email : '');
    fill('r-phone', data.phone);
    fill('r-name', data.name);
    fill('r-birthdate', data.birthdate);
    fill('r-gender', genderLabels[data.gender] || '');
    fill('r-interests', (data.interests || []).map(function (v) { return interestLabels[v] || v; }).join(', '));
    fill('r-referral', referralLabels[data.referral] || '');
    fill('r-intro', data.intro);
});

document.addEventListener('DOMContentLoaded', function () {
    var videoSection = document.querySelector('.trip-video-section');
    var video = videoSection ? videoSection.querySelector('.trip-video') : null;

    if (!videoSection || !video) {
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.6 });

    observer.observe(videoSection);
});

document.addEventListener('DOMContentLoaded', function () {
    var scrollContainer = document.querySelector('.profile-scroll');
    var dotNav = document.querySelector('.section-dots');

    if (!scrollContainer || !dotNav) {
        return;
    }

    var sections = scrollContainer.querySelectorAll('.profile-section[id]');
    var dots = dotNav.querySelectorAll('a');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
                return;
            }
            var id = entry.target.id;
            dots.forEach(function (dot) {
                dot.classList.toggle('active', dot.getAttribute('href') === '#' + id);
            });
        });
    }, { root: scrollContainer, threshold: 0.6 });

    sections.forEach(function (section) {
        observer.observe(section);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');

    if (!navToggle || !navLinks) {
        return;
    }

    navToggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
});
