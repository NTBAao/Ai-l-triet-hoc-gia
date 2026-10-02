/**
 * AI LÀ TRIẾT HỌC GIA - MAIN GAME ENGINE
 * TV Gameshow: Who Wants to Be a Millionaire Style (30 Levels & 150 Question Bank)
 */

const LADDER_CONFIG = [
    { level: 1, prize: "500.000 điểm", val: 500000, milestone: false, title: "Tập sự Triết học" },
    { level: 2, prize: "1.000.000 điểm", val: 1000000, milestone: false, title: "Tập sự Triết học" },
    { level: 3, prize: "1.500.000 điểm", val: 1500000, milestone: false, title: "Sinh viên Nhập môn" },
    { level: 4, prize: "2.500.000 điểm", val: 2500000, milestone: false, title: "Sinh viên Nhập môn" },
    { level: 5, prize: "5.000.000 điểm", val: 5000000, milestone: true, title: "Tân Cử nhân Triết học" },
    { level: 6, prize: "7.500.000 điểm", val: 7500000, milestone: false, title: "Cử nhân Triết học" },
    { level: 7, prize: "10.000.000 điểm", val: 10000000, milestone: false, title: "Cử nhân Triết học" },
    { level: 8, prize: "13.000.000 điểm", val: 13000000, milestone: false, title: "Học viên Cao học" },
    { level: 9, prize: "17.000.000 điểm", val: 17000000, milestone: false, title: "Học viên Cao học" },
    { level: 10, prize: "22.000.000 điểm", val: 22000000, milestone: true, title: "Thạc sĩ Triết học Mác-xít" },
    { level: 11, prize: "28.000.000 điểm", val: 28000000, milestone: false, title: "Nghiên cứu sinh Triết học" },
    { level: 12, prize: "35.000.000 điểm", val: 35000000, milestone: false, title: "Nghiên cứu sinh Triết học" },
    { level: 13, prize: "42.000.000 điểm", val: 42000000, milestone: false, title: "Giảng viên Triết học" },
    { level: 14, prize: "50.000.000 điểm", val: 50000000, milestone: false, title: "Giảng viên Triết học" },
    { level: 15, prize: "60.000.000 điểm", val: 60000000, milestone: true, title: "Tiến sĩ Triết học Duy vật" },
    { level: 16, prize: "75.000.000 điểm", val: 75000000, milestone: false, title: "Tiến sĩ Ưu tú" },
    { level: 17, prize: "90.000.000 điểm", val: 90000000, milestone: false, title: "Tiến sĩ Ưu tú" },
    { level: 18, prize: "110.000.000 điểm", val: 110000000, milestone: false, title: "Chuyên gia Lý luận" },
    { level: 19, prize: "130.000.000 điểm", val: 130000000, milestone: false, title: "Chuyên gia Lý luận" },
    { level: 20, prize: "150.000.000 điểm", val: 150000000, milestone: true, title: "Phó Giáo sư Triết học" },
    { level: 21, prize: "180.000.000 điểm", val: 180000000, milestone: false, title: "Nhà Khảo cứu Biện chứng" },
    { level: 22, prize: "220.000.000 điểm", val: 220000000, milestone: false, title: "Nhà Khảo cứu Biện chứng" },
    { level: 23, prize: "270.000.000 điểm", val: 270000000, milestone: false, title: "Nhà Tư tưởng Tiên phong" },
    { level: 24, prize: "330.000.000 điểm", val: 330000000, milestone: false, title: "Nhà Tư tưởng Tiên phong" },
    { level: 25, prize: "400.000.000 điểm", val: 400000000, milestone: true, title: "Giáo sư - Viện sĩ Triết học" },
    { level: 26, prize: "500.000.000 điểm", val: 500000000, milestone: false, title: "Đại học giả Kinh điển" },
    { level: 27, prize: "620.000.000 điểm", val: 620000000, milestone: false, title: "Đại học giả Kinh điển" },
    { level: 28, prize: "750.000.000 điểm", val: 750000000, milestone: false, title: "Bậc thầy Duy vật Lịch sử" },
    { level: 29, prize: "880.000.000 điểm", val: 880000000, milestone: false, title: "Bậc thầy Duy vật Lịch sử" },
    { level: 30, prize: "1.000.000.000 điểm", val: 1000000000, milestone: true, final: true, title: "ĐẠI TRIẾT GIA MÁC-XÍT NHÂN LOẠI" }
];

