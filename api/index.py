# -*- coding: utf-8 -*-
import json
import os
import random
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(title="Ai là Triết học gia")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_FILE = os.path.join(ROOT_DIR, "data", "questions.json")
if not os.path.exists(DATA_FILE):
    DATA_FILE = os.path.join(ROOT_DIR, "game", "backend", "questions.json")

def load_questions():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

ALL_QUESTIONS = load_questions()

# Models
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

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "total_questions": len(ALL_QUESTIONS),
        "game": "Ai là Triết học gia"
    }

@app.get("/api/questions/all")
def get_all_questions():
    return {"count": len(ALL_QUESTIONS), "questions": ALL_QUESTIONS}

@app.get("/api/questions/random")
def get_random_questions():
    easy = [q for q in ALL_QUESTIONS if q.get("difficulty", 1) == 1]
    med = [q for q in ALL_QUESTIONS if q.get("difficulty", 1) == 2]
    hard = [q for q in ALL_QUESTIONS if q.get("difficulty", 1) == 3]

    chosen_easy = random.sample(easy, min(10, len(easy)))
    chosen_med = random.sample(med, min(10, len(med)))
    chosen_hard = random.sample(hard, min(10, len(hard)))

    chosen = chosen_easy + chosen_med + chosen_hard
    if len(chosen) < 30:
        remaining = [q for q in ALL_QUESTIONS if q not in chosen]
        chosen += random.sample(remaining, min(30 - len(chosen), len(remaining)))

    return {"count": len(chosen), "questions": chosen}

@app.post("/api/lifeline/audience")
def lifeline_audience(req: LifelineRequest):
    correct = req.correctIndex
    active = req.activeOptions if req.activeOptions else [0, 1, 2, 3]
    correct_pct = random.randint(70, 85) if req.difficulty == 1 else (random.randint(55, 75) if req.difficulty == 2 else random.randint(45, 60))
    rem = 100 - correct_pct
    other = [o for o in active if o != correct]
    votes = {0: 0, 1: 0, 2: 0, 3: 0}
    votes[correct] = correct_pct
    if len(other) == 1:
        votes[other[0]] = rem
    elif len(other) > 1:
        cuts = sorted([random.randint(0, rem) for _ in range(len(other) - 1)])
        cuts = [0] + cuts + [rem]
        for i, opt in enumerate(other):
            votes[opt] = cuts[i+1] - cuts[i]
    return {"votes": [votes[0], votes[1], votes[2], votes[3]], "message": "Hội đồng Triết gia đã biểu quyết!"}

@app.post("/api/lifeline/phone")
def lifeline_phone(req: LifelineRequest):
    philosophers = [
        {"name": "Karl Marx (C. Mác)", "quote": "Bản chất con người là tổng hòa các quan hệ xã hội. Theo quy luật duy vật lịch sử, ta tin chắc đáp án là..."},
        {"name": "Friedrich Engels (Ph. Ăngghen)", "quote": "Lao động đã sáng tạo ra con người. Xét theo phép biện chứng duy vật, ta khuyên bạn chọn..."},
        {"name": "V.I. Lênin", "quote": "Thực tiễn là tiêu chuẩn của chân lý. Đọc kỹ câu hỏi thì lựa chọn sáng suốt nhất là..."},
        {"name": "Chủ tịch Hồ Chí Minh", "quote": "Con người vừa là mục tiêu vừa là động lực của cách mạng. Theo Bác, cháu nên cân nhắc kỹ phương án..."}
    ]
    exp = random.choice(philosophers)
    c_char = ["A", "B", "C", "D"][req.correctIndex]
    return {
        "expert": exp["name"],
        "advice": f"{exp['quote']} **[{c_char}]**! (Tôi chắc chắn 95%)",
        "recommendedOption": c_char
    }

@app.post("/api/lifeline/switch")
def lifeline_switch(req: LifelineRequest):
    pool = [q for q in ALL_QUESTIONS if q.get("difficulty", 1) == req.difficulty and q["id"] != req.questionId]
    if not pool: pool = [q for q in ALL_QUESTIONS if q["id"] != req.questionId]
    return {"newQuestion": random.choice(pool) if pool else ALL_QUESTIONS[0]}

# Serve Root Index HTML directly
@app.get("/", response_class=HTMLResponse)
def read_root():
    index_path = os.path.join(ROOT_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read(), status_code=200)
    return HTMLResponse("<h1>Ai Là Triết Học Gia</h1><p>Đang khởi tạo...</p>", status_code=200)

# Serve static CSS, JS, DATA
for folder in ["css", "js", "data", "assets"]:
    f_path = os.path.join(ROOT_DIR, folder)
    if os.path.exists(f_path):
        app.mount(f"/{folder}", StaticFiles(directory=f_path), name=folder)

