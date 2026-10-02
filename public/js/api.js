/**
 * API Service for 'Ai là Triết học gia'
 * Communicates with FastAPI backend server with local storage fallback
 */

const API_BASE = window.location.origin.startsWith('http') && !window.location.origin.includes('file:')
    ? window.location.origin
    : 'http://localhost:8000';

const GameAPI = {
    // Fetch 30 randomized questions for the match
    async getRandomQuestions() {
        try {
            const res = await fetch(`${API_BASE}/api/questions/random`);
            if (!res.ok) throw new Error('API server unavailable');
            const data = await res.json();
            return data.questions;
        } catch (err) {
            console.warn('Backend API not responding, loading from static fallback:', err);
            return this.getFallbackQuestions(30);
        }
    },

    // Fetch all 150 questions for study mode
    async getAllQuestions() {
        try {
            const res = await fetch(`${API_BASE}/api/questions/all`);
            if (!res.ok) throw new Error('API server unavailable');
            const data = await res.json();
            return data.questions;
        } catch (err) {
            console.warn('Backend API unavailable, loading fallback bank:', err);
            return this.getFallbackQuestions(150);
        }
    },

    // Audience poll lifeline
    async getAudienceVotes(questionId, correctIndex, difficulty, activeOptions) {
        try {
            const res = await fetch(`${API_BASE}/api/lifeline/audience`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, correctIndex, difficulty, activeOptions })
            });
            if (res.ok) return await res.json();
        } catch (err) {}
        
        // Client fallback calculation
        const votes = [10, 10, 10, 10];
        votes[correctIndex] = 70;
        return { votes, message: "Hội đồng Triết gia đã biểu quyết!" };
    },

    // Phone a philosopher lifeline
    async phonePhilosopher(questionId, correctIndex, difficulty) {
        try {
            const res = await fetch(`${API_BASE}/api/lifeline/phone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, correctIndex, difficulty })
            });
            if (res.ok) return await res.json();
        } catch (err) {}

        // Client fallback
        const char = ['A', 'B', 'C', 'D'][correctIndex];
        return {
            expert: "Karl Marx (C. Mác)",
            avatar: "marx",
            advice: `Dựa theo các quy luật duy vật lịch sử trong Giáo trình MLN111, ta khuyên bạn nên chọn **[${char}]**! (Tôi chắc chắn 95%)`,
            recommendedOption: char
        };
    },

    // Switch question lifeline
    async switchQuestion(questionId, difficulty) {
        try {
            const res = await fetch(`${API_BASE}/api/lifeline/switch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, correctIndex: 0, difficulty })
            });
            if (res.ok) {
                const data = await res.json();
                return data.newQuestion;
            }
        } catch (err) {}

        const all = await this.getAllQuestions();
        const pool = all.filter(q => q.id !== questionId && q.difficulty === difficulty);
        return pool.length ? pool[Math.floor(Math.random() * pool.length)] : all[0];
    },

    // Leaderboard
    async getLeaderboard() {
        try {
            const res = await fetch(`${API_BASE}/api/leaderboard`);
            if (res.ok) return await res.json();
        } catch (err) {}

        const local = localStorage.getItem('alt_leaderboard');
        return local ? JSON.parse(local) : [
            { playerName: "Cử nhân Ưu tú", score: 1000000000, levelReached: 30, title: "Đại Triết gia Mác-xít Nhân loại" },
            { playerName: "Sinh viên K65", score: 400000000, levelReached: 25, title: "Giáo sư - Viện sĩ Triết học" },
            { playerName: "Triết gia Trẻ", score: 150000000, levelReached: 20, title: "Phó Giáo sư Triết học" },
            { playerName: "Người tìm Chân lý", score: 60000000, levelReached: 15, title: "Tiến sĩ Triết học Duy vật" },
            { playerName: "Tân binh MLN", score: 22000000, levelReached: 10, title: "Thạc sĩ Triết học Mác-xít" }
        ];
    },

    async saveScore(scoreEntry) {
        try {
            await fetch(`${API_BASE}/api/leaderboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scoreEntry)
            });
        } catch (err) {}

        // Also save to localStorage
        let local = localStorage.getItem('alt_leaderboard');
        let list = local ? JSON.parse(local) : [];
        list.push(scoreEntry);
        list.sort((a, b) => (b.score || 0) - (a.score || 0));
        localStorage.setItem('alt_leaderboard', JSON.stringify(list.slice(0, 20)));
    },

    async getFallbackQuestions(count = 30) {
        // Look in data/questions.json (for frontend static deployments) or ../backend/questions.json
        const paths = ['data/questions.json', './data/questions.json', '../backend/questions.json'];
        for (const path of paths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    const data = await res.json();
                    if (count >= data.length) return data;
                    // Filter into 3 difficulty tiers for high-quality game experience
                    const easy = data.filter(q => q.difficulty === 1);
                    const med = data.filter(q => q.difficulty === 2);
                    const hard = data.filter(q => q.difficulty === 3);

                    const pickEasy = [...easy].sort(() => 0.5 - Math.random()).slice(0, 10);
                    const pickMed = [...med].sort(() => 0.5 - Math.random()).slice(0, 10);
                    const pickHard = [...hard].sort(() => 0.5 - Math.random()).slice(0, 10);

                    let result = [...pickEasy, ...pickMed, ...pickHard];
                    if (result.length < 30) {
                        const remaining = data.filter(q => !result.some(r => r.id === q.id));
                        result = result.concat(remaining.sort(() => 0.5 - Math.random()).slice(0, 30 - result.length));
                    }
                    return result;
                }
            } catch (e) {}
        }
        return [];
    }
};

