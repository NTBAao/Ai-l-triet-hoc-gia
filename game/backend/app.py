# -*- coding: utf-8 -*-
"""
Backend Server for 'Ai là Triết học gia' (Who Wants to Be a Philosopher)
Powered by FastAPI & Uvicorn
"""

import json
import os
import random
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

app = FastAPI(
    title="Ai là Triết học gia API",
    description="Backend API phục vụ minigame Triết học Mác - Lênin (Trang 247 - 274)",
    version="1.0.0"
)

# Enable CORS for frontend flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "frontend"))
QUESTIONS_FILE = os.path.join(CURRENT_DIR, "questions.json")
SCORES_FILE = os.path.join(CURRENT_DIR, "leaderboard.json")

# Load questions from JSON
def load_all_questions():
    if not os.path.exists(QUESTIONS_FILE):
        raise RuntimeError("File questions.json not found!")
    with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

ALL_QUESTIONS = load_all_questions()

# Leaderboard models
class ScoreEntry(BaseModel):
    playerName: str
    score: int
    levelReached: int
    title: str
    timestamp: Optional[str] = None

class LifelineRequest(BaseModel):
    questionId: int
    correctIndex: int
    difficulty: int
    activeOptions: Optional[List[int]] = [0, 1, 2, 3]

def load_leaderboard():
    if os.path.exists(SCORES_FILE):
        try:
            with open(SCORES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_leaderboard(scores):
    with open(SCORES_FILE, "w", encoding="utf-8") as f:
        json.dump(scores, f, ensure_ascii=False, indent=2)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "game": "Ai là Triết học gia",
        "total_questions_in_bank": len(ALL_QUESTIONS),
        "topic": "Chương 3 - Triết học về con người (Giáo trình MLN111 tr. 247-274)"
    }

@app.get("/api/questions/all")
def get_all_questions():
    """Trả về toàn bộ 150 câu hỏi để phục vụ việc ôn tập/tra cứu"""
    return {
        "count": len(ALL_QUESTIONS),
        "questions": ALL_QUESTIONS
    }

@app.get("/api/questions/random")
def get_random_30_questions():
    """
    Trả về 30 câu hỏi ngẫu nhiên được sắp xếp theo 3 cấp bậc thang độ khó:
    - Câu 1 - 10: Độ khó 1 (Dễ, nhận biết cơ bản)
    - Câu 11 - 20: Độ khó 2 (Trung bình, hiểu & vận dụng)
    - Câu 21 - 30: Độ khó 3 (Khó, phân tích sâu, tư tưởng Hồ Chí Minh & thời đại)
    """
    easy_pool = [q for q in ALL_QUESTIONS if q.get("difficulty", 1) == 1]
    medium_pool = [q for q in ALL_QUESTIONS if q.get("difficulty", 1) == 2]
    hard_pool = [q for q in ALL_QUESTIONS if q.get("difficulty", 1) == 3]

    # Sample without replacement
    selected_easy = random.sample(easy_pool, min(10, len(easy_pool)))
    selected_medium = random.sample(medium_pool, min(10, len(medium_pool)))
    selected_hard = random.sample(hard_pool, min(10, len(hard_pool)))

    # If some pool is slightly short, fill from other pools
    chosen = selected_easy + selected_medium + selected_hard
    if len(chosen) < 30:
        remaining_needed = 30 - len(chosen)
        chosen_ids = {q["id"] for q in chosen}
        remaining_pool = [q for q in ALL_QUESTIONS if q["id"] not in chosen_ids]
        chosen += random.sample(remaining_pool, remaining_needed)

    # Return question sequence formatted for game playthrough
    return {
        "count": len(chosen),
        "questions": chosen
    }

@app.post("/api/lifeline/audience")
def lifeline_audience(req: LifelineRequest):
    """
    Trợ giúp: Hỏi ý kiến Hội đồng Triết gia (Hội trường khán giả)
    Tính toán tỷ lệ % bình chọn thuyết phục cho 4 đáp án
    """
    correct = req.correctIndex
    active = req.activeOptions if req.activeOptions else [0, 1, 2, 3]

    # Confidence depends on difficulty
    if req.difficulty == 1:
        correct_pct = random.randint(70, 88)
    elif req.difficulty == 2:
        correct_pct = random.randint(55, 75)
    else:
        correct_pct = random.randint(42, 62)

    remaining_pct = 100 - correct_pct
    other_active = [opt for opt in active if opt != correct]
    
    votes = {0: 0, 1: 0, 2: 0, 3: 0}
    votes[correct] = correct_pct

    if len(other_active) == 1:
        votes[other_active[0]] = remaining_pct
    elif len(other_active) > 1:
        # Distribute remaining randomly among active incorrect
        cuts = sorted([random.randint(0, remaining_pct) for _ in range(len(other_active) - 1)])
        cuts = [0] + cuts + [remaining_pct]
        for i, opt in enumerate(other_active):
            votes[opt] = cuts[i+1] - cuts[i]

    return {
        "votes": [votes[0], votes[1], votes[2], votes[3]],
        "message": f"Hội đồng Triết gia đã hoàn tất biểu quyết!"
    }

