/**
 * API Service for 'Ai là Triết học gia'
 * Leaderboard powered by Firebase Firestore (real-time, cross-device)
 * Falls back to localStorage if Firebase is unavailable
 */

// =====================================================================
// FIREBASE CONFIG - Bảng vàng thực sự cho tất cả người chơi
// =====================================================================
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDemo-ReplaceWithYourKey",
    authDomain: "ai-la-triet-hoc-gia.firebaseapp.com",
    projectId: "ai-la-triet-hoc-gia",
    storageBucket: "ai-la-triet-hoc-gia.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000"
};

// Firebase được load động từ CDN
let db = null;
let firebaseReady = false;

async function initFirebase() {
    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js');
        const { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp }
            = await import('https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js');

        const app = initializeApp(FIREBASE_CONFIG);
        db = getFirestore(app);
        firebaseReady = true;
        console.log('✅ Firebase Firestore connected - Bảng vàng toàn cầu sẵn sàng!');

        // Expose Firestore helpers
        window._fs = { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp };
    } catch (err) {
        console.warn('⚠️ Firebase unavailable, using localStorage fallback:', err.message);
        firebaseReady = false;
    }
}

// Khởi động Firebase ngay khi script load
initFirebase();

// =====================================================================
const GameAPI = {
    async getRandomQuestions() {
        return this.getFallbackQuestions(30);
    },

    async getAllQuestions() {
        return this.getFallbackQuestions(150);
    },

    // Audience poll lifeline - client-side calculation
    async getAudienceVotes(questionId, correctIndex, difficulty, activeOptions) {
        const active = activeOptions || [0, 1, 2, 3];
        let correctPct;
        if (difficulty === 1) correctPct = 70 + Math.floor(Math.random() * 18);
        else if (difficulty === 2) correctPct = 55 + Math.floor(Math.random() * 20);
        else correctPct = 42 + Math.floor(Math.random() * 20);

        const remaining = 100 - correctPct;
        const others = active.filter(o => o !== correctIndex);
        const votes = [0, 0, 0, 0];
        votes[correctIndex] = correctPct;

        if (others.length === 1) {
            votes[others[0]] = remaining;
        } else if (others.length > 1) {
            let left = remaining;
            for (let i = 0; i < others.length - 1; i++) {
                const share = Math.floor(Math.random() * left);
                votes[others[i]] = share;
                left -= share;
            }
            votes[others[others.length - 1]] = left;
        }
        return { votes, message: "Hội đồng Triết gia đã hoàn tất biểu quyết!" };
    },

    // Phone a philosopher - client-side
    async phonePhilosopher(questionId, correctIndex, difficulty) {
        const philosophers = [
            { name: "Karl Marx (C. Mác)", quote: "Bản chất con người là tổng hòa các quan hệ xã hội. Dựa theo các quy luật duy vật lịch sử, ta tin chắc đáp án là" },
            { name: "Friedrich Engels (Ph. Ăngghen)", quote: "Lao động đã sáng tạo ra chính bản thân con người. Xét theo phép biện chứng duy vật, ta khuyên bạn chọn" },
            { name: "V.I. Lênin", quote: "Thực tiễn là tiêu chuẩn của chân lý. Đọc kỹ câu hỏi và các tài liệu chính luận thì lựa chọn sáng suốt nhất là" },
            { name: "Chủ tịch Hồ Chí Minh", quote: "Con người vừa là mục tiêu vừa là động lực của cách mạng. Theo Bác, cháu nên cân nhắc kỹ phương án" }
        ];
        const expert = philosophers[Math.floor(Math.random() * philosophers.length)];
        const isConfident = Math.random() < 0.90;
        const allChars = ['A','B','C','D'];
        const correctChar = allChars[correctIndex];
        const advised = isConfident ? correctChar : allChars.filter(c => c !== correctChar)[Math.floor(Math.random() * 3)];
        const confidence = isConfident ? "Tôi chắc chắn 95%" : "Theo suy luận của tôi khoảng 75%";
        return {
            expert: expert.name,
            advice: `${expert.quote} **[${advised}]**! (${confidence})`,
            recommendedOption: advised
        };
    },

    // Switch question - client-side
    async switchQuestion(questionId, difficulty) {
        const all = await this.getAllQuestions();
        const pool = all.filter(q => q.id !== questionId && q.difficulty === difficulty);
        return pool.length ? pool[Math.floor(Math.random() * pool.length)] : all[0];
    },

    // =====================================================================
    // LEADERBOARD - Firebase Firestore (thực sự lưu cho tất cả người chơi)
    // =====================================================================
    async getLeaderboard() {
        // Thử Firebase trước
        if (firebaseReady && db && window._fs) {
            try {
                const { collection, getDocs, query, orderBy, limit } = window._fs;
                const q = query(
                    collection(db, 'leaderboard'),
                    orderBy('score', 'desc'),
                    limit(20)
                );
                const snapshot = await getDocs(q);
                const list = [];
                snapshot.forEach(doc => list.push(doc.data()));
                if (list.length > 0) {
                    console.log(`📊 Đã tải ${list.length} kết quả từ Firebase`);
                    return list;
                }
            } catch (err) {
                console.warn('Firebase read error:', err.message);
            }
        }

        // Fallback: localStorage
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
        // Ghi vào localStorage trước (instant)
        let local = localStorage.getItem('alt_leaderboard');
        let list = local ? JSON.parse(local) : [];
        list.push({ ...scoreEntry, timestamp: new Date().toISOString() });
        list.sort((a, b) => (b.score || 0) - (a.score || 0));
        localStorage.setItem('alt_leaderboard', JSON.stringify(list.slice(0, 50)));

        // Ghi vào Firebase (global leaderboard)
        if (firebaseReady && db && window._fs) {
            try {
                const { collection, addDoc, serverTimestamp } = window._fs;
                await addDoc(collection(db, 'leaderboard'), {
                    ...scoreEntry,
                    timestamp: serverTimestamp()
                });
                console.log('🏆 Score saved to Firebase global leaderboard!');
            } catch (err) {
                console.warn('Firebase write error (score saved locally):', err.message);
            }
        } else {
            console.log('💾 Score saved to localStorage (Firebase not connected)');
        }
    },

    // =====================================================================
    // FALLBACK: Load questions from static file
    // =====================================================================
    async getFallbackQuestions(count = 30) {
        const paths = ['data/questions.json', './data/questions.json'];
        for (const path of paths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    const data = await res.json();
                    if (count >= data.length) return data;
                    const easy = data.filter(q => q.difficulty === 1);
                    const med  = data.filter(q => q.difficulty === 2);
                    const hard = data.filter(q => q.difficulty === 3);
                    const pickEasy = [...easy].sort(() => 0.5 - Math.random()).slice(0, 10);
                    const pickMed  = [...med].sort(() => 0.5 - Math.random()).slice(0, 10);
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