const GameApp = {
    // State
    playerName: "Nhà Triết học Trẻ",
    currentLevel: 1,
    questions: [],
    currentQuestion: null,
    answeredQuestions: [],
    
    // Timer
    timerSeconds: 45,
    timerInterval: null,
    isAnsweringLocked: false,

    // Lifelines used in current game
    lifelines: {
        fifty: false,
        audience: false,
        phone: false,
        switch: false
    },
    activeOptions: [0, 1, 2, 3],

    // All bank questions cache for study mode
    allBankQuestions: [],

    init() {
        this.renderLadder();
        this.bindEvents();
        this.loadBankQuestions();
    },

    bindEvents() {
        // Sound toggle
        const btnSound = document.getElementById('btnSoundToggle');
        btnSound.addEventListener('click', () => {
            const isEnabled = AudioSys.toggle();
            const icon = document.getElementById('soundIcon');
            icon.className = isEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        });

        // Start game button
        document.getElementById('btnStartGame').addEventListener('click', () => {
            const input = document.getElementById('playerNameInput');
            this.playerName = input.value.trim() || "Nhà Triết học Trẻ";
            document.getElementById('sidebarPlayerName').innerText = this.playerName;
            AudioSys.playClick();
            this.startNewGame();
        });

        // Answer option buttons
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`optBtn${i}`);
            btn.addEventListener('click', () => this.handleOptionClick(i));
        }

        // Next Question button
        document.getElementById('btnNextQuestion').addEventListener('click', () => {
            AudioSys.playClick();
            this.nextStep();
        });

        // Walk away button
        document.getElementById('btnWalkAway').addEventListener('click', () => {
            if (confirm("Bạn có chắc chắn muốn dừng cuộc chơi tại bậc thang này để bảo toàn số điểm thưởng và danh hiệu hiện tại?")) {
                this.handleWalkAway();
            }
        });

        // Lifelines
        document.getElementById('llFifty').addEventListener('click', () => this.useLifelineFifty());
        document.getElementById('llAudience').addEventListener('click', () => this.useLifelineAudience());
        document.getElementById('llPhone').addEventListener('click', () => this.useLifelinePhone());
        document.getElementById('llSwitch').addEventListener('click', () => this.useLifelineSwitch());

        // Navigation Modals
        document.getElementById('btnStudyMode').addEventListener('click', () => {
            AudioSys.playClick();
            this.openStudyModal();
        });

        document.getElementById('btnLeaderboard').addEventListener('click', () => {
            AudioSys.playClick();
            this.openLeaderboardModal();
        });

        // Open Ladder Modal on Mobile or button click
        const openLadder = (e) => {
            if (e) e.stopPropagation();
            AudioSys.playClick();
            this.openLadderModal();
        };

        ['btnToggleLadder', 'btnArenaLadder'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', openLadder);
        });

        // Result screen buttons
        document.getElementById('btnPlayAgain').addEventListener('click', () => {
            AudioSys.playClick();
            this.showScreen('screenWelcome');
        });

        document.getElementById('btnReviewAllGame').addEventListener('click', () => {
            AudioSys.playClick();
            this.openReviewModal();
        });

        document.getElementById('btnResultLeaderboard').addEventListener('click', () => {
            AudioSys.playClick();
            this.openLeaderboardModal();
        });

        // Study filters
        document.getElementById('studySearchInput').addEventListener('input', () => this.filterStudyQuestions());
        document.getElementById('studyCategorySelect').addEventListener('change', () => this.filterStudyQuestions());
    },

    renderLadder() {
        const containers = [
            document.getElementById('ladderList'),
            document.getElementById('modalLadderList')
        ];
        
        containers.forEach(container => {
            if (!container) return;
            container.innerHTML = '';
            for (let i = LADDER_CONFIG.length - 1; i >= 0; i--) {
                const item = LADDER_CONFIG[i];
                const div = document.createElement('div');
                div.className = `ladder-item ${item.milestone ? (item.final ? 'milestone-final' : 'milestone') : ''}`;
                div.id = `${container.id === 'modalLadderList' ? 'modalLadderItem' : 'ladderItem'}${item.level}`;
                div.innerHTML = `
                    <span class="level-num">${item.level}</span>
                    <span class="level-title-tag">${item.title}</span>
                    <span class="level-prize">${item.prize}</span>
                `;
                container.appendChild(div);
            }
        });
    },

    openLadderModal() {
        document.getElementById('modalLadderPlayerName').innerText = this.playerName;
        document.getElementById('modalLadderCurrentLvl').innerText = `Bậc ${this.currentLevel}`;
        this.updateLadderUI();
        this.openModal('modalLadder');
        
        // Auto scroll to current level in modal
        setTimeout(() => {
            const cur = document.getElementById(`modalLadderItem${this.currentLevel}`);
            if (cur) cur.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    },

        async startNewGame() {
        try {
            this.currentLevel = 1;
            this.answeredQuestions = [];
            this.lifelines = { fifty: false, audience: false, phone: false, switch: false };
            this.activeOptions = [0, 1, 2, 3];
            this.isAnsweringLocked = false;

            // Reset lifeline UI buttons
            ['llFifty', 'llAudience', 'llPhone', 'llSwitch'].forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.disabled = false;
            });

            // Fast random pick from bank cache if available
            if (this.allBankQuestions && this.allBankQuestions.length >= 30) {
                const easy = this.allBankQuestions.filter(q => q.difficulty === 1);
                const med  = this.allBankQuestions.filter(q => q.difficulty === 2);
                const hard = this.allBankQuestions.filter(q => q.difficulty === 3);
                const pickEasy = [...easy].sort(() => 0.5 - Math.random()).slice(0, 10);
                const pickMed  = [...med].sort(() => 0.5 - Math.random()).slice(0, 10);
                const pickHard = [...hard].sort(() => 0.5 - Math.random()).slice(0, 10);
                this.questions = [...pickEasy, ...pickMed, ...pickHard];
                if (this.questions.length < 30) {
                    const rem = this.allBankQuestions.filter(q => !this.questions.some(r => r.id === q.id));
                    this.questions = this.questions.concat(rem.slice(0, 30 - this.questions.length));
                }
            } else {
                this.questions = await GameAPI.getRandomQuestions();
            }

            if (!this.questions || this.questions.length === 0) {
                this.questions = await GameAPI.getRandomQuestions();
            }

            try { AudioSys.playStart(); } catch(e) {}
            this.showScreen('screenGame');
            this.loadQuestionForCurrentLevel();
        } catch(err) {
            console.error('Error starting new game:', err);
            this.showScreen('screenGame');
        }
    },

    loadQuestionForCurrentLevel() {
        this.currentQuestion = this.questions[this.currentLevel - 1];
        this.activeOptions = [0, 1, 2, 3];
        this.isAnsweringLocked = false;

        // Hide explanation panel
        document.getElementById('postAnswerPanel').style.display = 'none';

        // Update Meta
        document.getElementById('currentQNumBadge').innerText = `Câu hỏi ${this.currentLevel} / 30`;
        document.getElementById('currentQCategory').innerText = this.currentQuestion.category || "Triết học Mác - Lênin";
        const cfg = LADDER_CONFIG[this.currentLevel - 1];
        document.getElementById('currentQValue').innerText = cfg.prize;

        // Update Question text
        document.getElementById('questionText').innerText = this.currentQuestion.question;

        // Update 4 options
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`optBtn${i}`);
            const textSpan = document.getElementById(`optText${i}`);
            btn.className = 'answer-box';
            btn.disabled = false;
            textSpan.innerText = this.currentQuestion.options[i];
        }

        // Update Ladder active step
        this.updateLadderUI();

        // Start Timer
        this.startTimer();
        AudioSys.playSuspense();
    },

    updateLadderUI() {
        const prefixes = ['ladderItem', 'modalLadderItem'];
        prefixes.forEach(prefix => {
            for (let i = 1; i <= 30; i++) {
                const item = document.getElementById(`${prefix}${i}`);
                if (!item) continue;
                item.classList.remove('current', 'passed');
                if (i === this.currentLevel) {
                    item.classList.add('current');
                } else if (i < this.currentLevel) {
                    item.classList.add('passed');
                }
            }
        });

        // Scroll desktop ladder to view
        const activeItem = document.getElementById(`ladderItem${this.currentLevel}`);
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    startTimer() {
        this.stopTimer();
        this.timerSeconds = 45;
        this.updateTimerUI();

        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            this.updateTimerUI();

            if (this.timerSeconds <= 10 && this.timerSeconds > 0) {
                AudioSys.playTick();
            }

            if (this.timerSeconds <= 0) {
                this.stopTimer();
                this.handleTimeout();
            }
        }, 1000);
    },

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    updateTimerUI() {
        const text = document.getElementById('timerCount');
        const circle = document.getElementById('timerCircleProgress');
        const wrapper = document.querySelector('.timer-wrapper');

        text.innerText = this.timerSeconds;
        // Total dasharray = 264
        const offset = 264 - (264 * this.timerSeconds) / 45;
        circle.style.strokeDashoffset = offset;

        if (this.timerSeconds <= 10) {
            wrapper.classList.add('danger');
        } else {
            wrapper.classList.remove('danger');
        }
    },

    handleOptionClick(selectedIndex) {
        if (this.isAnsweringLocked) return;
        this.isAnsweringLocked = true;
        this.stopTimer();
        AudioSys.stopSuspense();

        const selectedBtn = document.getElementById(`optBtn${selectedIndex}`);
        selectedBtn.classList.add('selected');
        AudioSys.playLockIn();

        const isCorrect = (selectedIndex === this.currentQuestion.correct);

        // Record history
        this.answeredQuestions.push({
            level: this.currentLevel,
            question: this.currentQuestion,
            userChoice: selectedIndex,
            isCorrect: isCorrect
        });

        // Delay reveal
        setTimeout(() => {
            this.revealAnswer(selectedIndex, isCorrect);
        }, 1500);
    },

    revealAnswer(selectedIndex, isCorrect) {
        const correctIndex = this.currentQuestion.correct;
        const selectedBtn = document.getElementById(`optBtn${selectedIndex}`);
        const correctBtn = document.getElementById(`optBtn${correctIndex}`);

        selectedBtn.classList.remove('selected');

        if (isCorrect) {
            correctBtn.classList.add('correct');
            AudioSys.playCorrect();
            this.showExplanation(true);
        } else {
            selectedBtn.classList.add('wrong');
            correctBtn.classList.add('correct');
            AudioSys.playWrong();
            this.showExplanation(false);

            setTimeout(() => {
                this.handleGameOver(false);
            }, 2500);
        }
    },

    showExplanation(isCorrect) {
        const panel = document.getElementById('postAnswerPanel');
        const expText = document.getElementById('explanationText');
        expText.innerText = this.currentQuestion.explanation || "Chính xác theo Giáo trình Triết học Mác - Lênin MLN111.";
        panel.style.display = 'flex';
    },

    nextStep() {
        if (this.currentLevel === 30) {
            this.handleVictory();
        } else {
            this.currentLevel++;
            this.loadQuestionForCurrentLevel();
        }
    },

    handleTimeout() {
        if (this.isAnsweringLocked) return;
        this.isAnsweringLocked = true;
        AudioSys.stopSuspense();
        AudioSys.playWrong();

        alert("HẾT THỜI GIAN 45 GIÂY! Bạn đã không kịp đưa ra câu trả lời.");
        const correctBtn = document.getElementById(`optBtn${this.currentQuestion.correct}`);
        correctBtn.classList.add('correct');

        setTimeout(() => {
            this.handleGameOver(false);
        }, 2000);
    },

    handleWalkAway() {
        this.stopTimer();
        AudioSys.stopSuspense();
        this.handleGameOver(true);
    },

    handleGameOver(isVoluntaryWalkAway) {
        this.stopTimer();
        AudioSys.stopSuspense();

        // Calculate final secured prize and title
        let securedVal = 0;
        let securedPrize = "0 điểm";
        let securedTitle = "Người tham gia Thử thách";

        if (isVoluntaryWalkAway) {
            // Take current level's secured prize
            const cur = LADDER_CONFIG[this.currentLevel - 1];
            securedVal = cur.val;
            securedPrize = cur.prize;
            securedTitle = cur.title;
        } else {
            // Failed: fallback to highest milestone reached
            let lastMilestone = null;
            for (let i = this.currentLevel - 2; i >= 0; i--) {
                if (LADDER_CONFIG[i].milestone) {
                    lastMilestone = LADDER_CONFIG[i];
                    break;
                }
            }
            if (lastMilestone) {
                securedVal = lastMilestone.val;
                securedPrize = lastMilestone.prize;
                securedTitle = lastMilestone.title;
            }
        }

        const score = this.answeredQuestions.filter(q => q.isCorrect).length;

        // Save to leaderboard
        GameAPI.saveScore({
            playerName: this.playerName,
            score: securedVal,
            levelReached: this.currentLevel,
            title: securedTitle
        });

        // Setup Result Screen
        document.getElementById('resultTitle').innerText = isVoluntaryWalkAway 
            ? "BẢO TOÀN THÀNH TỰU THÀNH CÔNG!" 
            : "CUỘC THỬ THÁCH TRIẾT HỌC DỪNG LẠI!";
        document.getElementById('resultSubtitle').innerText = isVoluntaryWalkAway
            ? `Bạn đã dừng cuộc chơi sáng suốt tại bậc ${this.currentLevel}`
            : `Rất tiếc! Bạn đã dừng bước tại bậc thang số ${this.currentLevel}`;

        document.getElementById('resTitleVal').innerText = securedTitle;
        document.getElementById('resPrizeVal').innerText = securedPrize;
        document.getElementById('resScoreVal').innerText = `${score} / 30 Câu`;

        this.showScreen('screenResult');
    },

    handleVictory() {
        this.stopTimer();
        AudioSys.stopSuspense();
        AudioSys.playVictory();

        const maxConfig = LADDER_CONFIG[29]; // Level 30
        GameAPI.saveScore({
            playerName: this.playerName,
            score: maxConfig.val,
            levelReached: 30,
            title: maxConfig.title
        });

        document.getElementById('resultTitle').innerText = "VINH QUANG ĐỈNH CAO! BẠN ĐÃ TRỞ THÀNH ĐẠI TRIẾT GIA!";
        document.getElementById('resultSubtitle').innerText = "Tuyệt vời! Bạn đã chinh phục trọn vẹn 30 câu hỏi đỉnh cao về Triết học Mác - Lênin!";
        document.getElementById('resTitleVal').innerText = maxConfig.title;
        document.getElementById('resPrizeVal').innerText = maxConfig.prize;
        document.getElementById('resScoreVal').innerText = "30 / 30 Câu";

        this.showScreen('screenResult');
    },

    // ==================== LIFELINES ====================
    useLifelineFifty() {
        if (this.lifelines.fifty || this.isAnsweringLocked) return;
        this.lifelines.fifty = true;
        document.getElementById('llFifty').disabled = true;
        AudioSys.playLifeline();

        const correct = this.currentQuestion.correct;
        const incorrectIndices = [0, 1, 2, 3].filter(i => i !== correct);
        
        // Pick 2 random incorrect to eliminate
        const shuffled = incorrectIndices.sort(() => 0.5 - Math.random());
        const toEliminate = shuffled.slice(0, 2);

        toEliminate.forEach(idx => {
            const btn = document.getElementById(`optBtn${idx}`);
            btn.classList.add('eliminated');
            btn.disabled = true;
        });

        this.activeOptions = [0, 1, 2, 3].filter(i => !toEliminate.includes(i));
    },

    async useLifelineAudience() {
        if (this.lifelines.audience || this.isAnsweringLocked) return;
        this.lifelines.audience = true;
        document.getElementById('llAudience').disabled = true;
        AudioSys.playLifeline();

        const res = await GameAPI.getAudienceVotes(
            this.currentQuestion.id,
            this.currentQuestion.correct,
            this.currentQuestion.difficulty || 1,
            this.activeOptions
        );

        const votes = res.votes || [25, 25, 25, 25];
        ['A', 'B', 'C', 'D'].forEach((char, idx) => {
            document.getElementById(`pollVal${char}`).innerText = `${votes[idx]}%`;
            document.getElementById(`pollFill${char}`).style.height = `${votes[idx]}%`;
        });

        this.openModal('modalAudience');
    },

    async useLifelinePhone() {
        if (this.lifelines.phone || this.isAnsweringLocked) return;
        this.lifelines.phone = true;
        document.getElementById('llPhone').disabled = true;
        AudioSys.playLifeline();

        const res = await GameAPI.phonePhilosopher(
            this.currentQuestion.id,
            this.currentQuestion.correct,
            this.currentQuestion.difficulty || 1
        );

        document.getElementById('expertName').innerText = res.expert || "Karl Marx";
        document.getElementById('expertAdviceText').innerHTML = res.advice || "Tôi khuyên bạn nên chọn đáp án đúng!";

        this.openModal('modalPhone');
    },

    async useLifelineSwitch() {
        if (this.lifelines.switch || this.isAnsweringLocked) return;
        if (!confirm("Bạn có chắc chắn muốn đổi sang một câu hỏi triết học khác cùng cấp độ?")) return;

        this.lifelines.switch = true;
        document.getElementById('llSwitch').disabled = true;
        AudioSys.playLifeline();

        const newQ = await GameAPI.switchQuestion(this.currentQuestion.id, this.currentQuestion.difficulty || 1);
        if (newQ) {
            this.currentQuestion = newQ;
            this.questions[this.currentLevel - 1] = newQ;
            this.loadQuestionForCurrentLevel();
        }
    },

    // ==================== MODALS & STUDY ====================
    async loadBankQuestions() {
        this.allBankQuestions = await GameAPI.getAllQuestions();
    },

    openStudyModal() {
        this.renderStudyQuestions(this.allBankQuestions);
        this.openModal('modalStudy');
    },

    filterStudyQuestions() {
        const query = document.getElementById('studySearchInput').value.toLowerCase().trim();
        const cat = document.getElementById('studyCategorySelect').value;

        const filtered = this.allBankQuestions.filter(q => {
            const matchCat = (cat === 'ALL') || (q.category === cat);
            const matchText = !query || 
                q.question.toLowerCase().includes(query) || 
                q.explanation.toLowerCase().includes(query) ||
                q.options.some(opt => opt.toLowerCase().includes(query));
            return matchCat && matchText;
        });

        this.renderStudyQuestions(filtered);
    },

    renderStudyQuestions(list) {
        const container = document.getElementById('studyQuestionsList');
        const countInfo = document.getElementById('studyCountInfo');
        countInfo.innerText = `Hiển thị ${list.length} / ${this.allBankQuestions.length} câu hỏi`;
        
        container.innerHTML = '';
        if (list.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 20px;">Không tìm thấy câu hỏi phù hợp từ khóa.</p>';
            return;
        }

        list.forEach(q => {
            const card = document.createElement('div');
            card.className = 'study-q-card';
            card.innerHTML = `
                <div class="study-q-header">
                    <span class="study-q-id">Câu #${q.id}</span>
                    <span class="study-q-cat">${q.category} • Độ khó ${q.difficulty}</span>
                </div>
                <h4 class="study-q-title">${q.question}</h4>
                <div class="study-options-grid">
                    ${q.options.map((opt, i) => `
                        <div class="study-opt ${i === q.correct ? 'is-correct' : ''}">
                            <strong>${['A', 'B', 'C', 'D'][i]}:</strong> ${opt}
                        </div>
                    `).join('')}
                </div>
                <p class="study-exp"><strong>Luận giải:</strong> ${q.explanation}</p>
            `;
            container.appendChild(card);
        });
    },

    async openLeaderboardModal() {
        const tbody = document.getElementById('leaderboardTbody');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Đang tải bảng vàng...</td></tr>';
        this.openModal('modalLeaderboard');

        const list = await GameAPI.getLeaderboard();
        tbody.innerHTML = '';
        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Chưa có dữ liệu. Hãy là người đầu tiên ghi danh!</td></tr>';
            return;
        }

        list.forEach((item, idx) => {
            const tr = document.createElement('tr');
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;
            tr.innerHTML = `
                <td><strong>${medal}</strong></td>
                <td style="color:#fff; font-weight:700;">${item.playerName || 'Nhà Triết học'}</td>
                <td><span style="color:#38bdf8; font-weight:700;">Bậc ${item.levelReached || 1}</span></td>
                <td><span style="color:#fed049;">${item.title || 'Học viên'}</span></td>
                <td style="color:#00e676; font-weight:800;">${(item.score || 0).toLocaleString('vi-VN')} điểm</td>
            `;
            tbody.appendChild(tr);
        });
    },

    openReviewModal() {
        const container = document.getElementById('reviewQuestionsList');
        container.innerHTML = '';
        this.openModal('modalReview');

        if (this.answeredQuestions.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#94a3b8; padding:20px;">Chưa có câu hỏi nào được đấu.</p>';
            return;
        }

        this.answeredQuestions.forEach((item, idx) => {
            const q = item.question;
            const card = document.createElement('div');
            card.className = 'study-q-card';
            card.innerHTML = `
                <div class="study-q-header">
                    <span class="study-q-id">Câu ${item.level} / 30 ${item.isCorrect ? '✅ Đúng' : '❌ Sai'}</span>
                    <span class="study-q-cat">${q.category}</span>
                </div>
                <h4 class="study-q-title">${q.question}</h4>
                <div class="study-options-grid">
                    ${q.options.map((opt, i) => {
                        let optClass = '';
                        if (i === q.correct) optClass = 'is-correct';
                        if (i === item.userChoice && !item.isCorrect) optClass = 'study-opt wrong';
                        return `
                            <div class="study-opt ${optClass}">
                                <strong>${['A', 'B', 'C', 'D'][i]}:</strong> ${opt}
                                ${i === item.userChoice ? ' 👈 (Lựa chọn của bạn)' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                <p class="study-exp"><strong>Luận giải:</strong> ${q.explanation}</p>
            `;
            container.appendChild(card);
        });
    },

    showScreen(screenId) {
        document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    GameApp.init();
});