@app.post("/api/lifeline/phone")
def lifeline_phone(req: LifelineRequest):
    """
    Trợ giúp: Gọi điện thoại cho Nhà Thông Thái / Triết gia kiệt xuất
    (C. Mác, Ph. Ăngghen, V.I. Lênin, Chủ tịch Hồ Chí Minh)
    """
    philosophers = [
        {"name": "Karl Marx (C. Mác)", "avatar": "marx", "quote": "Bản chất con người là tổng hòa các quan hệ xã hội. Dựa theo các quy luật duy vật lịch sử, ta tin chắc đáp án là..."},
        {"name": "Friedrich Engels (Ph. Ăngghen)", "avatar": "engels", "quote": "Lao động đã sáng tạo ra chính bản thân con người. Xét theo phép biện chứng duy vật, ta khuyên bạn chọn..."},
        {"name": "V.I. Lênin", "avatar": "lenin", "quote": "Thực tiễn là tiêu chuẩn của chân lý. Đọc kỹ câu hỏi và các tài liệu chính luận thì lựa chọn sáng suốt nhất là..."},
        {"name": "Chủ tịch Hồ Chí Minh", "avatar": "hcm", "quote": "Con người vừa là mục tiêu vừa là động lực của cách mạng, vì lợi ích trăm năm phải trồng người. Theo Bác, cháu nên cân nhắc kỹ phương án..."}
    ]

    selected_expert = random.choice(philosophers)
    correct_char = ["A", "B", "C", "D"][req.correctIndex]
    
    # 85-95% chance advisor gives correct answer
    is_confident = random.random() < 0.90
    advised_char = correct_char if is_confident else random.choice([c for c in ["A", "B", "C", "D"] if c != correct_char])

    confidence_text = "Tôi chắc chắn 95%" if is_confident else "Theo suy luận của tôi khoảng 75%"

    return {
        "expert": selected_expert["name"],
        "avatar": selected_expert["avatar"],
        "advice": f"{selected_expert['quote']} **[{advised_char}]**! ({confidence_text})",
        "recommendedOption": advised_char
    }

@app.post("/api/lifeline/switch")
def lifeline_switch(req: LifelineRequest):
    """
    Trợ giúp: Đổi câu hỏi khác cùng độ khó
    """
    pool = [q for q in ALL_QUESTIONS if q.get("difficulty", 1) == req.difficulty and q["id"] != req.questionId]
    if not pool:
        pool = [q for q in ALL_QUESTIONS if q["id"] != req.questionId]
    
    new_q = random.choice(pool)
    return {
        "newQuestion": new_q
    }

@app.get("/api/leaderboard")
def get_leaderboard():
    scores = load_leaderboard()
    # Sort descending by score, then level
    scores = sorted(scores, key=lambda x: (x.get("score", 0), x.get("levelReached", 0)), reverse=True)[:20]
    return scores

@app.post("/api/leaderboard")
def post_score(entry: ScoreEntry):
    scores = load_leaderboard()
    scores.append(entry.dict())
    scores = sorted(scores, key=lambda x: (x.get("score", 0), x.get("levelReached", 0)), reverse=True)[:50]
    save_leaderboard(scores)
    return {"message": "Score recorded successfully!", "totalEntries": len(scores)}

# Serve Frontend static assets
if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

if __name__ == "__main__":
    import sys
    if sys.platform == 'win32':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
    print("=" * 65)
    print(" AI LA TRIET HOC GIA - GAME SHOW TRIET HOC MAC - LENIN")
    print(" Giao trinh MLN111 (Trang 247 - 274) - Ngan hang 150 cau hoi")
    print(" Truy cap Web Game tai: http://localhost:8000")
    print(" API Documentation: http://localhost:8000/docs")
    print("=" * 65)
    uvicorn.run(app, host="0.0.0.0", port=8000)

